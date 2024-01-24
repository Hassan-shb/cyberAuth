const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/cyberauth");


connect.then( () => {
    console.log("Database Connected Successfully");
}).catch(() => {
    console.log("Database cannot be connected");
});


const loginScheme = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const collection = new mongoose.model("users", loginScheme);

module.exports = collection;



