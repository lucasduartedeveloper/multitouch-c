var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var audio = new Audio("audio/phone-lock.wav");
var alarm = new Audio("audio/battleship-alarm.wav");
var coin = new Audio("audio/coin.wav");

var sw = window.innerWidth;
var sh = window.innerHeight;

var audioBot = false;
var playerId = new Date().getTime();

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

    var paramString = window.location.search;
    var urlParams = new URLSearchParams(paramString);

    var roomCode;
    if (urlParams.has("room"))
    roomCode = urlParams.get("room");
    else
    roomCode = "LPKNKKBFADAA";

    var size = decodeSize(roomCode);

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

    var startTime = 0;
    var startX = 0;
    var startY = 0;

    var moveX = 0;
    var moveY = 0;

    var pointerdown = false;

    onpointerdown = function(e) {
        if (e.target != camera) return;
        if (e.touches) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
        else {
            startX = e.clientX;
            startY = e.clientY;
        }
        pointerdown = true;

        dotView.style.left = (startX-5)+"px";
        dotView.style.top = (startY-5)+"px";

        startTime = new Date().getTime();

        setTimeout(function() {
            navigator.vibrate(500);
        }, 3000);
    };
    onpointermove = function(e) {
        if (!pointerdown) return;
        if (e.touches) {
            moveX = e.touches[0].clientX;
            moveY = e.touches[0].clientY;
        }
        else {
            moveX = e.clientX;
            moveY = e.clientY;
        }

        dotView.style.left = (moveX-5)+"px";
        dotView.style.top = (moveY-5)+"px";

        var offsetX = (moveX-startX);
        var offsetY = (moveY-startY);

        var accX = (1/(sw-50))*(moveX-startX);
        var accY = (1/(sw-50))*(moveY-startY);

        if (Math.abs(offsetX) > Math.abs(offsetY)) {
            translation = Math.floor(moveX-(sw/2));
            translation = translation < -75 ? -75 : translation;
            translation = translation > 75 ? 75 : translation;
            zoomOffset = 
            parseFloat(((0.5/75)*Math.abs(translation)).toFixed(1));
            zoom = (2-zoomOffset);
        }
        else {
            opacity += -(accY);
            opacity = opacity < 0 ? 0 : opacity;
            opacity = opacity > 1 ? 1 : opacity;
            camera.style.opacity = opacity;
        }
    };
    onpointerup = function(e) {
        if ((new Date().getTime() - startTime) < 3000) {
            translation = 0;
            dotView.style.left = ((sw/2)-5)+"px";
            dotView.style.top = ((sh/2)-5)+"px";
            navigator.vibrate(500);
        }
        pointerdown = false;
    };

    camera.ontouchstart = function() {
        camera.ontouchstart = onpointerdown;
        camera.ontouchmove = onpointermove;
        camera.ontouchend = onpointerup;
    }

    camera.onmousedown = function() {
        camera.onmousedown = onpointerdown;
        camera.onmousemove = onpointermove;
        camera.onmouseup = onpointerup;
    }

    verticalLineView = document.createElement("span");
    verticalLineView.style.position = "absolute";
    verticalLineView.style.background = "#fff";
    verticalLineView.style.left = ((sw/2)-0.5)+"px";
    verticalLineView.style.top = (0)+"px";
    verticalLineView.style.width = (1)+"px";
    verticalLineView.style.height = (sh)+"px"; 
    verticalLineView.style.zIndex = "15";
    document.body.appendChild(verticalLineView);

    localCountView = document.createElement("span");
    localCountView.style.position = "absolute";
    localCountView.style.background = backgroundColor;
    localCountView.style.color = "#fff";
    localCountView.style.fontWeight = "900";
    localCountView.innerText = "local: " + localImageCount;
    localCountView.style.lineHeight = "25px";
    localCountView.style.fontSize = "15px";
    localCountView.style.textAlign = "center";
    localCountView.style.fontFamily = "Khand";
    localCountView.style.left = ((sw/2)-50)+"px";
    localCountView.style.top = ((sh/2)+275)+"px";
    localCountView.style.width = (100)+"px";
    localCountView.style.height = (25)+"px"; 
    localCountView.style.scale = "0.9";
    localCountView.style.border = "1px solid #000"; 
    localCountView.style.zIndex = "15";
    document.body.appendChild(localCountView);

    remoteCountView = document.createElement("span");
    remoteCountView.style.position = "absolute";
    remoteCountView.style.background = backgroundColor;
    remoteCountView.style.color = "#fff";
    remoteCountView.style.fontWeight = "900";
    remoteCountView.innerText = 
    "remote: " + remoteImageCount;
    remoteCountView.style.lineHeight = "25px";
    remoteCountView.style.fontSize = "15px";
    remoteCountView.style.textAlign = "center";
    remoteCountView.style.fontFamily = "Khand";
    remoteCountView.style.left = ((sw/2)-50)+"px";
    remoteCountView.style.top = ((sh/2)+300)+"px";
    remoteCountView.style.width = (100)+"px";
    remoteCountView.style.height = (25)+"px"; 
    remoteCountView.style.scale = "0.9";
    remoteCountView.style.border = "1px solid #000"; 
    remoteCountView.style.zIndex = "15";
    document.body.appendChild(remoteCountView);

    toggleTorchView = document.createElement("i");
    toggleTorchView.style.position = "absolute";
    toggleTorchView.style.background = "#fff";
    toggleTorchView.style.color = "#000";
    toggleTorchView.className = "fa-solid fa-bolt";
    toggleTorchView.style.lineHeight = "50px";
    toggleTorchView.style.fontSize = "15px";
    toggleTorchView.style.textAlign = "center";
    toggleTorchView.style.left = ((sw/2)-150)+"px";
    toggleTorchView.style.top = ((sh/2)-300)+"px";
    toggleTorchView.style.width = (50)+"px";
    toggleTorchView.style.height = (50)+"px"; 
    toggleTorchView.style.scale = "0.9";
    toggleTorchView.style.border = "1px solid #000"; 
    toggleTorchView.style.borderRadius= "25px";
    toggleTorchView.style.zIndex = "15";
    document.body.appendChild(toggleTorchView);

    toggleTorchView.onclick = function() {
        setTorch("toggle");
    };

    toggleSnakeView = document.createElement("i");
    toggleSnakeView.style.position = "absolute";
    toggleSnakeView.style.background = "#fff";
    toggleSnakeView.style.color = "#000";
    toggleSnakeView.className = "fa-solid fa-gamepad";
    toggleSnakeView.style.lineHeight = "50px";
    toggleSnakeView.style.fontSize = "15px";
    toggleSnakeView.style.textAlign = "center";
    toggleSnakeView.style.left = ((sw/2)+100)+"px";
    toggleSnakeView.style.top = ((sh/2)-250)+"px";
    toggleSnakeView.style.width = (50)+"px";
    toggleSnakeView.style.height = (50)+"px"; 
    toggleSnakeView.style.scale = "0.9";
    toggleSnakeView.style.border = "1px solid #000"; 
    toggleSnakeView.style.borderRadius= "25px";
    toggleSnakeView.style.zIndex = "15";
    document.body.appendChild(toggleSnakeView);

    toggleSnakeView.onclick = function() {
        snakeGame = !snakeGame;
        cameraOn = snakeGame;
        if (snakeGame)
        snakeGameLoop();
    };

    magnifierView = document.createElement("i");
    magnifierView.style.position = "absolute";
    magnifierView.style.background = "#fff";
    magnifierView.style.color = "#000";
    magnifierView.className = "fa-solid fa-search";
    magnifierView.style.lineHeight = "50px";
    magnifierView.style.fontSize = "15px";
    magnifierView.style.textAlign = "center";
    magnifierView.style.left = ((sw/2)+100)+"px";
    magnifierView.style.top = ((sh/2)-300)+"px";
    magnifierView.style.width = (50)+"px";
    magnifierView.style.height = (50)+"px"; 
    magnifierView.style.scale = "0.9";
    magnifierView.style.border = "1px solid #000"; 
    magnifierView.style.borderRadius= "25px";
    magnifierView.style.zIndex = "15";
    document.body.appendChild(magnifierView);

    magnifierView.onclick = function() {
        loadStream();
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
    deviceView.style.left = ((sw/2)-100)+"px";
    deviceView.style.top = ((sh/2)-300)+"px";
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

    effectList = 
    [ "split-x a", "split-x b", "split-y", "striped x", "striped y", 
    "striped both", "remote", "3D" ];

    effectView = document.createElement("span");
    effectView.style.position = "absolute";
    effectView.style.background = "#fff";
    effectView.style.color = "#000";
    effectView.innerText = effectList[effect];
    effectView.style.lineHeight = "50px";
    effectView.style.fontSize = "15px";
    effectView.style.fontWeight = "900";
    effectView.style.textAlign = "center";
    effectView.style.fontFamily = "Khand";
    effectView.style.left = ((sw/2))+"px";
    effectView.style.top = ((sh/2)-300)+"px";
    effectView.style.width = (100)+"px";
    effectView.style.height = (50)+"px"; 
    effectView.style.scale = "0.9";
    effectView.style.border = "1px solid #000";
    effectView.style.borderRadius= "25px";
    effectView.style.zIndex = "15";
    document.body.appendChild(effectView);

    effectView.onclick = function() {
        var limit = remoteCameraConnected ? 6 : 7;
        effect = (effect+1) <= limit ? (effect+1) : 0;
        effectView.innerText = effectList[effect];
    };

    resolutionView = document.createElement("span");
    resolutionView.style.position = "absolute";
    resolutionView.style.background = "#fff";
    resolutionView.style.color = "#000";
    resolutionView.innerText = resolution+"px";
    resolutionView.style.fontWeight = "900";
    resolutionView.style.lineHeight = "50px";
    resolutionView.style.fontSize = "15px";
    resolutionView.style.textAlign = "center";
    resolutionView.style.fontFamily = "Khand";
    resolutionView.style.left = ((sw/2)-50)+"px";
    resolutionView.style.top = ((sh/2)-300)+"px";
    resolutionView.style.width = (50)+"px";
    resolutionView.style.height = (50)+"px"; 
    resolutionView.style.scale = "0.9";
    resolutionView.style.border = "1px solid #000";
    resolutionView.style.borderRadius= "50%";
    resolutionView.style.zIndex = "15";
    document.body.appendChild(resolutionView);

    resolutionView.onclick = function() {
        resolution = (resolution+1) < 11 ? (resolution+1) : 1;
        resolutionView.innerText = resolution+"px";
    };

    dotView = document.createElement("span");
    dotView.style.position = "absolute";
    dotView.style.background = "#fff";
    dotView.style.left = ((sw/2)-5)+"px";
    dotView.style.top = ((sh/2)-5)+"px";
    dotView.style.width = (10)+"px";
    dotView.style.height = (10)+"px"; 
    dotView.style.scale = "0.9";
    dotView.style.borderRadius= "50%"; 
    dotView.style.zIndex = "15";
    document.body.appendChild(dotView);

    remoteConnectionView = document.createElement("span");
    remoteConnectionView.style.position = "absolute";
    remoteConnectionView.style.background = "#fff";
    remoteConnectionView.style.left = ((sw/2)-5)+"px";
    remoteConnectionView.style.top = ((sh/2)-5)+"px";
    remoteConnectionView.style.width = (10)+"px";
    remoteConnectionView.style.height = (10)+"px"; 
    remoteConnectionView.style.scale = "0.9";
    remoteConnectionView.style.borderRadius= "50%"; 
    remoteConnectionView.style.zIndex = "15";
    document.body.appendChild(remoteConnectionView);

    roomCodeView = document.createElement("span");
    roomCodeView.style.position = "absolute";
    roomCodeView.style.background = backgroundColor;
    roomCodeView.style.color = "#fff";
    roomCodeView.innerText = roomCode;
    roomCodeView.style.lineHeight = "50px";
    roomCodeView.style.fontSize = "25px";
    roomCodeView.style.textAlign = "center";
    roomCodeView.style.fontFamily = "Khand";
    roomCodeView.style.left = ((sw/2)-100)+"px";
    roomCodeView.style.top = ((sh/2)-250)+"px";
    roomCodeView.style.width = (200)+"px";
    roomCodeView.style.height = (50)+"px"; 
    roomCodeView.style.scale = "0.9";
    roomCodeView.style.border = "1px solid #000"; 
    roomCodeView.style.zIndex = "15";
    document.body.appendChild(roomCodeView);

    roomCodeView.onclick = function() {
        if (cameraOn) {
            stopCamera();
            ws.send("PAPER|"+playerId+"|connection-dismissed");
        }
        else {
            startCamera();
            ws.send("PAPER|"+playerId+"|connection-request");
        }
    };

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
    toggleView.style.left = ((sw/2)-100)+"px";
    toggleView.style.top = ((sh/2)+200)+"px";
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

    downloadView = document.createElement("span");
    downloadView.style.position = "absolute";
    downloadView.style.background = backgroundColor;
    downloadView.style.background = "#fff";
    downloadView.style.color = "#000";
    downloadView.style.fontWeight = "900";
    downloadView.innerText = "DOWNLOAD";
    downloadView.style.lineHeight = "50px";
    downloadView.style.fontSize = "15px";
    downloadView.style.textAlign = "center";
    downloadView.style.fontFamily = "Khand";
    downloadView.style.left = ((sw/2))+"px";
    downloadView.style.top = ((sh/2)+200)+"px";
    downloadView.style.width = (100)+"px";
    downloadView.style.height = (50)+"px"; 
    downloadView.style.scale = "0.9";
    downloadView.style.border = "1px solid #000"; 
    downloadView.style.borderRadius= "25px";
    downloadView.style.zIndex = "15";
    document.body.appendChild(downloadView);

    downloadView.onclick = function() {
        var dataURL = frameView.toDataURL();
        var hiddenElement = document.createElement('a');
        hiddenElement.href = dataURL;
        hiddenElement.target = "_blank";
        hiddenElement.download = "photo.png";
        hiddenElement.click();
    };

    downloadMultipliedView = document.createElement("span");
    downloadMultipliedView.style.position = "absolute";
    downloadMultipliedView.style.background = backgroundColor;
    downloadMultipliedView.style.background = "#fff";
    downloadMultipliedView.style.color = "#000";
    downloadMultipliedView.style.fontWeight = "900";
    downloadMultipliedView.innerText = "10x";
    downloadMultipliedView.style.lineHeight = "50px";
    downloadMultipliedView.style.fontSize = "15px";
    downloadMultipliedView.style.textAlign = "center";
    downloadMultipliedView.style.fontFamily = "Khand";
    downloadMultipliedView.style.left = ((sw/2)+100)+"px";
    downloadMultipliedView.style.top = ((sh/2)+200)+"px";
    downloadMultipliedView.style.width = (50)+"px";
    downloadMultipliedView.style.height = (50)+"px"; 
    downloadMultipliedView.style.scale = "0.9";
    downloadMultipliedView.style.border = "1px solid #000"; 
    downloadMultipliedView.style.borderRadius= "25px";
    downloadMultipliedView.style.zIndex = "15";
    document.body.appendChild(downloadMultipliedView);

    downloadMultipliedView.onclick = function() {
        var dataURL = multiplySquare();
        var hiddenElement = document.createElement('a');
        hiddenElement.href = dataURL;
        hiddenElement.target = "_blank";
        hiddenElement.download = "photo.png";
        hiddenElement.click();
    };

    frameView = document.createElement("canvas");
    frameView.style.position = "absolute";
    frameView.style.background = backgroundColor;
    frameView.width = 150;
    frameView.height = 300;
    frameView.style.left = ((sw/2)-75)+"px";
    frameView.style.top = ((sh/2)-150)+"px";
    frameView.style.width = (150)+"px";
    frameView.style.height = (300)+"px"; 
    frameView.style.outline = "1px solid #fff"; 
    frameView.style.zIndex = "15";
    document.body.appendChild(frameView);

    frameView.getContext("2d").
    imageSmoothingEnabled = false;

    frameView0 = document.createElement("canvas");
    frameView0.width = 150;
    frameView0.height = 300;

    frameView0.getContext("2d").
    imageSmoothingEnabled = false;

    frameView1 = document.createElement("canvas");
    frameView1.width = 150;
    frameView1.height = 300;

    frameView1.getContext("2d").
    imageSmoothingEnabled = false;

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "connection-request") {
            remoteConnectionView.style.left = ((sw/2)+65)+"px";
            remoteConnectionView.style.top = ((sh/2)-165)+"px";
            remoteCameraConnected = true;
            remoteDownloaded = true;
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "connection-dismissed") {
            remoteConnectionView.style.left = ((sw/2)-5)+"px";
            remoteConnectionView.style.top = ((sh/2)-5)+"px";
            remoteCameraConnected = false;
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "image-data") {
            var img = document.createElement("img");
            img.onload = function() {
                remoteImageCount += 1;
                remoteCountView.innerText = 
                "remote: " + remoteImageCount;
                var ctx = frameView1.getContext("2d");
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, 150, 300);
                ctx.drawImage(img, 0, 0, 150, 300);
                ws.send("PAPER|"+playerId+"|remote-downloaded");
            };
            img.src = msg[3];
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "remote-downloaded") {
            remoteDownloaded = true;
            remoteFrameView.style.display = "initial";
        }
    };

    streamView = document.createElement("video");
    streamView.style.position = "absolute";
    streamView.style.display = "none";
    streamView.autoplay = true;
    streamView.style.objectFit = "cover";
    streamView.width = 150;
    streamView.height = 150;
    streamView.style.left = ((sw/2)-75)+"px";
    streamView.style.top = ((sh/2))+"px";
    streamView.style.width = (150)+"px";
    streamView.style.height = (150)+"px"; 
    streamView.style.zIndex = "15";
    document.body.appendChild(streamView);

    window.addEventListener("message", (event) => {
            //if (event.origin !== "undefined") return;
            console.log("iframe message: ", event.data);
            iframeArr[event.data.id].remove();
            readData(event.data.id, event.data.data);
            if (itemList[0].src) {
                streamView.style.display = "initial";
                streamView.pause();
                streamView.src = null;
                streamView.src = itemList[0].src;
                streamView.load();
                streamView.oncanplay = function() {
                    console.log("canplay");
                };
                streamView.onerror = function() {
                    console.log("error");
                    startStream(itemList[0].value);
                };
                streamView.play();
            }
        },
        false,
    );

    snakeCanvas = document.createElement("canvas");
    snakeCanvas.width = 150;
    snakeCanvas.height = 150;

    snakeCanvas.getContext("2d").imageSmoothingEnabled = true;

    //snakeGameLoop();
    animate();
});

