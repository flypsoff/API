const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req, res, next) => {
    if(req.method === 'OPRIONS') {
       return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(401).json({message: 'Auth error'})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({message: 'Auth error'})
    }
}