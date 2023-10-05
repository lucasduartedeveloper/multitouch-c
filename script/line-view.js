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

    infoView = document.createElement("span");
    infoView.style.position = "absolute";
    infoView.style.color = "#fff";
    infoView.style.fontWeight = "900";
    infoView.innerText = "60 10";
    infoView.style.lineHeight = "50px";
    infoView.style.fontSize = "15px";
    infoView.style.textAlign = "left";
    infoView.style.fontFamily = "Khand";
    infoView.style.left = (10)+"px";
    infoView.style.top = (10)+"px";
    infoView.style.width = (100)+"px";
    infoView.style.height = (50)+"px"; 
    infoView.style.scale = "0.9";
    infoView.style.borderRadius= "25px";
    infoView.style.zIndex = "15";
    document.body.appendChild(infoView);

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

    deviceList = [ "front", "back", "back1", "back2", "back3" ];
    deviceView = document.createElement("span");
    deviceView.style.position = "absolute";
    deviceView.style.background = "#fff";
    deviceView.style.color = "#000";
    deviceView.style.fontWeight = "900";
    deviceView.innerText = deviceList[deviceNo];
    deviceView.style.lineHeight = "50px";
    deviceView.style.fontSize = "15px";
    deviceView.style.textAlign = "center";
    deviceView.style.fontFamily = "Khand";
    deviceView.style.left = (110)+"px";
    deviceView.style.top = (sh-60)+"px";
    deviceView.style.width = (50)+"px";
    deviceView.style.height = (50)+"px"; 
    deviceView.style.scale = "0.9";
    deviceView.style.border = "1px solid #000"; 
    deviceView.style.borderRadius= "25px";
    deviceView.style.zIndex = "15";
    document.body.appendChild(deviceView);

    deviceView.onclick = function() {
        deviceNo = (deviceNo+1) < videoDevices.length ? 
        (deviceNo+1) : 0;

        camera.style.transform = (deviceNo == 0) ? 
        "rotateY(-180deg)" : "initial";
        deviceView.innerText = deviceList[deviceNo];
    };

    updateCircle = true;
    toggleCircleView = document.createElement("span");
    toggleCircleView.style.position = "absolute";
    toggleCircleView.style.background = "#fff";
    toggleCircleView.style.color = "#000";
    toggleCircleView.style.fontWeight = "900";
    toggleCircleView.style.lineHeight = "50px";
    toggleCircleView.style.fontSize = "15px";
    toggleCircleView.style.textAlign = "center";
    toggleCircleView.innerText = "ON";
    toggleCircleView.style.fontFamily = "Khand";
    toggleCircleView.style.left = (160)+"px";
    toggleCircleView.style.top = (sh-60)+"px";
    toggleCircleView.style.width = (50)+"px";
    toggleCircleView.style.height = (50)+"px"; 
    toggleCircleView.style.scale = "0.9";
    toggleCircleView.style.border = "1px solid #000"; 
    toggleCircleView.style.borderRadius= "25px";
    toggleCircleView.style.zIndex = "15";
    document.body.appendChild(toggleCircleView);

    toggleCircleView.onclick = function() {
        updateCircle = !updateCircle;
        toggleCircleView.innerText = updateCircle ? "ON" : "OFF";
    };

    airResistanceLabel = document.createElement("span");
    airResistanceLabel.style.position = "absolute";
    airResistanceLabel.style.color = "#fff";
    //airResistanceLabel.style.fontWeight = "900";
    airResistanceLabel.style.lineHeight = "25px";
    airResistanceLabel.style.fontSize = "15px";
    airResistanceLabel.style.textAlign = "center";
    airResistanceLabel.innerText = "Air resistance: 0";
    airResistanceLabel.style.fontFamily = "Khand";
    airResistanceLabel.style.left = (220)+"px";
    airResistanceLabel.style.top = (sh-60)+"px";
    airResistanceLabel.style.width = (100)+"px";
    airResistanceLabel.style.height = (25)+"px"; 
    airResistanceLabel.style.scale = "0.9";
    airResistanceLabel.style.zIndex = "15";
    document.body.appendChild(airResistanceLabel);

    airResistanceView = document.createElement("input");
    airResistanceView.style.position = "absolute";
    airResistanceView.max = 5;
    airResistanceView.min = -5;
    airResistanceView.step = 0.1;
    airResistanceView.value = 0;
    airResistanceView.type = "range";
    airResistanceView.style.left = (220)+"px";
    airResistanceView.style.top = (sh-35)+"px";
    airResistanceView.style.width = (100)+"px";
    airResistanceView.style.height = (25)+"px"; 
    airResistanceView.style.scale = "0.9";
    airResistanceView.style.zIndex = "15";
    document.body.appendChild(airResistanceView);

    airResistanceView.onchange = function() {
        airResistance = airResistanceView.value;
        airResistanceLabel.innerText = "Air resistance: "+
        airResistanceView.value;
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
            updateInfo(lastFrameCount, readings);
            lastReadings = readings;
            readings = 0;
            startTime = new Date().getTime();
        }

        var accX = -(gyro.accX)+airResistance;

        if (updateImage) {
            position.x += accX;
            if (position.x < (size/2))
            position.x = (size/2);
            if (position.x > sw-(size/2))
            position.x = sw-(size/2);
        }
    };

    animate();
});

var airResistance = 0;

var lastReadings = 0;
var lastFrameCount = 0;
var updateInfo = function(frameCount, readings) {
    infoView.innerText = frameCount + " " + readings;
};

var frameCount = 0;
var renderTime = 0;
var updateImage = true;
var position = { x: (sw/2), y: (sh/2) };
var animate = function() {
    if (updateImage) {
        drawImage();
    }
    frameCount += 1;
    if (new Date().getTime() - renderTime > 1000) {
        updateInfo(frameCount, lastReadings);
        lastFrameCount = frameCount;
        frameCount = 0;
        renderTime = new Date().getTime();
    }
    requestAnimationFrame(animate);
};

var size = 50;
var drawImage = function() {
     var ctx = canvas.getContext("2d");
     ctx.clearRect(0, 0, sw, sh);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#000";

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

     var clip = document.createElement("canvas");
     clip.width = size;
     clip.height = size;

     var clipCtx = clip.getContext("2d");

     if (cameraOn) {
         clipCtx.save();
         if (deviceNo == 0) {
             clipCtx.scale(-1, 1);
             clipCtx.translate(-size, 0);
         }

         var offsetX = (vw-sw)/2;
         var offsetY = (vh-sh)/2;

         var format = {
             left: (vw/2)-(size/2),
             top: (vh/2)-(size/2),
             width: size,
             height: size
         };

         clipCtx.drawImage(camera, 
         format.left, format.top, 
         format.width, format.height,
         0, 0, size, size);
         clipCtx.restore();

         ctx.save();
         ctx.beginPath();
         ctx.arc(position.x, position.y, (size/2), 0, (Math.PI*2));
         ctx.clip();

         if (updateCircle)
         ctx.drawImage(clip, 
         position.x-(size/2), position.y-(size/2), size, size);
         ctx.restore();
     }
};
