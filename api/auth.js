const express = require('express')
const auth = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { check, validationResult} = require('express-validator')

const User = require('../DB/User')

const authMiddleware = require('../middleware/auth')

auth.post('/registration', [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 7').isLength({min: 7}),
    check('name').isAlpha().withMessage('Name must contain only letters'),
    check('country').isAlpha().withMessage('Country must contain only letters'),
    check('age', 'Age must contain only numbers').isNumeric(),
    ], async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({message: 'Uncorrect request', errors})
        }
        const { email, password, name, age, country } = req.body

        const candidate = await User.findOne({email})

        if(candidate) {
            return res.status(400).json({message: `User with this email is already exist`})
        }

        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({
            email, 
            password: hashPassword, 
            name, 
            age,
            country, 
            status: 'user', 
            posts: [],
            todos: []
          })
        await user.save()

        return res.json({message: 'User was created'})   

    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

auth.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({message: 'User with this email is not found'})
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if(!isPassValid) {
            return res.status(400).json({message: 'Invalid password'})
        }

        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '1hr'})

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                age: user.age,
                country: user.country,
                status: user.status
            }
        })
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

auth.get('/authorization', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id})

        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '1hr'})
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                age: user.age,
                country: user.country,
                status: user.status,
            }
        })
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

module.exports = auth