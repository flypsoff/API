const express = require('express')
const shopAPI = express.Router()
const shopItems = require('./../data/shop')

const getCarsByBrand = (brand) => {
    return shopItems.cars.filter(item => item.brand === brand)
}

const getCarByID = (id) => {
    return shopItems.cars.filter(item => item.carID === +id)
}

shopAPI.get('/', (req, res) => {
    res.json(shopItems)
})

shopAPI.get('/cars', (req, res) => {
    res.json(shopItems.cars)
})

shopAPI.get('/brands', (req, res) => {
    res.json(shopItems.brands)
})

shopAPI.use('/car/:carID', (req, res) => {
    const car = getCarByID(req.params.carID)
    if(car.length > 0) {
        res.json(car)
    } else {
        res.status(404).send({error: `Car with id ${req.params.carID} not found`})
    }
})

shopAPI.use('/:model', (req, res) => {
    res.json(getCarsByBrand(req.params.model))
})

module.exports = shopAPI