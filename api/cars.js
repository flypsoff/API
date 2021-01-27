const e = require('express')
const express = require('express')
const cars = express.Router()

const Cars = require('../DB/Cars')

cars.get('/', async (req, res) => {
    try {
        const params = req.query
        let cars
        if(params.carState) {
            cars = await Cars.find({carState: params.carState})
        } else {
            cars = await Cars.find({})
        }
        if(params.brand) {
            cars = cars.filter(car => car.brand.toLowerCase() === params.brand.toLowerCase())
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
            set.add(car.brand.toLowerCase())
        })
        const brands = Array.from(set)
        res.json({brands})
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})

cars.get('/car/:carID', async (req, res) => {
    try {
        const carID = req.params.carID
        const car = await Cars.find({carID})
        if(car.length > 0) {
            res.json({car: car[0]})
        } else {
            res.json({message: `Car with id ${carID} is not found`})
        }
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
})


module.exports = cars