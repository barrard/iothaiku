var imagingCanvas = document.getElementById('imagingCanvas');
var imgCtx = imagingCanvas.getContext('2d'),
	inputFileBtn = document.getElementById('inputFileBtn'),
	selectPhotoBtn = document.getElementById('selectPhotoBtn'),
	penEditBtn = document.getElementById('penEditBtn'),
	clearEditBtn = document.getElementById('clearEditBtn'),
	dataEditBtn = document.getElementById('dataEditBtn'),
	boxEditBtn = document.getElementById('boxEditBtn'),
	circleEditBtn = document.getElementById('circleEditBtn'),
	reduceBlueBtn = document.getElementById('reduceBlueBtn'),

	pixels=[]
imagingCanvas.width = 500
imagingCanvas.height = 500
imgCtx.strokeStyle='#222222'
imgCtx.lineWidth = 2;
// Set up mouse events for drawing
var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;

window.addEventListener('DOMContentLoaded', initImagingCanvas);

function initImagingCanvas(){
	reduceBlueBtn.addEventListener('click', reduceBlueFn)
	penEditBtn.addEventListener('click', initPenEdit)
	clearEditBtn.addEventListener('click', initClearEditBtn)
	dataEditBtn.addEventListener('click', initDataEditBtn)
	boxEditBtn.addEventListener('click', initBoxEditBtn)
	circleEditBtn.addEventListener('click', initCircleEditBtn)
	selectPhotoBtn.addEventListener('click', function(e){
		// e.preventDefault()
		inputFileBtn.click()
	})
	inputFileBtn.addEventListener('change', handleImageUpload)
	getPixels()
}

function reduceBlueFn(){
	//img.i (mg) and img.p (ixles)
	var img = returnPixles()
}

function initClearEditBtn(){
	clearCanvas()
}
function initDataEditBtn(){
	 console.log(imagingCanvas.toDataURL());

}
function initBoxEditBtn(){
	
}
function initCircleEditBtn(){
	
}

function returnPixles(){
	var image = imgCtx.getImageData(0,0, imagingCanvas.width, imagingCanvas.height)
	 pixels = image.data
	 return {i:image,
	 					p:pixels}

}

function getPixels(){
	var image = returnPixles()
	// var image = imgCtx.getImageData(0,0, imagingCanvas.width, imagingCanvas.height)
	//  pixels = image.data
	var rows  = imgCtx.canvas.height
	var columns  = imgCtx.canvas.width
	//make the obj
	for(let y = 0 ; y < rows; y++){
		for(let x = 0; x < columns ; x++){
			var index = (x + y * columns)*4
			image.p[index+0] = 100//red
			image.p[index+1] = 200//green
			image.p[index+2] = 100//blue
			image.p[index+3] = 100//alph
		}
	}

imgCtx.putImageData(image.i, 0, 0)



}

function initPenEdit(){
	// imagingCanvas.style.cursor = 'none'
	imagingCanvas.addEventListener('mousedown', handleMouseDown, false)
	imagingCanvas.addEventListener("mouseup", handleMouseUp, false);
	imagingCanvas.addEventListener("mousemove", handleMouseMove, false);


}

function handleMouseMove(e) {
	// console.log('mousemove')
	  mousePos = getMousePos(imagingCanvas, e);
	}

function handleMouseUp(e){
	// console.log('mouseup')

		  drawing = false;
		
}
function handleMouseDown(e){
	// console.log('mousedown')

	drawing = true;
	lastPos = getMousePos(imagingCanvas, e);
}
// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimaitonFrame ||
           function (callback) {
        window.setTimeout(callback, 1000/60);
           };
})();

// Draw to the canvas
function renderCanvas() {
  if (drawing) {
    imgCtx.moveTo(lastPos.x, lastPos.y);
    imgCtx.lineTo(mousePos.x, mousePos.y);
    imgCtx.stroke();
    lastPos = mousePos;
  }
}

