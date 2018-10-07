/* Authentication module api */
var requiredObj = {
	"auth": "./../api/policies/OAuth2.js" //login controller code
};



const authApi = {
	base: "/auth",
	apis: [{
		"type": "post",
		"name": "/login",
		"enabled": true,
		"deprecated": false,
		"isLoggedIn": false,
		"controller": requiredObj.auth.token,
		"version": "1.0.0"
	}]
};

/* Users module api */
const usersApi = {
	base: "/users",
	apis: [{
		"type": "post",
		"name": "/addUser",
		"enabled": true,
		"deprecated": false,
		"isLoggedIn": false,
		"controller": "controllerNameObj",
		"version": "1.0.0"
	}, {
		"type": "get",
		"name": "/listUsers",
		"enabled": true,
		"deprecated": false,
		"isLoggedIn": true,
		"checkToken": true,
		"controller": "controllerNameObj",
		"version": "1.0.0"
	}]
};

module.exports = {
	authApi: authApi,
	usersApi: usersApi
}