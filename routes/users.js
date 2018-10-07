module.exports = function(app, express,passport) {
	/* GET users listing. */ 
	var router = express.Router(); 
	router.get('/',(req, res, next) =>{
		res.send({message:'respond with a resource'});
	});
	app.use("/users",(req,res,next)=>{
		console.log("/users route");
		next();
	},router);
}