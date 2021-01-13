const express = require('express')
const todos = express.Router()

const authMiddleware = require('../middleware/auth')

const User = require('../DB/User')

todos.get('/current', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        return res.json({ todos: user.todos.current })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.get('/completed', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        return res.json({ todos: user.todos.completed })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/current/add', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        const todo = req.body.todo
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: {
                        completed: user.todos.completed,
                        current: [
                            todo,
                            ...user.todos.current
                        ]
                    }
                }
            })

        res.json({ message: 'Todo was added', todo })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/completed/add', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        let deleted
        const newCurrentTodos = user.todos.current.filter(item => {
            if (item.id === req.body.id) {
                deleted = item
                return false
            }
            return true
        })

        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: {
                        completed: [
                            deleted,
                            ...user.todos.completed
                        ],
                        current: [
                            ...newCurrentTodos
                        ]
                    }
                }
            })

        res.json({ message: 'Updated is done', deleted, newCurrentTodos })
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
        
        const newCompleted = user.todos.completed.filter(item => item.id !== req.body.id)
        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: {
                        ...user.todos,
                        completed: newCompleted
                    }
                }
            })
        
        res.send({ message: 'Todo was deleted', newCompleted })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

module.exports = todos