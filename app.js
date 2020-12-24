const express = require('express')
const cors = require('cors')
const PORT = process.argv.PORT || 3333

const app = express()

const shopAPI = require('./api/shopAPI')

const corsOption = {
    origin: 'http://localhost:3000/'
}

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json({ extended: true }))

app.use('/api', shopAPI)

app.listen(PORT, () => console.log("Server has been started"))