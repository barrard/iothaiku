var mainCanvas = document.getElementById('mainCanvas'),
	ctx = mainCanvas.getContext('2d'),
	uploadedFile = document.getElementById('uploadedFile')

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
	uploadedFile.addEventListener('change', handleImageUpload)

	// var location = window.location.href.replace('/\/+$/', "");
	var location = window.location.href;
	loadFile(location+'myPic.JPG')
}

function handleImageUpload(ev){
	// var file = ev.target.files[0]
	// console.log(file)
	// console.log(file.type)
	// handleFile(file)

	var files = ev.target.files

	// for(file in files){
	// 	console.log(files[file])
	// 	console.log(files[file].type)
	// 	handleFile(files[file])
	// }
	var l = files.length
	for(let x = 0 ; x<l ; x++){
		handleFile(files[x])
	}
}
let canvasCount = 0
function handleFile(file){
	console.log(file.type)
	var newCanvas = document.createElement('canvas')
	newCanvas.id='newCanvas'+canvasCount
	canvasCount++

	var ctx = newCanvas.getContext('2d')

	var imageType = /image.*/;
	if(file.type.match(imageType)){
		var reader = new FileReader()
		reader.onloadend =function(event){
			var tempImage = new Image();
			tempImage.onload = function(ev){
				var factor = 1
				newCanvas.height = ev.target.height/factor;
				newCanvas.width = ev.target.width/factor;
				if(newCanvas.width < 10 || newCanvas.height < 10){
					newCanvas.width = newCanvas.width *10
					newCanvas.height = newCanvas.height *10
				}

				ctx.drawImage(ev.target, 0,0, newCanvas.width, newCanvas.height)
				document.body.append(newCanvas)
				
			}
			tempImage.src= event.target.result

		}
		reader.readAsDataURL(file)
	}
}
function loadFile(file) {
	var tempOmageStore = new Image();

	tempOmageStore.onload = function(ev){
		var factor = 10
		mainCanvas.height = ev.target.height/factor;
		mainCanvas.width = ev.target.width/factor;

		ctx.drawImage(ev.target, 0,0, mainCanvas.width, mainCanvas.height)
	}
	tempOmageStore.src = file
	return true
}