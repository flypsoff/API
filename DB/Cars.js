const mongoose = require('mongoose')

const cars = new mongoose.Schema({
    carID: {
        type: String
    },
    brand: {
        type: String
    }, 
    model: {
        type: String
    },
    class: {
        type: String
    },
    year: {
        type: String
    },
    price: {
        type: Number
    },
        bodyType: {
        type: String
    },
    engineCapacity: {
        type: String
    },
    description: {
        type: String
    }

})

const Cars = mongoose.model('cars', cars)

module.exports = Cars