const express = require('express');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const { User, Post } = require('../models/User.js'); 
const router = express.Router();

// good
router.use((req, res, next) => {
    try {
        if (!req.cookies) {
            return res.status(401).json({ message: "You need to login or enable cookie to continue" });
        }
        var token = req.cookies.token;
        var decoded = jwt.verify(token, "secretBW")// ; process.env.TOKEN_SECRET
        User.findOne({ accountID: decoded.id })
            .then(obj => { 
                req.user = obj;
                next();
            })
            .catch(err => {
                return res.status(403).send({message : "You are forbidden from seeing this"});
            });
    } catch(err) {
        res.status(400).send({message : "You are missing vital credentials"});
    } 
}) 

// good
router.get('/posts',  (req, res) => {
    try{
        Post.find({})
            .then(result => {
                res.status(200).json(result);
            })
            .catch(e => {
                res.status(404).send();
            });
    } catch(e) {
        res.status(204).send();
    }
});

// good
router.post('/posts', (req, res) => {
    try {
        Post.find({})
        .sort({_id:-1})
        .limit(1)
        .then(item => {
            let postid = item[0].postID;
            postid++;
            return postid;
        })
        .catch(err => {
            let postid = 0;
            return postid;
        })
        .then(postid => {
            let newPost = new Post({
                    postID:     postid,
                    accountID:  req.user.accountID,
                    username:   req.user.username,
                    content:    req.body.content
                });
            newPost.save()
                .then(result => {
                    res.status(201).json({ postID: postid }); 
                })
                .catch(err => {
                    console.log(err);
                    res.status(409).send();
                });
        })
        
    } catch(e) {
        res.status(404).send(); 
    }
    
});

// good
router.delete('/posts/:id', (req, res) => {
    try {
        const postid = req.params.id;
        Post.find({ postID: postid })
        .then(result => {
                console.log(req.user.accountID, result[0].accountID)
            if (req.user.authority < 1 && req.user.accountID != result[0].accountID){
                return res.status(401).send({message: "Unauthorized attempt. "});
            } else {
                Post.deleteOne({ postID: postid })
                .then(response => {
                    console.log(response);
                    res.status(201).send({message: "Delete successfully. "}); 
                })
                .catch(e => res.status(404));
            }
        })
        .catch(err => res.status(404))
    } catch(e) { 
        console.log(err);
        res.status(404);
    }
});

// good
router.get('/posts/:id',  (req, res) => {
    try{
        Post.find({ postID: parseInt(req.params.id) })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(e => {
                res.status(404).send();
            });
    } catch(e) {
        return res.status(204);
    }
});

// good
router.get('/logout', (req, res)=>{ 
    res.clearCookie('token');
    res.redirect(200, '/index.html');
});

module.exports = router;