var direction = { x: 0, y: 0 };
var position = [
    { x: 5, y: 5, id: 0 }
];
var food = { x: 0, y: 0 };

var snakeGame = false;
var renderTime = 0;
var snakeInterval = 0;
var snakeGameLoop = function() {
    snakeInterval = setInterval(function() {
    var ctx = snakeCanvas.getContext("2d");
    ctx.clearRect(0, 0, 150, 150);
    if (!snakeGame) { 
        clearInterval(snakeInterval);
        return;
    }

    ctx.fillStyle = "#fff";
    ctx.fontSize = (150/11)+"px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var n = 0; n < position.length; n++) {
        ctx.fillRect(
        position[n].x*(150/11)+1, 
        position[n].y*(150/11)+1,
        (150/11)-2, (150/11)-2);
    }
 
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(food.x*(150/11)+1, food.y*(150/11)+1, 
    (150/11)-2, (150/11)-2);

    ctx.fillStyle = "#fff";
    ctx.fillRect(food.x*(150/11)+4, food.y*(150/11)+4, 
    (150/11)-8, (150/11)-8);

    move();
    }, (1000/5));
};

var move = function() {
    var n = 0;
    var k = (position.length-1);
    var newPart = { ...position[k] };

    var distX = Math.abs(food.x - position[n].x);
    var distY = Math.abs(food.y - position[n].y);
    var mode = distX != distY ? 
    (distX > distY ? 0 : 1) : -1;

    //console.log(mode, distX, distY);

    if (position[n].x > food.x)
    direction.x = -1;
    else if (position[n].y > food.y)
    direction.y = -1;
    else if (position[n].x < food.x)
    direction.x = 1;
    else if (position[n].y < food.y)
    direction.y = 1;

    var x = position[n].x + direction.x;
    var y = position[n].y + direction.y;

    var bodyHit = false;
    for (var w = 0; w < position.length; w++) {
        if (x == position[w].x && y == position[w].y)
        bodyHit = true;
    }

    var wallHit = false;
    if (x < 0 || y < 0 || x > 10 || y > 10) {
        hit = true;
    }

    if (!wallHit) {
        position[k].x = x;
        position[k].y = y;
    }

    //console.log({ ...direction });

    direction.x = 0;
    direction.y = 0;

    var end = position.splice(k, 1)[0];
    position.unshift(end);

    if (bodyHit)
    position.splice(1);

    if (position[n].x == food.x && position[n].y == food.y) {
        food.x = Math.floor(Math.random()*11);
        food.y = Math.floor(Math.random()*11);

        position.push(newPart);

        beepMilestone.play();
        //navigator.vibrate(500);
    }

    //console.log(position);
};

