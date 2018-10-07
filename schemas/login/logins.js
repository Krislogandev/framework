/*
 * Users.js
 *
 * @author      :: Kris Logan
 * @module      :: Login Model
 * @date  :: 22 Sep 2018
 * @description :: This schema represents the email, password login Ids.
 * 
 *
 */

import mongoose from 'mongoose';
import messages from "./../config/messages.js";
const Schema = mongoose.Schema;
const usersScehma = new Schema({
    "email": {
        type: String,
        required: messages.authentication.emailReqErr,
        unique: messages.authentication.emailUniqueErr,
        lowercase: true
    },
    "password": {
        type: String,
        required: messages.authentication.passswordReqErr
    },
    "userType": {
        type: Number,
        required: messages.authentication.userTypeReqErr
    },
    "isDeleted": {
        type: Boolean,
        default: false
    },
    "isBlocked": {
        type: Boolean,
        default: false
    }
}, {
    "_id": false
}).index({email:1,userType:1,isDeleted:1});
