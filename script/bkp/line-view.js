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

    toggleView.onclick = function() {
        updateImage = !updateImage;
        if (updateImage)
        if (cameraOn) {
            stopCamera();
        }
        else {
            startCamera();
        }
    };

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

    clip = document.createElement("canvas");
    clip.width = width;
    clip.height = width;

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

        if (updateImage)
        position.x += accX;
    };

    fillArray();
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

var width = (sw/2);
var recoil = 1;
var curveArr = [];
var scaleArr = [];
var fillArray = function() {
    curveArr = [];
    scaleArr = [];
    for (var n = 0; n < width; n++) {
        var c = { x: 0, y: 0 };
        var p0 = { x: -5, y: 0 };
        var rp0 = _rotate2d(c, p0, -(n*(90/width)));
        var p1 = { x: -1, y: 0 };
        var rp1 = _rotate2d(c, p1, -(n*(90/width)));
        var cp0 = _rotate2d(c, p0, -(n*(180/width)));
        var cp1 = _rotate2d(c, p1, -(n*(180/width)));
        var rp = {
            x: rp1.x*-1,
            y: rp0.y*-1
        };
        rp.y = (rp.y * recoil);
        var cp = {
            x: cp1.x,
            y: cp0.y*-1
        };
        cp.y = (cp.y * recoil);
        var value = recoil > 0 ? 
        1+(Math.abs(rp.y)) : 
        1-(Math.abs(rp.y));
        rp.value = value;
        curveArr.push(cp);
        scaleArr.push(rp);
    }
};

var drawImage = function() {
     var ctx = canvas.getContext("2d");
     ctx.clearRect(0, 0, sw, sw);

     ctx.fillStyle = "#fff";
     ctx.fillRect(0, 0, sw, sh);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "lightblue";
     var size = (sw/15);
     for (var y = 0; y < size; y++) {
         ctx.beginPath();
         ctx.moveTo((y*size), 0);
         ctx.lineTo((y*size), sh);
         ctx.stroke();
         for (var x = 0; x < (sh/size); x++) {
             ctx.beginPath();
             ctx.moveTo(0, (x*size)+(size/2));
             ctx.lineTo(sw, (x*size)+(size/2));
             ctx.stroke();
         }
     }

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#000";
     ctx.beginPath();
     ctx.moveTo((sw/2)-((width/4)*2)-((width/8)*curveArr[0].x), 
     ((sh/2)+(width*1.5))-((width/8)*(curveArr[0].y/3)));
     for (var n = 1; n < curveArr.length; n++) {
         ctx.lineTo((sw/2)-((width/4)*2)-((width/8)*curveArr[n].x), 
         ((sh/2)+(width*1.5))-((width/8)*(curveArr[n].y/3)));
     }
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)-(width/4)-((width/8)*curveArr[0].x), 
     ((sh/2)+(width*1.5))-((width/8)*(curveArr[0].y/2)));
     for (var n = 1; n < curveArr.length; n++) {
         ctx.lineTo((sw/2)-(width/4)-((width/8)*curveArr[n].x), 
         ((sh/2)+(width*1.5))-((width/8)*(curveArr[n].y/2)));
     }
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)-((width/8)*scaleArr[0].x), 
     ((sh/2)+(width*1.5))-((width/8)*scaleArr[0].y));
     for (var n = 1; n < scaleArr.length; n++) {
         ctx.lineTo((sw/2)-((width/8)*scaleArr[n].x), 
         ((sh/2)+(width*1.5))-((width/8)*scaleArr[n].y));
     }
     ctx.stroke();

     var clipCtx = clip.getContext("2d");
     clipCtx.clearRect(0, 0, sw, sw);

     for (var n = 0; n < (width/2) ; n++) {
        var radius = ((width/2)-n);
        clipCtx.save();
        clipCtx.beginPath();
        clipCtx.arc((width/2), (width/2), radius, 0, (Math.PI*2));
        clipCtx.clip();

        var scale = scaleArr[n].value;

        if (cameraOn)
        clipCtx.drawImage(camera, 
        ((vw/2)-((width/2)/scale)), ((vh/2)-((width/2)/scale)),
        (width/scale), (width/scale), 
        0, 0, width, width);
        else
        clipCtx.drawImage(canvas, 
        ((sw/2)-((width/2)/scale)), ((sh/2)-((width/2)/scale)),
        (width/scale), (width/scale), 
        0, 0, width, width);

        clipCtx.restore();
    }

    ctx.drawImage(clip, 
    ((sw/2)-(width/2)), ((sh/2)-(width/2)), width, width);
};

var getMiddleNumbers = function(start, end) {
     var total = (end-start);
     if (total % 2 != 0) 
     throw new Error("Middle numbers not available.");

     var middle0 = (start+(total/2));
     var middle1 = ((start+(total/2))+1);

     var obj = { 
         middle0: middle0, 
         middle1: middle1 
     };
     return obj;
};