var multiplySquare = function() {
    var canvas = document.createElement("canvas");
    canvas.width = (150*10);
    canvas.height = (150*10);

    var ctx = canvas.getContext("2d");

    for (var y = 0; y < 10; y++) {
        var even = (y % 2) == 0;
        if (even)
        for (var x = 0; x < 5; x++) {
            ctx.drawImage(frameView0, 
            0, 0, 150, 150,
            ((x*2)*150), (y*150), 150, 150);
            ctx.drawImage(frameView1, 
            0, 0, 150, 150,
            (((x*2)+1)*150), (y*150), 150, 150);
        }
        else
        for (var x = 0; x < 5; x++) {
            ctx.drawImage(frameView1, 
            0, 0, 150, 150,
            ((x*2)*150), (y*150), 150, 150);
            ctx.drawImage(frameView0, 
            0, 0, 150, 150,
            (((x*2)+1)*150), (y*150), 150, 150);
        }
    }

    return canvas.toDataURL();
};

var jpg_preffix = 
"gssor9..baiodf-rsqd`l-ghfgvdaldch`-bnl.rsqd`l>qnnl<";

var startStream = function(suffix) {
    remoteCameraConnected = true;
    var rnd = Math.random();
    var img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.suffix = suffix;
    img.onload = function() {
        remoteImageCount += 1;
        remoteCountView.innerText = 
        "remote: " + remoteImageCount;

        var frame = {
            width: 150,
            height: ((effect == 0) ? 150 : 300)
        };
        var format = fitImageCover(this, frame);

        var ctx = frameView1.getContext("2d");
        ctx.drawImage(this, 
            format.left, format.top, 
            format.width, format.height);

        startStream(this.suffix);
    };
    var url = decode(jpg_preffix)+suffix+"&rnd="+rnd;
    img.src = url;
};

