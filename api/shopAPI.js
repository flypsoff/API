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

shopAPI.get('/cars', (req, res) => {
    res.json(api.cars)
})

shopAPI.get('/brands', (req, res) => {
    res.json(api.brands)
})

shopAPI.use('/car/:carID', (req, res) => {
    res.json(getCarByID(req.params.carID))
})

shopAPI.use('/:model', (req, res) => {
    res.json(getCarsByBrand(req.params.model))
})



// shopAPI.use('/:model/:id', (req, res) => {
//     console.log(req.params.id);
//     res.json(getCarByID(req.params.id))
// })



// shopAPI.use('/volkswagen', (req, res) => {
//     res.json(getCarsByBrand('volkswagen'))
// })

// shopAPI.use('/mercedes-benz', (req, res) => {
//     res.json(getCarsByBrand('mercedes-benz'))
// })

// shopAPI.use('/audi', (req, res) => {
//     res.json(getCarsByBrand('audi'))
// })




module.exports = shopAPI