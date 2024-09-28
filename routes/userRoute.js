const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router
    .route('/')
    .get(userController.getHomePage)
router
    .route('/add')
    .get(userController.getAddPage)
    .post(userController.postAddPage)
router
    .route('/edit/:id')
    .get(userController.getEditPage)
    .post(userController.postEditPage)
router
    .route('/login')
    .get(userController.getLoginPage)
    .post(userController.postLoginPage)
router.route('/delete/:id').post(userController.postDelete)
router.route('/:id').get(userController.getProduct)

module.exports = router
