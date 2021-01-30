const mongoose = require('mongoose')

const cars = new mongoose.Schema({
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
    description: {
        type: String
    },
    bodyType: {
        type: String
    },
    info: {
        engineCapacity: {
            type: String
        },
        location: {
            type: String
        },
        mileage: {
            type: Number
        },
        fuelType: {
            type: String
        },
        hp: {
            type: Number
        },
        color: {
            type: String
        },
        transmission: {
            type: String
        },
        driveTrain: {
            type: String
        },
        owner: {
            type: String
        },
        phoneNumber: {
            type: Number
        },
    },
    carID: {
        type: String
    },
    img: {
        type: String
    },
    carState: {
        type: String
    }
})

const Cars = mongoose.model('cars', cars)

module.exports = Cars