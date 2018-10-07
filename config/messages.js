/*
 * Users.js
 *
 * @author      :: Kris Login
 * @module      :: Response Message 
 * @date        :: 22 Sep 2018
 * @description :: This file is used to write out all the response messages of apis
 *
 *
 */
const messages = {
    "authentication":{
        "success":"Welcome! Successfully logged in.",
        "emailReqErr":"Valid email address is required.",
        "emailUniqueErr":"Email is already registered.",
        "passswordReqErr":"Valid password is required.",
        "userTypeReqErr":"User Type is required.",
    }
};

exports.messages = messages;