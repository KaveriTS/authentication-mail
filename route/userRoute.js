const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const sendEMail = require('../helpers/mail');

router.post('/register', userController.getRegister, async (req, res) => {
    try {
        const user = await userController.register(req.body);
        res.status(200).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error
        });
    }
});
router.post('/login', userController.getLogin), async (req, res) => {
    try {
        const user = await userController.login(req.body);
        res.status(200).json({
            message: 'User logged in successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in user',
            error
        });
    }
};

//sending email
router.post('/sendEmail', userController.sendEmail);

module.exports = router;
