const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ===============================
//  USER ROUTES (Controller Based)
// ===============================

// Create a new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getUsers);

// Get a user by ID
router.get('/:id', userController.getUserById);

// Update a user
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
