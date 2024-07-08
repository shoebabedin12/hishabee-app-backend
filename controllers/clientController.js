const Client = require("../models/clientModel");
const clientPayment = require("../models/clientPayment");
const ClientPayment = require("../models/clientPayment");
const cron = require("node-cron");

const updatePaymentDetails = async (client) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let paymentDetails = client.paymentDetails || [];
    const paymentExists = paymentDetails.some((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      return (
        paymentDate.getMonth() + 1 === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });

    if (!paymentExists && isClientCreatedInCurrentMonth(client, currentDate)) {
      const paymentDate = new Date();
      const newClientPayment = await ClientPayment.create({
        paymentDate: paymentDate,
        paymentAmount: 100,
        paymentStatus: "pending"
      });

      await newClientPayment.save();

      client.paymentDetails.push(newClientPayment._id);

      await client.save();

      res.send("Payment details created successfully for client:", client.name);
    } else {
      console.log("Payment details already exist for client:", client.name);
    }
  } catch (error) {
    console.error("Error updating payment details:", error);
  }
};

// Schedule the updatePaymentDetails function to run every month (first day of the month at 00:00)

const deleteAllPaymentDetails = async (req, res) => {
  try {
    // Delete paymentDetails for all clients
    await Client.updateMany({}, { $unset: { paymentDetails: "" } });

    res.json({ message: "All paymentDetails data deleted successfully" });
  } catch (error) {
    console.error("Error deleting paymentDetails data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addClientController = async (req, res) => {
  const clientsData = req.body.users;

  if (!clientsData || !Array.isArray(clientsData) || clientsData.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide valid client data" });
  }
  try {
    for (const clientData of clientsData) {
      const { name, macAddress, device, roomNo } = clientData;

      if (!name || !macAddress || !device || !roomNo) {
        return res
          .status(400)
          .json({ message: "Please enter all fields for each client" });
      }

      const existingClient = await Client.findOne({ name: name });

      if (existingClient) {
        return res.status(403).json({ message: "Client already exists" });
      }

      const newClient = new Client({
        name,
        macAddress,
        device,
        roomNo
      });

      await newClient.save();

      // Update payment details after saving the new client
      await updatePaymentDetails(newClient);
    }
    return res.status(200).json({ message: "Clients created successfully" });
  } catch (error) {
    console.error("Error creating clients:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const allClient = async (req, res) => {
  try {
    const allClients = await Client.find().populate("paymentDetails");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Month is zero-based

    const clientsData = allClients.map((client) => {
      // Filter payment details for the current month
      const currentMonthPayments = client.paymentDetails.filter((payment) => {
        const paymentDate = new Date(payment.paymentMonth);
        return paymentDate.getMonth() === currentMonth;
      });

      const paymentStatus =
        currentMonthPayments.length > 0
          ? currentMonthPayments[0].paymentStatus
          : "pending";

      const formattedPaymentDetails = client.paymentDetails.map(
        (paymentDetail) => ({
          key: paymentDetail._id,
          clientId: paymentDetail.clientId,
          paymentAmount: paymentDetail.paymentAmount,
          paymentDate: paymentDetail.paymentDate,
          paymentMonth:
            paymentDetail.paymentMonth, // Convert array to string
          paymentStatus: paymentDetail.paymentStatus,
          createdAt: paymentDetail.createdAt,
          updatedAt: paymentDetail.updatedAt
        })
      );
      return {
        key: client._id,
        name: client.name,
        macAddress: client.macAddress,
        device: client.device,
        roomNo: client.roomNo,
        status: client.status,
        paymentStatus: paymentStatus,
        paymentDetails: formattedPaymentDetails
      };
    });

    res.json({
      message: "Fetch all data",
      data: clientsData
    });
  } catch (error) {
    console.error("Error fetching all clients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateClientController = async (req, res) => {
  const { device, key, macAddress, name, roomNo, status } = req.body;
  if (!device || !key || !macAddress || !name || !roomNo || !status) {
    return res.status(403).json({
      message: "Missing or invalid parameters for updating client information"
    });
  }
  try {
    const existingClient = await Client.findById({ _id: key });

    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    existingClient.device = device;
    existingClient.macAddress = macAddress;
    existingClient.name = name;
    existingClient.roomNo = roomNo;
    existingClient.status = status;

    await existingClient.save();

    res.status(200).json({
      success: `User ${existingClient.name} updated successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSingleClientController = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedClient = await Client.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addClientPaymentHistoryController = async (req, res) => {
  try {
    const {
      clientId,
      paymentDate,
      paymentMonth,
      paymentAmount,
      paymentStatus
    } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    const existingClient = await Client.findById(clientId);

    if (!existingClient) {
      return res
        .status(404)
        .json({ message: `Client with ID ${clientId} not found` });
    }

    // existingClient.paymentDetails.push({
    //   paymentDate,
    //   paymentMonth,
    //   paymentAmount,
    //   paymentStatus
    // });

    // await existingClient.save();

    const clientPayment = new ClientPayment({
      clientId,
      paymentDate,
      paymentMonth,
      paymentAmount,
      paymentStatus
    });

    // Save the client payment record to the database
    await clientPayment.save();

    // Add the ClientPayment ID to the existingClient.paymentDetails array
    existingClient.paymentDetails.push(clientPayment._id);

    // Save the updated existingClient document
    await existingClient.save();

    return res
      .status(200)
      .json({ message: "Payment details added successfully" });
  } catch (error) {
    console.error("Error adding payment details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllClientPaymentsController = async (req, res) => {
  try {
    // Fetch all users from the database using the Client model
    const users = await Client.find();

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    // Filter users with pending payments for the current month
    const usersWithPendingPayments = getUsersWithPendingPayments(
      users,
      currentMonth,
      currentYear
    );

    // Extract user IDs and payment status
    const pendingPayments = extractPendingPayments(usersWithPendingPayments);

    // Send the user IDs and payment status as response
    res.json({ pendingPayments });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching users with pending payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersWithPendingPayments = (users, currentMonth, currentYear) => {
  return users.filter(
    (user) =>
      user.paymentDetails &&
      user.paymentDetails.some(
        (payment) =>
          payment.paymentStatus === "pending" &&
          new Date(payment.paymentDate).getMonth() + 1 === currentMonth &&
          new Date(payment.paymentDate).getFullYear() === currentYear
      )
  );
};

const extractPendingPayments = (usersWithPendingPayments) => {
  return usersWithPendingPayments.map((user) => ({
    userId: user._id,
    paymentStatus: user.paymentDetails.find(
      (payment) => payment.paymentStatus === "pending"
    ).paymentStatus
  }));
};

const deletePaymentDetailsController = async () => {
  try {
    const { id } = req.body;
    console.log(req.body);
    // const deletedClient = await Client.findByIdAndDelete({ _id: id });
    // res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateSingleClientPaymentDetails = async (req, res) => {
  try {
    const { id, paymentMonth, paymentAmount, paymentStatus } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Missing required id fields" });
    }
    if (!paymentMonth) {
      return res
        .status(400)
        .json({ message: "Missing required paymentMonth fields" });
    }
    if (!paymentAmount) {
      return res
        .status(400)
        .json({ message: "Missing required paymentAmount fields" });
    }
    if (!paymentStatus) {
      return res
        .status(400)
        .json({ message: "Missing required paymentStatus fields" });
    }

    // Update the payment details of the specified client
    const client = await ClientPayment.findOneAndUpdate(
      { _id: id }, // Find the client with the given key and matching paymentHistoryId
      {
        $set: {
          paymentMonth: paymentMonth,
          paymentAmount: paymentAmount,
          paymentStatus: paymentStatus
        }
      }, // Update the matching payment detail
      { new: true } // Return the updated document
    );

    if (!client) {
      return res
        .status(404)
        .json({ message: "Client or payment history not found" });
    }

    res.json({ message: "Payment history updated successfully", client });
  } catch (error) {
    console.error("Error updating client payment details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSingleClientPaymentDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedClient = await ClientPayment.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addClientController,
  allClient,
  updateClientController,
  deleteSingleClientController,
  addClientPaymentHistoryController,
  getAllClientPaymentsController,
  updatePaymentDetails,
  deletePaymentDetailsController,
  updateSingleClientPaymentDetails,
  deleteAllPaymentDetails,
  deleteSingleClientPaymentDetails
};
