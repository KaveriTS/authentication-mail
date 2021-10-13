const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const router = require('../route/userRoute');

//register route
exports.register = (req, res, next) => {
    try {
        const {username, email, password} = req.body;

//check if password length matches and has a special character
        if (password.length < 6 || !password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long and contain a special character'
            });
        }
//check if username and email already exists
        User.find({$or: [{username: username}, {email: email}]})
            .then(user => {
                if (user.length > 0) {
                    return res.status(409).json({
                        message: 'Username or email already exists'
                    });
                }
//hash password
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: username,
                            email: email,
                            password: hash
                        }).then(  async user => {
                            await sendMail.sendMail(user.email);
                            return res.json({
                                 message: "User has registered successfully"
                    
                             })
                            }).catch( err => {
                            console.log('Error -> ', err);
                            return res.status(403).json({
                                message: 'Something went wrong!'
                            })
                        });
//save user to database
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created',
                                    result: result
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

//login route
exports.login = (req, res, next) => {
    try {
        const {email, password} = req.body;
//check if email is valid
        User.find({email: email})
            .then(user => {
                if (user.length < 1) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
//check if password matches and if user is verified send message
                bcrypt.compare(password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed'
                        });
                    }
                    if (result) {
                        if (user[0].verified === true) {
                            const token = jwt.sign({
                                email: user[0].email,
                                userId: user[0]._id
                            },
                                'secret',
                                {
                                    expiresIn: '1h'
                                });
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token
                            });
                        } else {
                            return res.status(401).json({
                                message: 'Please verify your email'
                            });
                        }
                    } else {
                        return res.status(401).json({
                            message: 'Auth failed'
                        });
                    }
                });
            });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

module.exports = router;

