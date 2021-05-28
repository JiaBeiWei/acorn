const express = require('express');
const { User, Post } = require('../models/User.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// good
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect(200, '/index.html');
});

// good
/* user login */ 
router.post('/login', async (req, res) => {
	const userInfo = req.body;
	try {
		User.findOne({ email: userInfo.email })
        .then(user => {
            if (!user){
                return res.status(404).send();
            } else {
                bcrypt.compare(userInfo.password, user.password)
                .then(isMatch => {
                    if (!isMatch)
                        return res.status(400).json({ message: "Incorrect Password" }); 
                    else {
                        jwt.sign({ id: user.accountID }, 'secretBW', 
                                 { expiresIn: 3600 }, 
                                 (err, token) => {
                            if (err) throw err;
                            res.cookie('token', token, 
                                { maxAge: 60*60*1000, httpOnly: true, 
                                  secure: true
                                })
                            // cookie can’t be read using JavaScript but can be sent back to server in HTTP requests
                            console.log(user.username);
                            res.status(200).json({ message: user.username });
                        })
                    }
                })
                .catch(err => {
                    console.log("????: ", err)
                })
            }
        })
	} catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
	}
});


// good
router.post('/signup', async (req, res) => {
    const userInfo = req.body;
    try {
        User.findOne({ email: userInfo.email })
            .then(user => {
                if (user)
                    return res.redirect(302, '/login.html');
                else {
        User.find({})
        .sort({_id:-1})
        .limit(1)
        .then(item => {
            let userid = item[0].accountID;
            userid++;
            return userid;
        })
        .catch(err => {
            let userid = 0;
            return userid;
        })
        .then(userID => {
            let auth=0;
            if (userID<3) auth=2;
            bcrypt.genSalt(10)
            .then(salt => {
                bcrypt.hash(userInfo.password, salt)
                .then(pwd => {
                    let user = new User({
                        accountID:  userID,
                        authority:  auth,
                        username:   userInfo.name,
                        email:      userInfo.email,
                        password:   pwd,
                        friendship: []
                    });
                    user.save()
                    .then(doc => {
                        jwt.sign({ id: userID }, 'secretBW', 
                                 { expiresIn: 3600 }, 
                                 (err, token) => {
                                    if (err) throw err;
                                    res.cookie('token', token, 
                                        { maxAge: 60*60*1000, httpOnly: true, 
                                          secure: true
                                        }); 
                                    console.log("Here !!!!!!!")
                                    res.status(200).json({ message: "Created successfully. " });
                            })
                    })
                    .catch(err => {
                        console.log("user save err: ", err)
                    })
                })
                .catch(err => console.log("bcrypt err: ", err))
            })
        })
        .catch(err => console.log(err))
                }
            })
            .catch(err => {
                console.error(err);
            })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
});

module.exports = router;