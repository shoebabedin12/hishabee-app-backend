const mongoose = require('mongoose');

const mongodb = async () =>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("DB is connected"))
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongodb;