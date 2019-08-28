require("dotenv").config()
var express = require('express');
var app = express();
const SECRET = process.env.SECRET
var url = 'mongodb://localhost:27017/IoT';
var MongoClient = require('mongodb').MongoClient
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static('public'));

app.use((req, res, next)=>{
	console.log('res!?!?!?')
	next()
})

io.on('connection', function (socket) {
	console.log('a user connected');
	socket.emit('temp_data', LATEST_READINGS)

	socket.on('rotor', (data) => {
		console.log(data)
		io.emit('rotor_data', data)
	})


	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});
function handleError(err) {
	if (err) {
		console.log('-----HandleError helper function found an error------')
		console.log(err)
		console.log('------End of error-------')
		return false
	} else {
		return true
	}
}

function connectMongo(callback) {
	MongoClient.connect(url, function (err, db) {
		if (handleError(err)) {
			console.log("We are connected to " + db.databaseName)
			callback(db)
		} else {
			console.log('errs baaad')
			return false
		}
	})

}

function connectionToMongoCollection(collectionName, callback) {
	connectMongo(function (db) {
		var col = db.collection(collectionName)
		callback(col, db)
	})
}

function insertIntoMongo(collectionName, data, callback) {
	console.log(data)
	connectionToMongoCollection(collectionName, function (col, db) {
		col.insert(data, function (err, resp) {
			if (err) {
				console.log('Error Message form DataBaseFunctions insert into mongo')
				callback({ errorMessage: err })
			} else {
				callback({ message: resp })
			}
		})

		db.close()
	})
}

function findInCollection(collectionName, objToFindInMongo, callback) {
	connectMongo(function (db) {
		if (db) {
			var collection = db.collection(collectionName)
			console.log('collection name ' + collection.s.name)
			collection.find(objToFindInMongo).toArray(function (err, resultArray) {
				if (err) {
					callback({ errorMessage: 'Collection Find Error' })
				} else {
					console.log('found array with' + resultArray.length + ' items')
					if (resultArray.length == 0) {//no result to return
						console.log('resultArray length = ' + resultArray.length)
						console.log('couldnt find ')
						console.log(objToFindInMongo)
						console.log('=>aint in the' + collection.s.name + ' Collection.')
						db.close()
						callback({ errorMessage: 'result.length =' + resultArray.length })
					} else {
						console.log('Handle results and pass data back to the callback')
						// callback()
						console.log(resultArray.length)
						db.close()
						callback({ message: resultArray })
					}
				}
			})

		}
	})
}



app.get('/', function (req, res) {
	// res.sendFile(__dirname+'/public/index.html')
	res.sendFile('/index.html')
})
app.get('/rotary/set_start_treshold/:startThreshold/:id', function (req, res) {
	if (req.headers.secret !== SECRET) return res.send('Si, puede estamos encinidos')
	let { startThreshold, id } = req.params

	//console.log(timeStamp)
	var dataObj = {
		sensorID: id,
		startThreshold,
		date: new Date().getTime()
	}
	insertIntoMongo('rotaryData', dataObj, function (msgObj) {
		if (msgObj.errorMessage) {
			console.log('ERRPR!!!!!!!!111 ' + msgObj.errorMessage)
			console.log(msgObj)
		} else if (msgObj.message) {
			console.log('startThreshold rotary data inserted ')
			console.log(dataObj)
		}
	})
	res.send('yes?');
})
app.get('/rotary/set_stop_treshold/:stopThreshold/:id', function (req, res) {
	if (req.headers.secret !== SECRET) return res.send('Si, puede estamos encinidos')
	let { stopThreshold, id } = req.params

	//console.log(timeStamp)
	var dataObj = {
		sensorID: id,
		stopThreshold,
		date: new Date().getTime()
	}
	insertIntoMongo('rotaryData', dataObj, function (msgObj) {
		if (msgObj.errorMessage) {
			console.log('ERRPR!!!!!!!!111 ' + msgObj.errorMessage)
			console.log(msgObj)
		} else if (msgObj.message) {
			console.log('stopThreshold rotary data inserted ')
			console.log(dataObj)
		}
	})
	res.send('yes?');
})
app.get('/rotary/action/:action/:id', function (req, res) {
	if (req.headers.secret !== SECRET) return res.send('Si, puede estamos encinidos')
	let { action, id } = req.params

	//console.log(timeStamp)
	var dataObj = {
		sensorID: id,
		action,
		date: new Date().getTime()
	}
	insertIntoMongo('rotaryData', dataObj, function (msgObj) {
		if (msgObj.errorMessage) {
			console.log('ERRPR!!!!!!!!111 ' + msgObj.errorMessage)
			console.log(msgObj)
		} else if (msgObj.message) {
			console.log('action rotary data inserted ')
			console.log(dataObj)
		}
	})
	res.send('yes?');
})
app.get('/rotary/value/:value/:id', function (req, res) {
	if (req.headers.secret !== SECRET) return res.send('Si, puede estamos encinidos')
	let { value, id } = req.params

	//console.log(timeStamp)
	var dataObj = {
		sensorID: id,
		value: value,
		date: new Date().getTime()
	}
	insertIntoMongo('rotaryData', dataObj, function (msgObj) {
		if (msgObj.errorMessage) {
			console.log('ERRPR!!!!!!!!111 ' + msgObj.errorMessage)
			console.log(msgObj)
		} else if (msgObj.message) {
			console.log('rotary data inserted ')
			console.log(dataObj)
		}
	})
	res.send('yes?');
})

app.get('/rotary', (req, res) => {
	findInCollection('rotaryData', {}, function (dbObj) {
		if (!dbObj.errorMessage) {
			// console.log(dbObj.message)
			res.send(dbObj.message.slice(-50).reverse())
		} else { res.send('No data yet') }

	})
})


app.get('/tempData', (req, res) => {
	findInCollection('tempData', {}, function (dbObj) {
		if (!dbObj.errorMessage) {
			// console.log(dbObj.message)
			res.send(dbObj.message.slice(-500).reverse())
		}

	})
})

app.get('/tempData/:id', (req, res) => {
	let { id } = req.params
	findInCollection('tempData', { sensorID: id }, function (dbObj) {
		if (!dbObj.errorMessage) {
			// console.log(dbObj.message)
			res.send(dbObj.message.slice(-50).reverse())
		}

	})
})
let LATEST_READINGS={}
findInCollection('tempData', {}, function (dbObj) {
	LATEST_READINGS = dbObj
})
app.get('/temp/:temp/:humidity/:pressure/', function (req, res) {
	console.log(req.params)
	console.log(req.headers.secret)
	console.log(SECRET)
	if (req.headers.secret !== SECRET) return res.send('Si, puede estamos encinidos')
	let { temp, humidity, pressure } = req.params

	var dataObj = {
		pressure: pressure,
		temp: temp,
		humidity: humidity,

		date: new Date().getTime()
	}
	LATEST_READINGS = dataObj
	io.emit('temp_data', dataObj)
	insertIntoMongo('tempData', dataObj, function (msgObj) {
		if (msgObj.errorMessage) {
			console.log('ERRPR!!!!!!!!111 ' + msgObj.errorMessage)
			console.log(msgObj)
		} else if (msgObj.message) {
			console.log('Yay data war inserted ')
			console.log(dataObj)
		}
	})
	res.send('yes?');
})



var server = http.listen(8266, function () {
	var host = server.address().address
	var port = server.address().port

	console.log(server.address())

	console.log("Example app listening at http://%s:%s", host, port)
})


// var IoTdasboard = require('IoTdasboard.js')