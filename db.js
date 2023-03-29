const mongoose = require('mongoose')
require('dotenv').config()


exports.createConnection = async (req, res) => {
    mongoose.connect(process.env.DB_STRING)
        .then((success) => {
            console.log("Connected with db")
        })
        .catch((error) => {
            console.log("error while connecting", error)
        })
}
