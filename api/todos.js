const express = require('express')
const todos = express.Router()

const authMiddleware = require('../middleware/auth')

const User = require('../DB/User')

todos.get('/current', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        const isNotCompleted = user.todos.filter(item => !item.completed)
        return res.json({ todos: isNotCompleted })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.get('/completed', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        const isCompleted = user.todos.filter(item => item.completed)
        return res.json({ todos: isCompleted })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/current', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        const todo = req.body.todo
        if (!todo) {
            return res.status(404).json({ message: 'Please try againg' })
        }
        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: [
                        todo,
                        ...user.todos
                    ]
                }
            })

        const todos = [
            req.body.todo,
            ...user.todos.filter( item => !item.completed )
        ]
        
        res.json({ message: 'Todo was added', todos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/completed', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }

        const id = req.body.id
        if (!id) {
            return res.status(404).json({ message: 'Please try againg' })
        }

        const completed = user.todos.map(item => {
            if (item.id === id) {
                item.completed = true
            }
            return item
        })

        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: completed
                }
            })  

        const todos = user.todos.filter(item => !item.completed)

        res.json({ message: 'Todo is completed', todos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/completed/delete', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }

        const id = req.body.id
        if (!id) {
            return res.status(404).json({ message: 'Please try againg' })
        }
        
        const deletedTodos = user.todos.filter(item => item.id === id ? false : true)

        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: deletedTodos
                }
            })  

        res.send({ message: 'Todo was deleted', deletedTodos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

module.exports = todos