const express = require('express')
const account = express.Router()
const bcrypt = require('bcryptjs')

const { check, validationResult } = require('express-validator')

const authMiddleware = require('../middleware/auth')

const User = require('../DB/User')

account.patch('/name', authMiddleware, [
    check('state')
        .isLength({ min: 3 }).withMessage('Name must be longer than 2')
        .isAlpha().withMessage('Name must contain only letters')
], async (req, res) => {
    try {
        const arrauOfError = []

        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        
        const name = req.body.state
        if (!name) {
            arrauOfError.push('Field must be correct')
        }

        validationResult(req).errors.forEach(item => arrauOfError.push(item.msg))

        if(arrauOfError.length > 0) {
            return res.status(400).json({ message: 'Uncorrect request', error: arrauOfError })
        }

        await User.updateOne({ _id: req.user.id },
            {
                name: name
            })

        res.json({ message: 'Name was updated', value: name })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

account.patch('/surname', authMiddleware, [
    check('state')
        .isLength({ min: 3 }).withMessage('Surname must be longer than 2')
        .isAlpha().withMessage('Surname must contain only letters')
], async (req, res) => {
    try {
        const arrauOfError = []

        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }

        const surname = req.body.state
        if (!surname) {
            arrauOfError.push('Field must be correct')
        }
        
        validationResult(req).errors.forEach(item => arrauOfError.push(item.msg))

        if(arrauOfError.length > 0) {
            return res.status(400).json({ message: 'Uncorrect request', error: arrauOfError })
        }

        await User.updateOne({ _id: req.user.id },
            {
                surname: surname
            })

        res.json({ message: 'Surname was updated', value: surname })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

account.patch('/country', authMiddleware, [
    check('state')
        .isAlpha().withMessage('Contry must contain only letters')
        .isLength({ min: 2 }).withMessage('Contry must be longer than 2')
], async (req, res) => {
    try {
        const arrauOfError = []

        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }

        const country = req.body.state
        if (!country) {
            arrauOfError.push('Field must be correct')
        }

        validationResult(req).errors.forEach(item => arrauOfError.push(item.msg))

        if(arrauOfError.length > 0) {
            return res.status(400).json({ message: 'Uncorrect request', error: arrauOfError })
        }

        await User.updateOne({ _id: req.user.id },
            {
                country: country
            })

        res.json({ message: 'Country was updated', value: country })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

account.patch('/email', authMiddleware, [
    check('email')
        .isLength({ min: 4 }).withMessage('Email must be longer than 5')
        .isEmail().withMessage('Email must be correct')
],  async (req, res) => {
    try {
        const arrauOfError = []

        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            arrauOfError.push('User with this id is not found')
        }

        const email = req.body.email
        const password = req.body.pass
        if (!email || !password) {
            arrauOfError.push('Fields must be correct')
        }

        const candidate = await User.findOne({ email })
        if (candidate) {
            arrauOfError.push('This email is already using')
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid) {
            arrauOfError.push('Invalid password')
        }

        validationResult(req).errors.forEach(item => arrauOfError.push(item.msg))

        if(arrauOfError.length > 0) {
            return res.status(400).json({ message: 'Uncorrect request', error: arrauOfError })
        }

        await User.updateOne({ _id: req.user.id },
            {
                email: email
            })

        res.json({ message: 'Surname was updated', value: email })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

account.patch('/password', authMiddleware, async (req, res) => {
    try {
        const arrauOfError = []

        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            arrauOfError.push('User with this id is not found')
        }
        
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        
        if (!newPassword || !oldPassword) {
            arrauOfError.push('Fields must be correct')
        }

        const isPassValid = bcrypt.compareSync(oldPassword, user.password)
        if(!isPassValid) {
            arrauOfError.push('Current password must be correct')
        }

        if(oldPassword === newPassword) {
            arrauOfError.push('New password must different then old')
        }

        if(arrauOfError.length > 0) {
            return res.status(400).json({ message: 'Uncorrect request', error: arrauOfError })
        }

        const hashPassword = await bcrypt.hash(newPassword, 8)

        await User.updateOne({ _id: req.user.id },
            {
                password: hashPassword
            })

        res.json({ message: 'Password was updated', value: hashPassword })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

account.delete('/delete', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User with this id is not found' })
        }
        await User.deleteOne({ _id: req.user.id })

        res.json({ message: 'Account was deleted'})
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

module.exports = account