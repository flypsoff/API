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
    surname: {
        type: String
    },
    birthday: {
        type: String
    },
    country: {
        type: String
    },
    status: {
        type: String
    },
    posts: {
        type: Array
    },
    todos:  {
        type: Array
    },
    cart:  {
        type: Array
    },
    deletedTodos:{
        type: Array
    }
})

const User = mongoose.model('user', user)

module.exports = User