
const multer = require('multer');
const express = require('express');
const adminController = require('../controllers/AdminController')
var router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});




router.route('/admin')
    .get(adminController.renderAdminPage)
    .post(adminController.getLists);
router.route('/readProduct')
.post(adminController.readProduct);
router.route('/addProduct')
.post(adminController.addProduct)
router.route('/addCategory')
.post(adminController.addCategory)
//router.route('/addProduct')
router.route('/updateAProduct').post(adminController.updateAProduct);
router.route('/deleteAProduct').post(adminController.deleteAProduct);
router.route('/deleteACategory').post(adminController.deleteACategory);
router.route('/readCustomer').post(adminController.readCustomer);
router.route('/updateACustomer').post(adminController.updateACustomer);
router.route('/deleteACustomer').post(adminController.deleteACustomer);
router.route('/updateOrder').post(adminController.updateOrder);
router.route('/logout').get(adminController.logout);

module.exports = router;


