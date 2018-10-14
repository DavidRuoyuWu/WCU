const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
let UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	refer: {
    type:String
  },
  profileImage:{
    type:String
  },
	miles:{
		type:String
	},
	tel: {
		type:String
	},
	time: {
		type:String
	},
	type: {
		type:String
	},
	resetPasswordToken: String,
  resetPasswordExpires: Date,
	ticketsBoughtTime: Date
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	let query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.buyTickets = function(userId, tel, time, type, miles, callback){
	User.findById(userId , function(err, user){
		if (err) throw err;
		user.tel = tel;
		user.time = time;
		user.type = type;
		user.miles = miles;
		user.save(callback);
	});
}
module.exports.buyOthers = function(userId, miles, callback){
	User.findById(userId , function(err, user){
		if (err) throw err;
		user.miles = miles;
		user.save(callback);
	});
}
