// modules for hashing
const bcrypt = require('bcrypt'),
      jwt   = require('jsonwebtoken');

// User model
const User = require('../models/user');


// signup 
exports.signup = (req, res, next) =>{
    const {username, email, password} = req.body;
    //console.log(req.body);

    User.findOne({email})
        .then( user => {
            if(user) {
                res.status(409).json({
                    error : "Mail Exists"
                })
            } else {
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err2, hash) => {
                        console.log(err2);
                        if(err2){
                            return res.status(500).json({
                                details : "error in hashing",
                                error : err2
                            })
                        } 
                        const user = new User( {
                            username : username,
                            email : email,
                            password : hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message : "User created Successfully :)",
                                    user : {
                                        username : result.name,
                                        userId : result._id,
                                        email : result.email,
                                        password : result.password
                                    }
                                })
                            })
                            .catch( err => {
                                return res.status(500).json({
                                    details : "error in saving",
                                    error : err
                                })
                            })
                    })
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                details : "error in finding",
                error : err
            })
        })
}

// login 
exports.login = (req, res, next) => {

    const {email , password} = req.body;

    User.findOne({email})
        .exec()
        .then(user => {
            if(!user || user.length < 1) {
                res.status(401).json({
                    message : "Auth failed :("
                })
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err){
                        return res.status(500).json({
                            details : "error in comparing",
                            error : err
                        })
                    } else {
                        if(!result) {
                            res.status(401).json({
                                message : "Auth failed :("
                            })
                        } else{
                            // generate token
                            const token = jwt.sign({id : user._id}, process.env.SECRET);

                            // put token in cookie
                            res.cookie("token", token, { expire : "1hr" });

                            res.status(202).json({
                                message : "Logined successfully :)",
                                userId : user._id,
                                token : token,
                            });
                        }
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                details : "error in finding",
                error : err
            })
        })
}

// logout
exports.logout = (req, res, next) => {

    // remove token 
    res.clearCookie("token");

    res.status(200).json({
        message : "Logged out successfully :)"
    })
}