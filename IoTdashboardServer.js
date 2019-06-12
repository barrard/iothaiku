var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var partials = require('express-partials')


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { defaultLayout: 'layout' })

app.use(partials());
app.use(express.static('public'));
// app.use('/canvas',express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res, next){
	// res.render('index')
		res.render('imaging')

})
app.get('/canvas', function(req, res, next){
	res.render('canvas')
})


app.get('/imaging', function(req, res, next){
	res.render('imaging')
	// app.render('imaging', {layout:true},  function(err, html){
	// 	err ? console.log('err'+err) : res.send(html)
	// })
})

app.post('/ajax/hello/', function(req, res, next){
	console.log(req.body)
	res.render('sayHello', {name:req.body.name})
	// app.render('sayHello', {name:req.body.name}, function(err, html){
	// 	if(err){
	// 		console.log(err)
	// 	}else{
	// 		res.send(html)
	// 	}
	// })
})



var port = 8081
app.listen(port, function() { console.log('listening on ' + port) })
