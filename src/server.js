var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

const dev_dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user:  process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

//Main
app.get('/main', function(req, res) {
	res.render('pages/main', {
	  my_title: "Main",
	});
});

//Search history
app.get('/searches', function(req, res) {
	console.log("Hello");
	var queryCheck=	`SELECT * FROM meals;`;

	db.task('get-everything', task => {
		return task.batch([
			task.any(queryCheck)
		]);
	})
	.then(data => {
		console.log(data);

		res.render('pages/searches',{
				my_title: "Search History",
				meals: data[0]

			})
	})
	.catch(err => {
		// display error message in case an error
			console.log('error', err);
			res.render('pages/searches',{
				my_title: "Search History",
				result_1: ''
			})
	});

});


//Search history
app.post('/searches', function (req, res) {

	var idMeal = req.body.idMeal;
	var strMeal = req.body.strMeal;
	var strCategory = req.body.strCategory;
	var strArea = req.body.strArea;
	var strTags = req.body.strTags;


	var query = `INSERT INTO meals(idMeal, strMeal, strCategory, strArea, strTags) VALUES('${idMeal}', '${strMeal}','${strCategory}','${strArea}', ARRAY['${strTags}']);`;
	var queryCheck=	`SELECT * FROM meals;`;
	res.send(req.body)

	db.task('get-everything', task => {
		return task.batch([
			task.any(query),
			task.any(queryCheck)
		]);
	})
		.then(info => {
			console.log(info)
		})
		.catch(error =>{
			console.log(error);


		});

	
});


//Use to run tests
const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Express running → PORT ${server.address().port}`);
  });
  
module.exports=server; 



