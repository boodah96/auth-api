'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user', enum: ['user', 'editor', 'admin'] },
});

users.virtual('token').get(function() {
    let tokenObject = {
        username: this.username,
    }
    return jwt.sign(tokenObject, process.env.SECRET)
});


users.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});
// capabilities ACL
users.virtual('capabilities').get(function() {
    let acl = {
        user: ['read'],
        editor: ['read', 'create', 'update'],
        admin: ['read', 'create', 'update', 'delete']
    };
    return acl[this.role];
});
// BASIC AUTH
users.statics.authenticateBasic = async function(username, password) {
    try {
        const user = await this.findOne({ username })
        const valid = await bcrypt.compare(password, user.password)
        if (valid) { return user; }
        throw new Error('Invalid User');
    } catch (error) {
        throw new Error(error.message)
    }

}

// BEARER AUTH
users.statics.authenticateWithToken = async function(token) {
    try {
        const parsedToken = jwt.verify(token, process.env.SECRET);
        const user = this.findOne({ username: parsedToken.username })
        if (user) { return user; }
        throw new Error(' USER ERROR');
    } catch (e) {
        throw new Error(e.message)
    }
}


module.exports = mongoose.model('users', users);