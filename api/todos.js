const express = require('express')
const todos = express.Router()

const authMiddleware = require('../middleware/auth')

const User = require('../DB/User')

todos.get('/current', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        return res.json({ todos: user.todos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.get('/deleted', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        return res.json({ deletedTodos: user.deletedTodos })
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
            ...user.todos
        ]
        
        res.json({ message: 'Todo was added', todos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/delete', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }

        const id = req.body.id
        if (!id) {
            return res.status(404).json({ message: 'Please try againg' })
        }

        let deleted
        const todos = user.todos.filter(item => {
            if(item.id === id) {
                deleted = item
                return false
            }
            return true
        })

        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: todos,
                    deletedTodos: [
                        deleted, 
                        ...user.deletedTodos
                    ]
                }
            })

        res.json({ message: 'Todo is deleted', todos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/deleted/delete', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        const id = req.body.id
        if (!id) {
            return res.status(404).json({ message: 'Please try againg' })
        }
        
        const deletedTodos = user.deletedTodos.filter(item => item.id === id ? false : true)

        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    deletedTodos: deletedTodos
                }
            })  

        res.send({ message: 'Todo was deleted', deletedTodos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

todos.patch('/current/change', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        const id = req.body.id
        const checked = req.body.checked
        if (!id) {
            return res.status(404).json({ message: 'Please try againg' })
        }
        const todos = user.todos.map(item => {
            if(item.id === id) {
                item.completed = checked
            }
            return item
        })
        await User.updateOne({ _id: req.user.id },
            {
                $set: {
                    todos: todos
                }
            })  

        res.send({ message: 'Checkbox was changed', todos })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

module.exports = todos