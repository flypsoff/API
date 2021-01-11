const mongoose = require('mongoose')

const user = new mongoose.Schema({
    email: {
        type: String
    }, 
    password: {
        type: String
    },
    name: {
        type: String
    },
    age: {
        type: Number
    },
    country: {
        type: String
    },
    status: {
        type: String
    },
    posts: {
        type: Array
    }
})

const User = mongoose.model('user', user)

module.exports = User