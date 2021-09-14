$('#myimage').on('load',function() {
    console.log( "ready!" );
    imageZoom('myimage', 'myresult');
}); 

$(window).resize(()=>{
    imageZoom('myimage', 'myresult');
    console.log("RESIZED")
})

var zoom_strength = 100;

var slider = document.getElementById("myRange");
var zoomstrdspl = document.getElementById("zmstrds");
//var output = document.getElementById("demo");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    zoom_strength = 100 - this.value; 
    change_zoom_value();
    zoomstrdspl.innerText = 'Zoom Strength : '+this.value
}


function change_zoom_value () {
    if(zoom_strength == 0){zoom_strength = 1}
    console.log(zoom_strength);

    var zoom_lens = document.getElementsByClassName("img-zoom-lens");
    zoom_lens[0].style = 'width : '+ zoom_strength +'px ; height : '+ zoom_strength + 'px ;';
    imageZoom('myimage', 'myresult');
}


/* var availables = '<%=availables%>';
var array = availables.split(',');
var div = document.getElementById("buttonspace");
var imageele = document.getElementById("myimage");
array.forEach((image) => {
    var btn = ''
    div.insertAdjacentHTML("beforeend",`<button onclick="change_image('${image}')">${image}</button>`)
}) */

function change_image(imageurl) {
    imageele.src = '/getmeimage/' + imageurl;
    //var zoomer = document.getElementsByClassName("img-zoom-lens")
    //zoomer[0].remove()
}

function imageZoom(imgID, resultID) {
var img, lens, result, cx, cy ,im_w , im_h;
img = document.getElementById(imgID);
var zooming_lens = document.getElementsByClassName("img-zoom-lens"); 
lens = zooming_lens[0];
im_h = img.offsetHeight;
im_w = img.offsetWidth;
console.log(im_w+'W '+im_h+'H ');

/*lens.style = "margin-top:"+img.style.marginTop+"px;" */
result = document.getElementById(resultID);
/* Create lens: */
//lens = document.createElement("DIV");
//lens.setAttribute("class", "img-zoom-lens");
/* Insert lens: */
//img.parentElement.insertBefore(lens, img);
/* Calculate the ratio between result DIV and lens: */
cx = result.offsetWidth / lens.offsetWidth;
cy = result.offsetHeight / lens.offsetHeight;
/* Set background properties for the result DIV */
result.style.backgroundImage = "url('" + img.src + "')";
result.style.backgroundSize = (im_w * cx) + "px " + (im_h * cy) + "px";    //W H
/* Execute a function when someone moves the cursor over the image, or the lens: */
lens.removeEventListener("mousemove", moveLens);
img.removeEventListener("mousemove", moveLens);
lens.addEventListener("mousemove", moveLens);
img.addEventListener("mousemove", moveLens);
/* And also for touch screens: */
//lens.addEventListener("touchmove", moveLens);
//img.addEventListener("touchmove", moveLens);
function moveLens(e) {
var pos, x, y;
/* Prevent any other actions that may occur when moving over the image */
e.preventDefault();
/* Get the cursor's x and y positions: */
pos = getCursorPos(e);
/* Calculate the position of the lens: */
x = pos.x - (lens.offsetWidth / 2);
y = pos.y - (lens.offsetHeight / 2);
/* Prevent the lens from being positioned outside the image: */
if (x > img.width - lens.offsetWidth) {x = im_w - lens.offsetWidth;}          //W
if (x < 0) {x = 0;}
if (y > img.height - lens.offsetHeight) {y = im_h - lens.offsetHeight;}      //H
if (y < 0) {y = 0;}
/* Set the position of the lens: */
lens.style.left = x + "px";
lens.style.top = y + "px";

/* Display what the lens "sees": */
result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
}
function getCursorPos(e) {
var a, x = 0, y = 0;
e = e || window.event;
/* Get the x and y positions of the image: */
a = img.getBoundingClientRect();
/* Calculate the cursor's x and y coordinates, relative to the image: */
x = e.pageX - a.left;
y = e.pageY - a.top;
/* Consider any page scrolling: */
x = x - window.pageXOffset;
y = y - window.pageYOffset;
return {x : x, y : y};
}
}

