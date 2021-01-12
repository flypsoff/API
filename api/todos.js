const express = require('express')
const todos = express.Router()

const User = require('../DB/User')

todos.post('/current', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        return res.json({ todos: user.todos.current })
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

todos.post('/completed', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        return res.json({ todos: user.todos.completed })
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

module.exports = todos