// Allow for animation
(function drawLoop () {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();


// Set up touch events for mobile, etc
imagingCanvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(imagingCanvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  imagingCanvas.dispatchEvent(mouseEvent);
}, false);
imagingCanvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  imagingCanvas.dispatchEvent(mouseEvent);
}, false);
imagingCanvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  imagingCanvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}



// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == imagingCanvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == imagingCanvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == imagingCanvas) {
    e.preventDefault();
  }
}, false);
function clearCanvas() {
    imagingCanvas.width = imagingCanvas.width;
}

function clickIt(el){
	// e.preventDefault()
	//simulate clicking on the menu item with data-link attribute == this.id
	var evObj = document.createEvent('Events');
	evObj.initEvent('click', true, false);
	// var id = e.target.id
	// var el = document.querySelector("[data-link="+id+"]")
	el.dispatchEvent(evObj);
	
	// console.log(e)
}


function handleImageUpload(ev){
	console.log(ev.target.value)
	var files = ev.target.files[0]
	handleFile(files)
}


function handleFile(file){
	console.log(file.type)


	var imageType = /image.*/;
	if(file.type.match(imageType)){
		var reader = new FileReader()
		reader.readAsDataURL(file)

		reader.onloadend =function(event){
			console.log('reader evenet')
			console.log(event.target)
			var tempImage = new Image();
			tempImage.src= event.target.result

			tempImage.onload = function(ev){
				console.log('onload temp image')
				console.log(ev.target)

				console.log('height')
				console.log(ev.target.height)
				console.log('width')
				console.log(ev.target.width)
				var height = ev.target.height
				var width = ev.target.width
				var w_h_ration = width/height
				console.log(w_h_ration)

if (height > width) {
	console.log('portait')
	imagingCanvas.height = 500
	imagingCanvas.width = imagingCanvas.height*w_h_ration

}else if (width > height) {
	console.log('landscape')
	console.log('height')
	console.log(height)
	console.log('width')
	console.log(width)
	imagingCanvas.width = 500
	imagingCanvas.height = imagingCanvas.width/w_h_ration
}

				// drawImageScaled(ev.target, imgCtx)
				imgCtx.drawImage(ev.target, 0,0, imagingCanvas.width, imagingCanvas.height)
				
			}

		}
	}
}




//garbage
// function handleMuseoverCanvas(e){
// 	console.log(e)
// 			e.preventDefault()
// 			if(e.touches && e.touches[0].clientX){
// 				var clientX = e.touches[0].clientX;
// 				var clientY = e.touches[0].clientY;
// 			}else{
// 				var clientX = e.clientX;
// 				var clientY = e.clientY;
// 			}

// 			var inititalX = clientX
// 	 		var inititalY = clientY



// 			var currentTop = parseInt(e.target.offsetTop)
// 			var currentLeft = parseInt(e.target.offsetLeft)
// 			var movementX = clientX - inititalX 
// 			var movementY = clientY - inititalY 
// 			// console.log(inititalX)
// 			// console.log(inititalY)
// 			// console.log(currentTop)
// 			// console.log(currentLeft)
// 			var X = clientX-currentLeft
// 			var Y = clientY-currentTop
// 			console.log('poistion x' + X)
// 			console.log('poistion y' + Y)
// 			var image = imgCtx.getImageData(0,0, imagingCanvas.width, imagingCanvas.height)
// 			 pixels = image.data
// 			var index = (X + Y * imagingCanvas.width)*4
// 			//x+1 x x-1
// 			//y-1 y y+1
// 			for(let y = Y-5 ; y <= Y+5 ; y++ ){
// 				for(let x = X-10 ; x <= X+10 ;x++){
// 					var index = (x + y * imagingCanvas.width)*4
// 					pixels[index+0] = 200//red
// 					pixels[index+1] = 200//green
// 					pixels[index+2] = 200//blue
// 					pixels[index+3] = 200//alph

// 					imgCtx.putImageData(image, 0, 0)

// 				}
// 			}
// }
