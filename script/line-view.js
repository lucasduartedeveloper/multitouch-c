var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var sw = window.innerWidth;
var sh = window.innerHeight;

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", backgroundColor);
    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");

    $("#title")[0].innerText = "";

    var opacity = 1;
    camera = document.createElement("video");
    camera.style.position = "absolute";
    camera.style.opacity = opacity;
    camera.style.objectFit = "cover";
    camera.width = sw;
    camera.height = sh;
    camera.autoplay = true;
    camera.style.left = ((sw/2)-(sw/2))+"px";
    camera.style.top = ((sh/2)-(sh/2))+"px";
    camera.style.width = (sw)+"px";
    camera.style.height = (sh)+"px";
    camera.style.transform = (deviceNo == 0) ? 
    "rotateY(-180deg)" : "initial";
    camera.style.zIndex = "11";
    document.body.appendChild(camera);
    cameraElem = camera;

    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = sw;
    canvas.height = sh;
    canvas.style.left = ((sw/2)-(sw/2))+"px";
    canvas.style.top = ((sh/2)-(sh/2))+"px";
    canvas.style.width = (sw)+"px";
    canvas.style.height = (sh)+"px";
    canvas.style.zIndex = "11";
    document.body.appendChild(canvas);

    toggleView = document.createElement("span");
    toggleView.style.position = "absolute";
    toggleView.style.background = backgroundColor;
    toggleView.style.background = "#fff";
    toggleView.style.color = "#000";
    toggleView.style.fontWeight = "900";
    toggleView.innerText = "PLAY/PAUSE";
    toggleView.style.lineHeight = "50px";
    toggleView.style.fontSize = "15px";
    toggleView.style.textAlign = "center";
    toggleView.style.fontFamily = "Khand";
    toggleView.style.left = (10)+"px";
    toggleView.style.top = (sh-60)+"px";
    toggleView.style.width = (100)+"px";
    toggleView.style.height = (50)+"px"; 
    toggleView.style.scale = "0.9";
    toggleView.style.border = "1px solid #000";
    toggleView.style.borderRadius= "25px";
    toggleView.style.zIndex = "15";
    document.body.appendChild(toggleView);

    toggleView.onclick = function() {
       updateImage = !updateImage;
    };

    startTime = 0;
    readings = 0;
    motion = true;
    gyroUpdated = function(gyro) {
        var co = gyro.accX;
        var ca = gyro.accY;
        var a = _angle2d(co, ca);
        var deg = (180/Math.PI)*a;

        readings += 1;
        if (new Date().getTime() - startTime > 1000) {
            console.log("updated "+readings+" times");
            readings = 0;
            startTime = new Date().getTime();
        }
        position.x += -(gyro.accX);
    };

    animate();
});

var updateImage = true;
var position = { x: (sw/2), y: (sh/2) };
var animate = function() {
    if (updateImage) {
        drawImage();
    }
    requestAnimationFrame(animate);
};

var size = 50;
var drawImage = function() {
     var ctx = canvas.getContext("2d");
     ctx.clearRect(0, 0, sw, sh);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#fff";

     ctx.beginPath();
     ctx.arc(position.x, position.y, (size/2), 0, (Math.PI*2));
     ctx.stroke();

     var end0 = position.x - (size/2);
     ctx.beginPath();
     ctx.moveTo(0, (sh/2));
     ctx.lineTo(end0, (sh/2));
     ctx.stroke();

     var end1 = position.x + (size/2);
     ctx.beginPath();
     ctx.moveTo(sw, (sh/2));
     ctx.lineTo(end1, (sh/2));
     ctx.stroke();
};
