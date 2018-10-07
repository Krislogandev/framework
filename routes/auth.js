import apis  from "./../config/routesConstants.js";
module.exports = (app, express, passport) => {
	/* GET home page. */
	var router = express.Router();
	let length = apis.authApi.apis.length;
	let authApi = apis.authApi.apis;
	for (let auth = 0; auth < length; auth++) {
		console.log("Api:", authApi[auth].name);
		console.log("type:", authApi[auth].type);
		router[authApi[auth].type](authApi[auth].name, (req, res, next) => {
			res.render('index', {
				title: 'Framework 1.0.0 NODEJS API'
			});
		})
	}
	app.use(apis.authApi.base, router);
}