require("dotenv").config()
var express = require('express');
var app = express();
const SECRET = process.env.SECRET
var url = 'mongodb://localhost:27017/IoT';
var MongoClient = require('mongodb').MongoClient

app.use(express.static('public'));


 function handleError(err){
 	if(err){
 		console.log('-----HandleError helper function found an error------')
 		console.log(err)
 		console.log('------End of error-------')
 		return false
 	}else{
 		return true
 	}
 }

function connectMongo(callback){
	MongoClient.connect(url, function(err, db) {
	 	if(handleError(err)){
	     	console.log("We are connected to " + db.databaseName)
	     	callback(db)
		}else{
			console.log('errs baaad')
			return false
		}
	 })

}

function connectionToMongoCollection(collectionName, callback){
	connectMongo(function(db){
		var col = db.collection(collectionName)
		callback(col, db)
	})
}

function insertIntoMongo(collectionName, data, callback){
	// console.log(data)
	connectionToMongoCollection(collectionName, function(col, db){
			col.insert(data, function(err, resp){
				if(err){
					console.log('Error Message form DataBaseFunctions insert into mongo')
					callback({errorMessage:err})
				}else{
					callback({message:resp})
				}
			})
		
		db.close()
	})
}

function findInCollection(collectionName, objToFindInMongo, callback){
	connectMongo(function(db){
		if(db){
			var collection  = db.collection(collectionName)
			console.log('collection name ' + collection.s.name)
					collection.find(objToFindInMongo).toArray(function(err, resultArray){
					  if(err){callback({errorMessage:'Collection Find Error'})
					  }else{
						    console.log('found array '+resultArray)
						  	if(resultArray.length ==0){//no result to return
			  				    console.log('resultArray length = '+resultArray.length)
			  				    console.log('couldnt find ')
			  				    console.log(objToFindInMongo)
			  				    console.log('=>aint in the'+collection.s.name+' Collection.')
			  				    db.close()
			  				    callback({errorMessage:'result.length ='+resultArray.length})
						  	}else{
						  		console.log('Handle results and pass data back to the callback')
						  		// callback()
						  		console.log(resultArray.length)
						  		db.close()
						  		callback({message:resultArray})
						  	}
					  }
					})

			}
		})
	}



app.get('/', function(req, res){
	// res.sendFile(__dirname+'/public/index.html')
	res.sendFile('/index.html')
})
app.get('/request/fridge', function(req, res){
	findInCollection('tempData', {}, function(dbObj){
		if(!dbObj.errorMessage){
			console.log(dbObj.message)
			res.send(dbObj.message)
		}

	})
})


app.get('/temp/:temp/:humidity/:id/', function (req, res) {
	console.log(req.params)
	if(req.headers.secret !== SECRET) return res.send('Si, puede estamos encinidos')
	let {temp, humidity, id, secret} = req.params

	var params = req.params
	var date = new Date()
	var offset = date.getTimezoneOffset()
	console.log('offset = '+offset)
	var dateStamp = date.getMonth()+1+'-'+date.getDate()+'-'+(date.getYear()-100)
	var timeStamp = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
	//console.log(timeStamp)
	var dataObj = {
		sensorID:params.id,
		temp:params.temp,
		humidity:params.humidity,
		date:dateStamp,
		time:timeStamp,
		trueDate:date
	}
	insertIntoMongo('tempData', dataObj, function(msgObj){
		if(msgObj.errorMessage){
			console.log('ERRPR!!!!!!!!111 '+msgObj.errorMessage)
			console.log(msgObj)
		}else if (msgObj.message){
			console.log('Yay data war inserted ')
			console.log(dataObj)
		}
	})
   res.send('yes?');
})



var server = app.listen(8266, function () {
   var host = server.address().address
   var port = server.address().port

   console.log(server.address())
   
   console.log("Example app listening at http://%s:%s", host, port)
})


// var IoTdasboard = require('IoTdasboard.js')