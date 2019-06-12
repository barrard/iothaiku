var count = 0
var second = 0
var myCanvas = document.getElementById('myCanvas')
var ctx = myCanvas.getContext('2d')
myCanvas.width = 450
myCanvas.height = 500
var cWidth = myCanvas.width
var cHeight = myCanvas.height

window.addEventListener('DOMContentLoaded', initImageLoader);
function initImageLoader() {

	// var location = window.location.href.replace('/\/+$/', "");
	// var location = window.location.href;
	loadFile('/myPic.JPG')
}
function loadFile(file) {
	var tempImageStore = new Image();

	tempImageStore.onload = function(ev){
		var factor = 1
		myCanvas.height = ev.target.height/factor;
		myCanvas.width = ev.target.width/factor;

		ctx.drawImage(ev.target, 0,0, myCanvas.width, myCanvas.height)
	}
	tempImageStore.src = file
	return true
}

setInterval(function(){
	console.log(second)
	second++
	console.log('one second')
		console.log(count)

}, 1000)
setInterval(function(){
animate()
}, 1000/6)

function animate(){
	var image = ctx.getImageData(0,0, cWidth, cHeight)
	var pixel = image.data

	count++
	// requestAnimationFrame(animate)

	for(var y = 0; y< cHeight ; y++){
		for(var x = 0;x<cWidth;x++){
			var index = (x + y * cWidth)*4
			pixel[index+0] = x//red
			pixel[index+1] = Math.random()*255//green
			pixel[index+2] = y//blue
			pixel[index+3] = 255//alph

		}
	}
	ctx.putImageData(image, 0, 0)
}


//cool rainbow snow------------------------
// function animate(){
// 	var image = ctx.getImageData(0,0, cWidth, cHeight)
// 	var pixel = image.data

// 	count++
// 	// requestAnimationFrame(animate)

// 	for(var y = 0; y< cHeight ; y++){
// 		for(var x = 0;x<cWidth;x++){
// 			var index = (x + y * cWidth)*4
// 			pixel[index+0] = x//red
// 			pixel[index+1] = Math.random()*255//green
// 			pixel[index+2] = y//blue
// 			pixel[index+3] = 255//alph

// 		}
// 	}
// 	ctx.putImageData(image, 0, 0)
// }

animate()