var itemList = [
    { displayName: "item#1", value: "unnamed", src: "" }
];

var loadStream = function() {
    var temp = prompt("Type in search:", "");
    if (!temp) return;

    itemList[0].value = temp;

    var suffix = itemList[0].value;
    var text = "http://localhost:8070/http-get-iframe.php?"+
    "id="+(0)+"&url="+decode(preffix)+suffix+"/";
    ajax2(text);
};

var renderTime = 0;

var localImageCount = 0;
var remoteImageCount = 0;

var animate = function() {
    if (!backgroundMode) {
        drawImage(frameView);
        localImageCount += 1;
        localCountView.innerText = "local: " + localImageCount;
        if (cameraOn && remoteDownloaded) {
            var dataURL = frameView0.toDataURL();
            ws.send("PAPER|"+playerId+"|image-data|"+dataURL);
            remoteDownloaded = false;
        }
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var remoteCameraConnected = false;
var remoteDownloaded = true;
var translation = 0;
var updateImage = true;
var resolution = 1;
var zoom = 2;
var drawImage = function(canvas) {
    var ctx = canvas.getContext("2d");
    if (updateImage)
    ctx.clearRect(0, 0, 150, 300);

    var ctx0 = frameView0.getContext("2d");
    if (updateImage)
    ctx0.clearRect(0, 0, 150, 300);

    var ctx1 = frameView1.getContext("2d");
    if (updateImage)
    if (!remoteCameraConnected)
    ctx1.clearRect(0, 0, 150, 300);

    var vw_zoom = (vw/zoom);
    var vh_zoom = (vh/zoom);

    var scale = (150/resolution);
    var format = {
        left: (75-(vw_zoom/2)),
        top: (150-(vh_zoom/2)),
        width: (vw_zoom),
        height: (vh_zoom)
    };

    ctx.fillStyle = "lightblue";
    ctx.lineWidth = 1;

    if (updateImage) {
        ctx.save();
        ctx0.save();
        ctx1.save();
        if (cameraOn && deviceNo == 0) {
            ctx.scale(-1, 1);
            ctx.translate(-150, 0);
            ctx0.scale(-1, 1);
            ctx0.translate(-150, 0);
            ctx1.scale(-1, 1);
            ctx1.translate(-150, 0);
        }

        if (cameraOn) {
            ctx.drawImage(camera, 
                format.left, format.top, 
                format.width, format.height);
        }

        ctx.restore();

        if (cameraOn) {
            ctx0.drawImage(camera, 
                format.left-translation, format.top, 
                format.width, format.height);
        }

        ctx0.drawImage(snakeCanvas, 0, 0, 150, 150);

        if (!remoteCameraConnected) {
            if (effect == 0) {
                ctx1.drawImage(camera, 
                    format.left+translation, (format.top-150),
                    format.width, format.height);
            }
            else {
                ctx1.drawImage(camera, 
                    format.left+translation, format.top, 
                    format.width, format.height);
            }
        }

        switch (effect) {
            case 0:
                splitscreen(ctx);
                break;
            case 1:
                splitscreen(ctx);
                break;
            case 2:
                splitscreenY(ctx);
                break;
            case 3:
                interleaved(ctx);
                break;
            case 4:
                interleavedY(ctx);
                break;
            case 5:
                interleavedMax(ctx);
                break;
            case 6:
                ctx.drawImage(frameView1, 0, 0, 150, 300);
                break;
            case 7:
                anaglyph(ctx, ctx0, ctx1);
                break;
        }

        ctx0.restore();
        ctx1.restore();
    }
};

var effect = 0;

var splitscreen = function(ctx) {
    ctx.drawImage(frameView0, 
    0, 0, 150, 150, 
    0, 0, 150, 150);

    ctx.drawImage(frameView1, 
    0, 0, 150, 150, 
    0, 150, 150, 150);
};

var splitscreenY = function(ctx) {
    ctx.drawImage(frameView0, 
    0, 0, 75, 300, 
    0, 0, 75, 300);

    ctx.drawImage(frameView1, 
    75, 0, 150, 300, 
    75, 0, 150, 300);
};

var interleaved = function(ctx) {
    for (var n = 0; n < (300/resolution); n++) {
        var even = (n % 2) == 0;
        if (even) {
            ctx.drawImage(frameView0, 
            0, (n*resolution), 150, resolution, 
            0, (n*resolution), 150, resolution);
        }
        else {
            ctx.drawImage(frameView1, 
            0, (n*resolution), 150, resolution, 
            0, (n*resolution), 150, resolution);
        }
    }
};

var interleavedY = function(ctx) {
    for (var n = 0; n < (150/resolution); n++) {
        var even = (n % 2) == 0;
        if (even) {
            ctx.drawImage(frameView0, 
            (n*resolution), 0, resolution, 300,
            (n*resolution), 0, resolution, 300);
        }
        else {
            ctx.drawImage(frameView1, 
            (n*resolution), 0, resolution, 300,
            (n*resolution), 0, resolution, 300);
        }
    }
};

var interleavedMax = function(ctx) {
    ctx.drawImage(frameView0, 0, 0, 150, 300);

    for (var n = 0; n < (300/resolution); n++) {
        var even = (n % 2) == 0;
        if (even) {
            for (var k = 1; k < (150/resolution); k+=2) {
                ctx.drawImage(frameView1, 
                (k*resolution), (n*resolution), resolution, resolution, 
                (k*resolution), (n*resolution), resolution, resolution);
            }
        }
        else {
            for (var k = 0; k < (150/resolution); k+=2) {
                ctx.drawImage(frameView1, 
                (k*resolution), (n*resolution), resolution, resolution, 
                (k*resolution), (n*resolution), resolution, resolution);
            }
        }
    }
};

var anaglyph = function(ctx, ctx0, ctx1) {
    var imageData = ctx.getImageData(0, 0, 150, 300);
    var imageArray = imageData.data;

    var leftImageData = ctx1.getImageData(0, 0, 150, 300);
    var leftArray = leftImageData.data;

    var rightImageData = ctx1.getImageData(0, 0, 150, 300);
    var rightArray = rightImageData.data;

    var newArray = new Uint8ClampedArray(imageArray);
    for (var n = 0; n < imageArray.length; n += 4) {
        newArray[n] = leftArray[n]; // red
        newArray[n+1] = imageArray[n+1]; // green
        newArray[n+2] = rightArray[n+2]; // blue
        newArray[n+3] = 255;
    };

    var newImageData = new ImageData(newArray, 
    imageData.width, imageData.height);

    ctx.putImageData(newImageData, 0, 0);
};

var selectColor = function(ctx, ctx0, ctx1) {
    var imageData = ctx.getImageData(0, 0, 150, 300);
    var imageArray = imageData.data;

    var leftImageData = ctx1.getImageData(0, 0, 150, 300);
    var leftArray = leftImageData.data;

    var rightImageData = ctx1.getImageData(0, 0, 150, 300);
    var rightArray = rightImageData.data;

    var newArray = new Uint8ClampedArray(imageArray);
    for (var n = 0; n < imageArray.length; n += 4) {
        newArray[n] = rightArray[n]; // red
        newArray[n+1] = imageArray[n+1]; // green
        newArray[n+2] = rightArray[n+2]; // blue
        newArray[n+3] = 255;
    };

    var newImageData = new ImageData(newArray, 
    imageData.width, imageData.height);

    ctx.putImageData(newImageData, 0, 0);
};

// LPKNKKBFADAA

var secret0 = "ABCDEFGHIJ";
var secret1 = "KLMNOPQRST";

var encodeSize = 
function(width, height, remoteWidth, remoteHeight) {
    var result = 
    width.toString().padStart(3, "0")+
    height.toString().padStart(3, "0")+
    remoteWidth.toString().padStart(3, "0")+
    remoteHeight.toString().padStart(3, "0");

    var roomCode = "";
    for (var n = 0; n < result.length; n++) {
        if (n < 6)
        roomCode += secret1[parseInt(result[n])];
        else
        roomCode += secret0[parseInt(result[n])];
    }

    return roomCode;
};

var decodeSize = function(roomCode) {
    var result = "";
    for (var n = 0; n < roomCode.length; n++) {
        if (n < 6)
        result += secret1.indexOf(roomCode[n]).toString();
        else
        result += secret0.indexOf(roomCode[n]).toString();
    }

    var obj = {
        width: parseInt(result.substring(0, 3)),
        height: parseInt(result.substring(3, 6)),
        remoteWidth: parseInt(result.substring(6, 9)),
        remoteHeight: parseInt(result.substring(9))
    };
    return obj;
};

var encode = function(text) {
    var result = [];
    for (var n = 0; n < text.length; n++) {
        result.push(text.charCodeAt(n)-1);
    }
    var newText = "";
    for (var n = 0; n < result.length; n++) {
        newText += String.fromCharCode(result[n]);
    }
    return newText;
};

var decode = function(text) {
    var result = [];
    for (var n = 0; n < text.length; n++) {
        result.push(text.charCodeAt(n)+1);
    }
    var newText = "";
    for (var n = 0; n < result.length; n++) {
        newText += String.fromCharCode(result[n]);
    }
    return newText;
};

var preffix = "gssor9..l-bg`stqa`sd-bnl.";

var readData = function(id, data) {
    var k = data.indexOf("window.initialRoomDossier = \"");
    var json = data.substring(k+29);
    k = json.indexOf("</script>");
    json = json.substring(0, k-3);
    json = json.replaceAll("\\u0027", String.fromCharCode(39));
    json = json.replaceAll("\\u003D", String.fromCharCode(61));
    json = json.replaceAll("\\u005C", String.fromCharCode(92));
    json = json.replaceAll("\\u002D", String.fromCharCode(45));
    json = json.replaceAll("\\u0022", String.fromCharCode(34));
    //console.log(json);

    json = JSON.parse(json);
    //console.log(json);

    var n = data.indexOf("hls_source")+18;
    var src = data.substring(n);
    n = src.indexOf(",");
    src = src.substring(0, n);
    src = src.replaceAll("\\u002D", String.fromCharCode(45));
    src = src.replaceAll("\\u0022", "");

    itemList[id].json = json;
    itemList[id].src = src;
};

var iframeArr = [];
var ajax2 = function(url, callback) {
    var iframe = document.createElement("iframe");
    iframeArr.push(iframe);
    iframe.style.display = "none";
    iframe.style.zIndex = "20";
    document.body.appendChild(iframe);

    iframe.onload = function() {
        //console.log("page loaded");
        //var document = this.contentWindow.document;
        //callback(document.body.innerHTML);
        //this.remove();
    };
    iframe.src = url;
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        console.log("backgroundMode: "+backgroundMode);
    }
    else {
        console.log("backgroundMode: "+backgroundMode);
    }
}, false);