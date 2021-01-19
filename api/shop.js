const express = require('express')
const shop = express.Router()

const Cars = require('../DB/Cars')

shop.get('/cars', async (req, res) => {
    try {
        const params = req.query
        const cars = await Cars.find({})
        res.json({cars})
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

shop.get('/brands', async (req, res) => {
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

shop.get('/:brand', async (req, res) => {
    try {
        console.log(req.query);
        const cars = await Cars.find({brand: brand})
        res.json({cars})
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

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

module.exports = shop