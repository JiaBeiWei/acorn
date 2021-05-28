const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	accountID:	{ type: Number, unique: true, required: true },
	authority: 	{ type: Number, required: true },
	username: 	{ type: String, required: [true, "can't be blank"] },
	email: 		{ type: String, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'] },
	password: 	{ type: String, required: true },
	friendship: [{ type: Number }]
}, {timestamps: true});

/*
const messageSchema = new Schema({
	friendship:	{ type: Number, required: true},
	sender:		{ type: Number, required: true, ref: "User" },
	message: 	{ type: String, required: true } 
}, {timestamps: true}); 
 */

const postSchema = new Schema({
	postID:		{ type: Number, unique: true, required: true },
	accountID:	{ type: Number, required: true }, 
	username: 	{ type: String, required: true },
	content: 	{ type: String, required: true } 
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
// const Message = mongoose.model('Message', messageSchema); 
const Post = mongoose.model('Post', postSchema); 

module.exports = { User, Post };
