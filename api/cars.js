const e = require('express')
const express = require('express')
const cars = express.Router()

const Cars = require('../DB/Cars')

cars.get('/', async (req, res) => {
    try {
        const params = req.query
        let cars = await Cars.find({})
        if(params.brand) {
            cars = cars.filter(car => car.brand === params.brand)
        }
        if(params.carClass) {
            cars = cars.filter(car => car.class === params.carClass)
        }
        if(params.bodyType) {
            cars = cars.filter(car => car.bodyType === params.bodyType)
        }
        if(params.fromYear) {
            cars = cars.filter(car => car.year >= params.fromYear)
        }
        if(params.toYear) {
            cars = cars.filter(car => car.year <= params.toYear)
        }
        if(params.fromPrice) {
            cars = cars.filter(car => car.price >= params.fromPrice)
        }
        if(params.toPrice) {
            cars = cars.filter(car => car.price <= params.toPrice)
        }

        res.json({cars})
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

cars.get('/brands', async (req, res) => {
    try {
        const set = new Set();
        const cars = await Cars.find({})
        cars.forEach(car => {
            set.add(car.brand)
        })
        const brands = Array.from(set)
        res.json({brands})
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

// cars.get('/:brand', async (req, res) => {
//     try {
//         const brand = req.params.brand
//         const cars = await Cars.find({brand: brand})
//         res.json({cars})
//     } catch (e) {
//         console.log(e);
//         res.send({message: 'Server error'})
//     }
// })

// shop.get('/cars', (req, res) => {
//     res.json(shopItems.cars)
// })

// shop.get('/brands', (req, res) => {
//     res.json(shopItems.brands)
// })

// shop.get('/car/:carID', (req, res) => {
//     const car = getCarByID(req.params.carID)
//     if(car.length > 0) {
//         res.json(car)
//     } else {
//         res.status(404).send({error: `Car with id ${req.params.carID} not found`})
//     }
// })

// shop.get('/:model', (req, res) => {
//     res.json(getCarsByBrand(req.params.model))
// })

module.exports = cars