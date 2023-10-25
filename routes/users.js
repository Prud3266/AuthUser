const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.get('/', userController.getAllUser) 
router.get('/:email', userController.getUser)

module.exports = router