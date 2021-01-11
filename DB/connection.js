const mongoose = require('mongoose')

const URI = 'mongodb+srv://dbUSER:qwerty123@randomapi.qjsed.mongodb.net/api?retryWrites=true&w=majority'  

const connectDB = async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('Connected to DB');
}

module.exports = connectDB