const express = require("express");
const router = express.Router();
const {
  addClientController,
  allClient,
  updateClientController,
  deleteSingleClientController,
  addClientPaymentHistoryController,
  getAllClientPaymentsController,
  deletePaymentDetailsController,
  updateSingleClientPaymentDetails,
  deleteAllPaymentDetails,
  deleteSingleClientPaymentDetails,
  updatePaymentDetails
} = require("../../controllers/clientController");
const { validateClientPayment, authorizeClientPayment } = require("../../middleware/clientPaymentMiddleware");
const { isAuthenticated } = require("../../middleware/authMiddleware");

// get request
router.get("/all-client",  allClient);
router.get("/all-client-payments-status", getAllClientPaymentsController);
// post request
router.post("/add-client", addClientController);
router.post("/add-client-payment-history", addClientPaymentHistoryController);
router.post("/update-single-client-details", updateSingleClientPaymentDetails);
router.post("/add-all-client", updatePaymentDetails);
// delete request
router.delete("/delete-client", deleteSingleClientController);
router.delete("/delete-payment-details", deletePaymentDetailsController);
router.delete(
  "/delete-single-client-details",
  deleteSingleClientPaymentDetails
);
router.delete("/delete-all", deleteAllPaymentDetails);
// update request
router.put("/update-client", updateClientController);

module.exports = router;
