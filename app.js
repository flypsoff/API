const express = require('express')
const cors = require('cors')
const PORT = process.argv.PORT || 3333

const app = express()

const connectDB = require('./DB/connection')
connectDB()

const cars = require('./api/cars')
const auth = require('./api/auth')
const todos = require('./api/todos')
const account = require('./api/account')

const corsOption = {
    origin: 'http://localhost:3000/'
}

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json({ extended: true }))

app.use('/cars', cars)
app.use('/auth', auth)
app.use('/todos', todos)
app.use('/account', account)

app.listen(PORT, () => console.log("Server has been started"))