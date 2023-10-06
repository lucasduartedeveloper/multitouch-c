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

    createLine();
    animate();
});

var airResistance = 0;

var lastReadings = 0;
var lastFrameCount = 0;
var updateInfo = function(frameCount, readings) {
    infoView.innerText = frameCount + " " + readings;
};

var bitCount = 8;
var lineX = [];
var lineY = [];

var createLine = function() {
    lineX = [];
    lineY = [];
    for (var n = 0; n < bitCount; n++) {
        var rnd = Math.floor(Math.random()*2);
        lineX[n] = rnd;
        var rnd = Math.floor(Math.random()*2);
        lineY[n] = rnd;
    }
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

var reverse = function() {
    var result = [ ...line ];
    for (var n = 0; n < bitCount; n++) {
        result[n] = result[n] == 1 ? 0 : 1;
    }
    return result;
};

var byteToInt = function(byteArr) {
    var result = byteArr.join("");
    result = parseInt(result, 2);
    return result;
};

var xor = function(x, y) {
    if (x == 0 && y == 0) return 0;
    if (x == 1 && y == 1) return 0;
    if (x == 1 || y == 1) return 1;
};

var xorArr = function(arrX, arrY) {
    var result = [ ...arrX ];
    for (var n = 0; n < bitCount; n++) {
        result[n] = xor(result[n], arrY[n]);
    }
    return result;
};

var and = function(x, y) {
    if (x == 1 && y == 1) return 1;
    else return 0;
};

var andArr = function(arrX, arrY) {
    var result = [ ...arrX ];
    for (var n = 0; n < bitCount; n++) {
        result[n] = and(result[n], arrY[n]);
    }
    return result;
};

var halfSum = function(arrX, arrY) {
    var xor = xorArr(arrX, arrY);
    var carry = andArr(arrX, arrY);
    var result = {
        xor: xor,
        carry: carry
    };
    return result;
};

var binarySum = function(arrX, arrY) {
    console.log(arrX.join(" ") + " - " + byteToInt(arrX));
    console.log(arrY.join(" ") + " - " + byteToInt(arrY));

    var half = halfSum(arrX, arrY);
    console.log(half.xor.join(" ") + " - " + byteToInt(half.xor));
    console.log(half.carry.join(" ") + " - " + byteToInt(half.carry));

    var full = halfSum(half.xor, half.carry);
    console.log(full.xor.join(" ") + " - " + byteToInt(full.xor));
    console.log(full.carry.join(" ")  + " - " + byteToInt(full.carry));

    console.log("-----");

    var result = {
        half: half,
        full: full
    };
    return result;
};

var size = 10;
var drawImage = function() {
     var ctx = canvas.getContext("2d");
     ctx.clearRect(0, 0, sw, sw);

     ctx.fillStyle = "#fff";
     ctx.fillRect(0, 0, sw, sh);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#000";
     for (var n = 0; n <= 16; n++) {
         ctx.beginPath();
         ctx.moveTo(((sw/2)-(16*(size/2)))+(n*size), ((sh/2)-(40*(size/2))));
         ctx.lineTo(((sw/2)-(16*(size/2)))+(n*size), ((sh/2)-(40*(size/2)))+(16*size));
         ctx.stroke();

         ctx.beginPath();
         ctx.moveTo(((sw/2)-(16*(size/2))), ((sh/2)-(40*(size/2)))+(n*size));
         ctx.lineTo(((sw/2)+(16*(size/2))), (sh/2)-(40*(size/2))
         +(n*size));
         ctx.stroke();
     }

     ctx.lineWidth = 1;
     ctx.fillStyle = "#000";
     ctx.strokeStyle = "#000";

     ctx.font = "10px sans serif";
     ctx.textAlign = "left";
     ctx.textBaseline = "middle";
     ctx.fillText(byteToInt(lineX), 
     ((sw/2)+((bitCount/2)*(size*2))+(size*2)), 
     ((sh/4)*3));

     ctx.fillStyle = "lightblue";
     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.rect(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)), 
         (((sh/4)*3)-(size/2)), 
         size, size);
         if (lineX[n] == 1)
         ctx.fill();
         ctx.stroke();
     }

     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.moveTo(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2)), 
         (((sh/4)*3)-(size/2)));
         ctx.lineTo(((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2)), 
         (((sh/4)*3)-(size*8)+(size)));
         ctx.stroke();
     }

     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.rect(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size))+size, 
         (((sh/4)*3)-(size*4))-(size/2), 
         size, size);
         if (lineY[n] == 1)
         ctx.fill();
         ctx.stroke();
     }

     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.moveTo(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2))+size,
         (((sh/4)*3)-(size*4)-(size/2)));
         ctx.lineTo(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2))+size,
         (((sh/4)*3)-(size*8)+(size)));
         ctx.stroke();
     }

     var sumArr = binarySum(lineX, lineY);
     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.rect(
         ((sw/2)-((bitCount/2)*(size*2))+(n*(size*2))), 
         (((sh/4)*3)-(size*8))-(size), 
         (size*2), (size*2));
         if (sumArr.half.xor[n] == 1)
         ctx.fill();
         ctx.stroke();
     }

     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.rect(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size))+size, 
         (((sh/4)*3)-(size*9))-(size), 
         size, size);
         if (sumArr.half.carry[n] == 1)
         ctx.fill();
         ctx.stroke();
     }

     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.moveTo(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2)), 
         (((sh/4)*3)-(size*8)-(size)));
         ctx.lineTo(((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2)), 
         (((sh/4)*3)-(size*16)+(size)));
         ctx.stroke();
     }

     var sumArr = binarySum(lineX, lineY);
     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.rect(
         ((sw/2)-((bitCount/2)*(size*2))+(n*(size*2))), 
         (((sh/4)*3)-(size*16))-(size), 
         (size*2), (size*2));
         if (sumArr.full.xor[n] == 1)
         ctx.fill();
         ctx.stroke();
     }

     for (var n = 0; n < bitCount; n++) {
         ctx.beginPath();
         ctx.moveTo(
         ((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2))+(size), 
         (((sh/4)*3)-(size*8)-(size*2)));
         ctx.lineTo(((sw/2)-((bitCount/2)*(size*2))+((n*2)*size)+(size/2))+(size), 
         (((sh/4)*3)-(size*16)+(size)));
         ctx.stroke();
     }

     ctx.fillStyle = "#000";

     ctx.font = "10px sans serif";
     ctx.textAlign = "left";
     ctx.textBaseline = "middle";
     ctx.fillText(byteToInt(lineY), 
     ((sw/2)+((bitCount/2)*(size*2))+(size*2)), 
     ((sh/4)*3)-(size*4));

     var sum = (byteToInt(lineX)+byteToInt(lineY));
     ctx.font = "10px sans serif";
     ctx.textAlign = "left";
     ctx.textBaseline = "middle";
     ctx.fillText(byteToInt(sumArr.half.xor), 
     ((sw/2)+((bitCount/2)*(size*2))+(size*2)), 
     ((sh/4)*3)-(size*8));

     ctx.font = "10px sans serif";
     ctx.textAlign = "left";
     ctx.textBaseline = "middle";
     ctx.fillText(byteToInt(sumArr.half.carry), 
     ((sw/2)+((bitCount/2)*(size*2))+(size*2)), 
     ((sh/4)*3)-(size*8)-(size*2));

     ctx.font = "10px sans serif";
     ctx.textAlign = "left";
     ctx.textBaseline = "middle";
     ctx.fillText(byteToInt(sumArr.full.xor)+" / "+sum, 
     ((sw/2)+((bitCount/2)*(size*2))+(size*2)), 
     ((sh/4)*3)-(size*16));
};