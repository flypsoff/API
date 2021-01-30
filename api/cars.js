const e = require('express')
const express = require('express')
const cars = express.Router()

const authMiddleware = require('../middleware/auth')

const Cars = require('../DB/Cars')
const User = require('../DB/User')

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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
        res.send({message: 'Server error'})
    }
})

cars.post('/addcar', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            res.status(401).send({message: 'First need login'})
        }
        const car = req.body.car
        const newCar = new Cars({
            brand: car.brand,
            model: car.model,
            class: car.carClass,
            year: car.year,
            price: car.price,
            description: car.description,
            bodyType: car.bodyType,
            info: {
                engineCapacity: car.engineCapacity,
                location: car.location,
                mileage: car.mileage,
                fuelType: car.fuelType,
                hp: car.hp,
                color: car.color,
                transmission: car.transmission,
                driveTrain: car.driveTrain,
                owner: user.name,
                phoneNumber: car.phoneNumber
            },
            carID: req.body.carID,
            img: 'https://lh3.googleusercontent.com/proxy/XXI4BK-TROoX2qd-bom1l0XaJBhR2pkN_ZGyiVp39DqQNKidCPvPO6TBpJ-amvFWao4o9AclzEsWhzvjvZ2_Mw',
            carState: car.carState
          })
        await newCar.save()
        res.send({message: 'Car was added', newCar})
    } catch (e) {
        console.log(e)
        res.send({message: 'Server error'})
    }
})


module.exports = cars