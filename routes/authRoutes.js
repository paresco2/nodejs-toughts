const express = require('express')
const router = express.Router()
const AuthControler = require('../controller/AuthController')

router.get('/login', AuthControler.login)
router.post('/login', AuthControler.loginPost)
router.get('/register',AuthControler.register)
router.post('/register', AuthControler.registerPost)
router.get('/logout', AuthControler.logout)


module.exports = router
