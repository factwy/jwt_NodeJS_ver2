const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {
    getAccessToken,
    getRefreshToken,
    logout,
    login,
    login_success,
    register
    } = require('./module/jwt_module')

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}))

app.listen(process.env.PORT, (req, res)=>{
    console.log(`server is on ${process.env.PORT}`)
})

app.get('/getAccessToken', getAccessToken)
app.get('/getRefreshToken', getRefreshToken)
app.get('/login/success', login_success)
app.post('/login', login)
app.post('/logout', logout)
app.post('/register', register)