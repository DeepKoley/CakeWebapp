const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.getDashboard);
router.get('/add-cake', adminController.getAddCake);
router.post('/add-cake', adminController.postAddCake);
router.get('/manage-cake', adminController.getManageCake);
router.post('/delete-cake/:id', adminController.postDeleteCake);
router.get('/orders', adminController.getOrders);
router.post('/orders/:id/status', adminController.postUpdateOrderStatus);
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);

module.exports = router;