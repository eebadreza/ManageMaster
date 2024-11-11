const express = require('express');
const customerController = require('../controller/customerController');
const router = express.Router();

// router.use();

router.get('/', customerController.getHomePage);
router.get('/about', customerController.getAboutpage);
router.get('/add', customerController.addCustomer);
router.post('/add', customerController.postCustomer);
router.get('/view/:id', customerController.viewCustomer);
router.get('/edit/:id', customerController.editCustomer);
router.put('/edit/:id', customerController.updateCustomer);
router.delete('/edit/:id', customerController.deleteCustomer);
router.post('/search', customerController.searchCustomer);

module.exports = router;
