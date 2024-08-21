const mysql = require('../db/db')
const jwt = require('jsonwebtoken')

const conn = mysql.init()
mysql.connect(conn)

const getAccessToken = (req, res)=>{
    console.log('getAccessToken 호출됨')
    const refreshToken = req.cookies.refreshToken

    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
        
        const payload = {
            name: decoded['name'],
        }

        const newToken = jwt.sign(payload, process.env.ACCESS_SECRET, {expiresIn: '10s'})

        res.cookie('accessToken', newToken, {httpOnly:true})
        res.status(200).json('get newAccessToken')
    } catch(error) {
        res.status(400).json('AccessToken is expired')
    }
}

const getRefreshToken = (req, res)=>{
    console.log('getRefreshToken 호출됨')
    const refreshToken = req.cookies.refreshToken

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

        const payload_refresh = {
            id: decoded['id'],
            name: decoded['name']
        }

        const newRefreshToken = jwt.sign(payload_refresh, process.env.REFRESH_SECRET, {expiresIn: '3h'})

        const payload_access = {
            name: decoded['name']
        }

        const newAccessToken = jwt.sign(payload_access, process.env.ACCESS_SECRET, {expiresIn: '10s'})

        res.cookie('accessToken', newAccessToken, {httpOnly: true})
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true})

        res.status(200).json('new refreshToken')

    } catch(err) {
        res.status(400).json('fail to get refreshToken')
    }
}

const logout = (req, res)=>{
    try{
        console.log('logout 호출됨')
    
        res.cookie('accessToken', '')
        res.cookie('refreshToken', '')
        res.status(200).json('logout')
    } catch(err) {
        res.status(400).json('fail')
    }
}

const login = (req, res)=>{
    console.log('login 호출됨')

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    conn.query('SELECT * FROM user WHERE id = ? and name = ? and password = SHA2(?,256);',
        [email, name, password],
        (err, rows)=>{
            if(err) {
                console.log('Mysql query error ', err)
                res.status(400).json('error')
            }

            console.log(rows)
            if(rows[0]) {
                const name = rows[0]['name']

                const payload_refresh = {
                    id: email,
                    name: name,
                }

                const payload_access = {
                    name: name
                }

                const refreshToken = jwt.sign(payload_refresh, process.env.REFRESH_SECRET, {expiresIn: '3h'})
                const accessToken = jwt.sign(payload_access, process.env.ACCESS_SECRET, {expiresIn: '10s'})

                res.cookie('accessToken', accessToken, {httpOnly: true})
                res.cookie('refreshToken', refreshToken, {httpOnly: true})

                console.log(refreshToken)
                console.log(accessToken)

                res.status(200).json('jwt')
            } else {
                console.log('not data in database')
                res.status(400).json('not data')
            }
        }
    )
}

const login_success = (req, res)=>{
    const resData = {}

    try{
        const accessToken = req.cookies.accessToken
        const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET)

        resData.username = decoded['name']
        resData.status = 200
        res.status(200).send(resData)
    } catch(err) {
        console.log('jwt expired')
        resData.username = null
        resData.status = 400
        res.status(400).send(resData)
    }
}

const register = (req, res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if(!(name || email || password)) {
        res.status(400).json('입력 정보 부족')
    }

    conn.query('SELECT * FROM user WHERE id = ?;',
        email,
        (err, rows)=>{
            if(err) {
                res.status(400).json('QUERY ERROR')
            }
            if(rows[0]) {
                res.status(400).json('중복된 아이디')
            }
        }
    )

    conn.query('INSERT INTO user VALUES (?, ?, SHA2(?, 256));',
        [email, name, password],
        (err, rows)=>{
            if(err) {
                res.status(400).json('QUERY ERROR')
            } else {
                res.status(200).json('insert data')
            }
        }
    )
}

module.exports = {
    getAccessToken,
    getRefreshToken,
    logout,
    login,
    login_success,
    register
}