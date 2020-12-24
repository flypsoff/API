const express = require('express')
const shopAPI = express.Router()
const api = require('./../data/shop')

const getCarsByBrand = (brand) => {
    return api.cars.filter(item => item.brand === brand)
}

const getCarByID = (id) => {
    return api.cars.filter(item => item.carID === +id)
}

shopAPI.get('/', (req, res) => {
    res.json(api)
})

shopAPI.get('/bmw', (req, res) => {
    res.json(getCarsByBrand('bmw'))
})

shopAPI.get('/volkswagen', (req, res) => {
    res.json(getCarsByBrand('volkswagen'))
})

shopAPI.get('/mercedes-benz', (req, res) => {
    res.json(getCarsByBrand('mercedes-benz'))
})

shopAPI.get('/audi', (req, res) => {
    res.json(getCarsByBrand('audi'))
})

shopAPI.get('/cars', (req, res) => {
    res.json(api.cars)
})

shopAPI.get('/brands', (req, res) => {
    res.json(api.brands)
})


module.exports = shopAPI