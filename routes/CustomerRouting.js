const express = require('express');
var router = express.Router();
const customerController = require('../controllers/CustomerController');
const productController = require('../controllers/ProductController');
const adminController = require('../controllers/AdminController')
router.route('/')
.get(customerController.getIndex)

router.route('/GetProducts')
.post(productController.getAllProducts);


router.route('/admin')
.get(adminController.renderAdminPage)
.post(adminController.getLists); 

router.route('/login')
.get(customerController.GetLoginPage);
router.route('/register')
.get(customerController.GetRegisterPage);

router.route('/auth')
.post(customerController.HandleAuth)

router.route('/account')
.get(customerController.getAccountPage);

router.route('/logout')
.get(customerController.UserLogout)

router.route('/cart')
.get(customerController.getCart)
.post(customerController.placeOrder);

router.route('/about')
.get(customerController.getAbout); 

router.route('/contact')
.get(customerController.getContact); 

router.route('/maps')
.get(customerController.getMaps);

router.route('/isLogged')
.post(customerController.getCustomer);

router.get('/allUsers', customerController.getAllUsers);


router.route('/:category')
.get(customerController.getCategory);

module.exports = router;

