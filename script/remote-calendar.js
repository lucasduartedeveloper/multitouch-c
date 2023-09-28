var inflatingSfx = new Audio("audio/balloon-inflating.wav");
var releasingSfx = new Audio("audio/balloon-inflating.wav");

var roboticSfx = new Audio("audio/robotic-sfx.wav");
var bouncySfx = new Audio("audio/bouncy-sfx.wav");

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
            offset = Math.floor(moveX-(sw/2));
            if (effect < 7) {
                translation = offset < -75 ? -75 : offset;
                translation = offset > 75 ? 75 : offset;
                zoomOffset = 
                parseFloat(((0.5/75)*Math.abs(offset).toFixed(1)));
                zoom = (3-zoomOffset);
            }

            if (moveX > (sw/2)) {
                recoilOffset = 
                parseFloat((2/75)*Math.abs(offset).toFixed(1));
                recoil = (3-recoilOffset);
            }
            else {
                recoilOffset = 
                parseFloat((2/75)*Math.abs(offset).toFixed(1));
                recoil2 = (3-recoilOffset);
            }

            _recoilOffset = recoil;

            fillArray();
            drawCurve();
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

    cameraTrackingView = document.createElement("span");
    cameraTrackingView.style.position = "absolute";
    cameraTrackingView.style.background = backgroundColor;
    cameraTrackingView.style.color = "#fff";
    cameraTrackingView.style.fontWeight = "900";
    cameraTrackingView.innerText = "select";
    cameraTrackingView.style.lineHeight = "25px";
    cameraTrackingView.style.fontSize = "15px";
    cameraTrackingView.style.textAlign = "center";
    cameraTrackingView.style.fontFamily = "Khand";
    cameraTrackingView.style.left = ((sw/2)-50)+"px";
    cameraTrackingView.style.top = ((sh/2)-200)+"px";
    cameraTrackingView.style.width = (100)+"px";
    cameraTrackingView.style.height = (25)+"px"; 
    cameraTrackingView.style.scale = "0.9";
    cameraTrackingView.style.border = "1px solid #000"; 
    cameraTrackingView.style.zIndex = "15";
    document.body.appendChild(cameraTrackingView);

    cameraTrackingView.onclick = function() {
        cameraTracking = !cameraTracking;
        if (cameraTracking) {
            cameraTrackingView.innerText = "tracking";
        }
        else {
            cameraTrackingView.innerText = "select";
        }
    };

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

    toggleUpView = document.createElement("i");
    toggleUpView.style.position = "absolute";
    toggleUpView.style.background = "#fff";
    toggleUpView.style.color = "#000";
    toggleUpView.className = "fa-solid fa-arrow-up-long";
    toggleUpView.style.lineHeight = "100px";
    toggleUpView.style.fontSize = "15px";
    toggleUpView.style.textAlign = "center";
    toggleUpView.style.left = ((sw/2)-25)+"px";
    toggleUpView.style.top = ((sh/2)-50)+"px";
    toggleUpView.style.width = (50)+"px";
    toggleUpView.style.height = (100)+"px"; 
    toggleUpView.style.scale = "0.9";
    toggleUpView.style.border = "1px solid #000"; 
    //toggleUpView.style.borderRadius= "25px";
    toggleUpView.style.zIndex = "20";
    document.body.appendChild(toggleUpView);

    toggleUpView.onclick = function() {
        frameView.style.display = "initial";
        frameView.className = 
        "animate__animated animate__slideInUp";
        //frameView.style.animationSpeed = 0.3;
        toggleUpView.style.display = "none";
        roboticSfx.play();
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

    toggleSpaceView = document.createElement("i");
    toggleSpaceView.style.position = "absolute";
    toggleSpaceView.style.background = "#fff";
    toggleSpaceView.style.color = "#000";
    toggleSpaceView.className = "fa-solid fa-gamepad";
    toggleSpaceView.style.lineHeight = "50px";
    toggleSpaceView.style.fontSize = "15px";
    toggleSpaceView.style.textAlign = "center";
    toggleSpaceView.style.left = ((sw/2)+100)+"px";
    toggleSpaceView.style.top = ((sh/2)-200)+"px";
    toggleSpaceView.style.width = (50)+"px";
    toggleSpaceView.style.height = (50)+"px"; 
    toggleSpaceView.style.scale = "0.9";
    toggleSpaceView.style.border = "1px solid #000"; 
    toggleSpaceView.style.borderRadius= "25px";
    toggleSpaceView.style.zIndex = "15";
    document.body.appendChild(toggleSpaceView);

    toggleSpaceView.onclick = function() {
        spaceGame = !spaceGame;
        cameraOn = spaceGame;
        if (spaceGame)
        spaceGameLoop();
    };

    toggleRotationView = document.createElement("i");
    toggleRotationView.style.position = "absolute";
    toggleRotationView.style.background = "#fff";
    toggleRotationView.style.color = "#000";
    toggleRotationView.className = "fa-solid fa-gamepad";
    toggleRotationView.style.lineHeight = "50px";
    toggleRotationView.style.fontSize = "15px";
    toggleRotationView.style.textAlign = "center";
    toggleRotationView.style.left = ((sw/2)+100)+"px";
    toggleRotationView.style.top = ((sh/2)-150)+"px";
    toggleRotationView.style.width = (50)+"px";
    toggleRotationView.style.height = (50)+"px"; 
    toggleRotationView.style.scale = "0.9";
    toggleRotationView.style.border = "1px solid #000"; 
    toggleRotationView.style.borderRadius= "25px";
    toggleRotationView.style.zIndex = "15";
    document.body.appendChild(toggleRotationView);

    toggleRotationView.onclick = function() {
        rotationGame = !rotationGame;
        if (rotationGame)
        rotationGameLoop();
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
    "striped both", "remote", "pinch-out", "3D" ];

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
        var limit = remoteCameraConnected ? 7 : 8;
        effect = (effect+1) <= limit ? (effect+1) : 0;
        effectView.innerText = effectList[effect];

        if (effect == 7) 
        snakeColor = "#555";
        else 
        snakeColor = "#fff";
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
    frameView.style.display = "none";
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
                    streamEnabled = true;
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

    spaceCanvas = document.createElement("canvas");
    spaceCanvas.width = 150;
    spaceCanvas.height = 150;

    frameView.onclick = function(e) {
        if (spaceGame) {
            var n = Math.floor((e.clientX-((sw/2)-75))/(150/3));
            select(n);
        }
        else if (manual && snakeGame) {
            var x = e.clientX - ((sw/2)-75);
            var y = e.clientY - ((sh/2)-150);
            var v = {
                x: x-75,
                y: y-225
            };
            console.log(v);
            if (Math.abs(v.x) > Math.abs(v.y)) {
                direction.x = v.x < 0 ? -1 : 1;
                direction.y = 0;
            }
            else {
                direction.x = 0;
                direction.y = v.y < 0 ? -1 : 1;
            }
        }
        else if (canFocus && effect == 7) {
            var offset = 75-((75/300)*(e.clientY - ((sh/2)-150)));
            var focusTotal = focusMax - focusMin;
            var newFocus = 
            parseFloat(
            (Math.abs(((1/75)*offset))*focusTotal).toFixed(1));
            newFocus = newFocus < focusMin ? 
            focusMin : newFocus;
            newFocus = newFocus > focusMax ?
            focusMax : newFocus;
            setFocus(newFocus);
        }
    };

    var pushing = false;
    var pushInterval = 0;
    frameView.ontouchstart = function(e) {
        pushing = (recoil > 0);
        if (!pushing) 
        inflatingSfx.play();
        else
        releasingSfx.play();
        pushInterval = setInterval(function() {
            if (pushing)
            recoil = (recoil-(1/10)) > -1 ? (recoil-(1/10)) : -1;
            else if (!pushing)
            recoil = (recoil+(1/10)) < 1 ? (recoil+(1/10)) : 1;

            fillArray();
            drawCurve();

            if (recoil == -1 || recoil == 1)
            clearInterval(pushInterval);
        }, (1000/30));
    };

    spaceCanvas.getContext("2d").imageSmoothingEnabled = true;

    motion = false;
    gyroUpdated = function(gyro) {
        var co = gyro.accX;
        var ca = gyro.accY;
        var a = _angle2d(co, ca);
        var deg = (180/Math.PI)*a;
        direction.x = Math.abs(gyro.accX) > 5 ? 
        (gyro.accX < -5 ? -1 : 
        (gyro.accX > 5 ? 1 : 0)) : 0;
        direction.y = Math.abs(gyro.accY) > 5 ? 
        (gyro.accY < -5 ? 1 : 
        (gyro.accY > 5 ? -1 : 0)) : 0;

        recoil = -((3/9.8)*gyro.accZ);
        fillArray();
        drawCurve();
    };

    waveView = document.createElement("canvas");
    waveView.style.position = "absolute";
    waveView.style.display = "none";
    waveView.width = sw;
    waveView.height = 50;
    waveView.style.left = ((sw/2)-(sw/2))+"px";
    waveView.style.top = ((sh/2)+150)+"px";
    waveView.style.width = (sw)+"px";
    waveView.style.height = (50)+"px"; 
    waveView.style.zIndex = "15";
    document.body.appendChild(waveView);

    var startTime = new Date().getTime();
    mic = new EasyMicrophone();
    mic.onsuccess = function() { };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        var value = parseFloat(avgValue.toFixed(2));
        recoil = _recoilOffset+((value-0.5)*3);
        fillArray();
        drawCurve();
        console.log(value, freqArray.length);
        var resumedWave = resumeWave(freqArray);
        drawAB(resumedWave, avgValue);
    };
    mic.onclose = function() { };
    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    drawAB(ab);

    curveView = document.createElement("canvas");
    curveView.style.position = "absolute";
    curveView.style.display = "initial";
    curveView.width = 150;
    curveView.height = 450;
    curveView.style.left = ((sw/2)-150)+"px";
    curveView.style.top = ((sh/2)-75)+"px";
    curveView.style.width = (75)+"px";
    curveView.style.height = (225)+"px"; 
    curveView.style.outline = "1px solid #fff"; 
    curveView.style.zIndex = "15";
    document.body.appendChild(curveView);

    curveView.onclick = function(e) {
        var clientY = e.clientY - ((sh/2)-75);
        //console.log(clientY);
        if (clientY < 75)
        recoil2Enabled = !recoil2Enabled;
        else if (clientY < 150)
        recoilEnabled = !recoilEnabled;
        else if (clientY < 225)
        double = !double;
        drawCurve();
    };

    camera.oncanplay = function() {
        if (cameraTracking) {
            beepMilestone.play();
            if (canFocus) {
                setFocus(focusMax);
            };

            setTimeout(function() {
                stopCamera();
                deviceNo = (deviceNo+1) < 2 ? (deviceNo+1) : 0;

                camera.style.transform = (deviceNo == 0) ? 
                "rotateY(-180deg)" : "initial";
                deviceView.innerText = deviceList[deviceNo];

                startCamera();
            }, 5000);
        }
    };

    fillArray();
    drawCurve();
    //snakeGameLoop();
    animate();
});

var cameraTracking = false;

var drawCurve = function() {
    var canvas = curveView;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 150, 450);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";

    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(150, 150);
    ctx.stroke();

    ctx.beginPath();
    if (double)
    ctx.moveTo(112.5+(curveArr2[0].x*37.5), 
    300+(curveArr2[0].y*37.5));
    else
    ctx.moveTo(curveArr2[0].x*75, 150+(curveArr2[0].y*75));
    for (var n = 0; n < curveArr2.length; n++) {
        if (double)
        ctx.lineTo(112.5+(curveArr2[n].x*37.5), 
        300+(curveArr2[n].y*37.5));
        else
        ctx.lineTo(75+(curveArr2[n].x*75), 150+(curveArr2[n].y*75));
        //console.log(curveArr[n].x*75, curveArr[n].y*75);
    };

    ctx.fillStyle = "#fff";
    ctx.font = "25px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (recoil2 > 0)
    ctx.fillText(recoil2.toFixed(2), 75, 125);
    else if (recoil2 < 0)
    ctx.fillText(recoil2.toFixed(2), 75, 175);

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(150, 300);
    ctx.stroke();

    ctx.beginPath();
    if (double)
    ctx.moveTo(curveArr[0].x*37.5, 300+(curveArr[0].y*37.5));
    else
    ctx.moveTo(curveArr[0].x*75, 150+(curveArr[0].y*75));
    for (var n = 0; n < curveArr.length; n++) {
        if (double)
        ctx.lineTo(37.5+(curveArr[n].x*37.5), 
        300+(curveArr[n].y*37.5));
        else
        ctx.lineTo(75+(curveArr[n].x*75), 300+(curveArr[n].y*75));
        //console.log(curveArr[n].x*75, curveArr[n].y*75);
    };

    ctx.fillStyle = "#fff";
    ctx.font = "25px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (recoil > 0)
    ctx.fillText(recoil.toFixed(2), 75, 275);
    else if (recoil < 0)
    ctx.fillText(recoil.toFixed(2), 75, 325);

    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "75px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (!recoil2Enabled)
    ctx.fillText("×", 75, 75);

    ctx.fillStyle = "#fff";
    ctx.font = "75px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (!recoilEnabled)
    ctx.fillText("×", 75, 225);
};

var resumeWave = function(freqArray) {
    var blocks = 50;
    var blockSize = Math.floor(freqArray.length / blocks);

    var resumedArray = [];
    var sum = 0;
    for (var n = 0; n < blocks; n++) {
        sum = 0;
        for (var k = 0; k < blockSize; k++) {
            var m = (n * blockSize) + k;
             if ((m+1) <= freqArray.length) {
                 sum += freqArray[m];
             }
        }

        resumedArray.push(sum/blockSize);
    }
    //console.log(blockSize);
    //console.log(resumedArray);

    return resumedArray;
};

var drawAB = 
function(freqArray=false, avgValue=0) {
    var canvas = waveView;
    var ctx = canvas.getContext("2d");

    var offset = 0;
    var polygon = [];

    // create waveform A
    if (freqArray) 
    offset = (canvas.width/freqArray.length)/2;
    if (freqArray) 
    for (var n = 0; n < freqArray.length; n++) {
        var obj = {
            x: offset+(n*(canvas.width/freqArray.length)),
            y0: (25)+
            (-freqArray[n]*25),
            y1: (25)+
            (freqArray[n]*25)
        };
        polygon.push(obj);
    }

    // draw waveform A
    ctx.strokeStyle = "#fff";

    if (freqArray) {
        ctx.lineWidth = (canvas.width/freqArray.length)-2;
        ctx.clearRect(0, 0, canvas.width, 100);
    }
    if (freqArray)
    for (var n = 0; n < polygon.length; n++) {
        ctx.beginPath();
        ctx.moveTo(polygon[n].x, polygon[n].y0-1);
        ctx.lineTo(polygon[n].x, polygon[n].y1+1);
        ctx.stroke();
    }
};

var portalA = { x: 2, y: 2 };
var portalB = { x: 12, y: 12 };

var direction = { x: 0, y: 0 };
var position = [
    { x: 5, y: 5, id: 0 }
];
var food = { x: 0, y: 0 };

var snakeColor = "#fff";
var manual = false;
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

    if (!streamEnabled && deviceOpen)
    snakeColor = getColor();

    ctx.save();
    if (deviceNo == 0) {
        ctx.scale(-1, 1);
        ctx.translate(-150, 0);
    }

    ctx.fillStyle = snakeColor;
    ctx.fontSize = (150/15)+"px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var n = 0; n < position.length; n++) {
        ctx.fillRect(
        position[n].x*(150/15)+1, 
        position[n].y*(150/15)+1,
        (150/15)-2, (150/15)-2);
    }
 
    ctx.strokeStyle = snakeColor;
    ctx.strokeRect(food.x*(150/15)+1, food.y*(150/15)+1, 
    (150/15)-2, (150/15)-2);

    ctx.fillStyle = snakeColor;
    ctx.fillRect(food.x*(150/15)+4, food.y*(150/15)+4, 
    (150/15)-8, (150/15)-8);

    ctx.strokeStyle = snakeColor;;
    ctx.strokeRect(portalA.x*(150/15)+1, portalA.y*(150/15)+1, 
    (150/15)-2, (150/15)-2);

    ctx.strokeStyle = snakeColor;
    ctx.strokeRect(portalB.x*(150/15)+1, portalB.y*(150/15)+1, 
    (150/15)-2, (150/15)-2);

    move();
    ctx.restore();
    }, (1000/5));
};

var mode = 0;
var move = function() {
    var n = 0;
    var k = (position.length-1);
    var newPart = { ...position[k] };

    var distX = Math.abs(food.x - position[n].x);
    var distY = Math.abs(food.y - position[n].y);

    mode = mode == 0 && distX == 0 ? 1 : mode;
    mode = mode == 1 && distY == 0 ? 0 : mode;

    //console.log(mode, distX, distY);

    if (!manual)
    if (mode == 0 && position[n].x > food.x)
    direction.x = -1;
    else if (mode == 1 && position[n].y > food.y)
    direction.y = -1;
    else if (mode == 0 && position[n].x < food.x)
    direction.x = 1;
    else if (mode == 1 && position[n].y < food.y)
    direction.y = 1;

    var x = position[n].x + direction.x;
    var y = position[n].y + direction.y;

    var bodyHit = false;
    for (var w = 0; w < position.length; w++) {
        if (x == position[w].x && y == position[w].y)
        bodyHit = true;
    }

    var wallHit = false;
    if (x < 0 || y < 0 || x > 14 || y > 14) {
        wallHit = true;
    }

    if (!wallHit) {
        position[k].x = x;
        position[k].y = y;
    }

    //console.log({ ...direction });

    if (!manual) {
        direction.x = 0;
        direction.y = 0;
    }

    var end = position.splice(k, 1)[0];
    position.unshift(end);

    if (position[n].x == food.x && position[n].y == food.y) {
        food.x = Math.floor(Math.random()*15);
        food.y = Math.floor(Math.random()*15);

        position.push(newPart);

        beepMilestone.play();
        //navigator.vibrate(500);
    }

    for (var w = 0; w < position.length; w++) {
        if (position[w].x == portalA.x && position[w].y == portalA.y) {
            position[w].x = portalB.x;
            position[w].y = portalB.y;
            //mode = mode == 0 ? 1 : 0;
        }
        else if (position[w].x == portalB.x && 
        position[w].y == portalB.y) {
            position[w].x = portalA.x;
            position[w].y = portalA.y;
            //mode = mode == 0 ? 1 : 0;
        }
    }

    if (bodyHit)
    position.splice(1);

    //console.log(position);
};

var spaceColor = "orange";
var spaceGame = false;
var count = 0;
var spaceInterval = 0;
var spaceGameLoop = function() {
    spaceInterval = setInterval(function() {
    var ctx = spaceCanvas.getContext("2d");
    ctx.clearRect(0, 0, 150, 150);
    if (!spaceGame) { 
        clearInterval(spaceInterval);
        return;
    }

    spaceColor = getColor();

    ctx.save();
    if (deviceNo == 0) {
        ctx.scale(-1, 1);
        ctx.translate(-150, 0);
    }

    ctx.strokeStyle = "#000";
    ctx.fillStyle = (count == 0 ? spaceColor : "#fff");
    ctx.beginPath();
    ctx.arc((150/4), (150/2), 10, 0, (Math.PI*2));
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.fillStyle = (count == 1 ? spaceColor : "#fff");
    ctx.beginPath();
    ctx.arc(((150/4)*2), (150/2), 10, 0, (Math.PI*2));
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.fillStyle = (count == 2 ? spaceColor : "#fff");
    ctx.beginPath();
    ctx.arc(((150/4)*3), (150/2), 10, 0, (Math.PI*2));
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    }, (1000/5));
};

var rotationGame = false;
var rotationDirection = 0;
var rotationInterval = 0;
var rotation = 0;
var rotationGameLoop = function() {
    rotationDirection = rotationDirection == 0 ? 1 : 0;
    toggleRotationView.className = 
    rotationDirection ? 
    "fa-solid fa-rotate-left" : 
    "fa-solid fa-rotate-right";
    rotationInterval = setInterval(function() {
        if (!rotationGame) { 
            clearInterval(rotationInterval);
            return;
        }
        rotation += rotationDirection == 0 ? 1 : -1;
        rotation = rotation > 360 ? 0 : rotation;
        rotation = rotation < 0 ? 360 : rotation;
    }, (1000/30));
};

var select = function(n) {
    var list = [ 0, 1, 2 ];
    list.splice(count, 1);
    if (n == count)
    count = list[Math.floor(Math.random()*2)];
};

var getColor = function(canvas=false) {
    if (!canvas) {
        var canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.height = 300;
    }

    var returning = canvas || deviceOpen;
    var ctx = canvas.getContext("2d");
    if (deviceOpen) {
        ctx.save();
        if (deviceNo == 0) {
            ctx.scale(-1, 1);
            ctx.translate(-150, 0);
        }
        ctx.drawImage(camera, -(vw-150), 0, vw, vh);
        ctx.restore();
    }

    var imageData = ctx.getImageData(0, 0, 150, 300);
    var imageArray = imageData.data;

    var result = "rgba("+
    imageArray[0]+", "+
    imageArray[1]+", "+
    imageArray[2]+", "+
    "1)";

    return returning ? result : "#fff";
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

var streamEnabled = false;
var streamColor = "#000";
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

        var canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.width = 300;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 
            -(this.width-150), 0, 150, 300);

        streamColor = getColor(canvas);

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

     //ctx.globalCompositeOperation = "source-in";
     ctx.lineWidth = 1;
     ctx.strokeStyle = "#fff";
     ctx.fillStyle = "lightblue";

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

        ctx0.translate(75, 150);
        ctx0.rotate(rotation*(Math.PI/180));
        ctx0.translate(-75, -150);

        ctx1.translate(75, 150);
        ctx1.rotate(rotation*(Math.PI/180));
        ctx1.translate(-75, -150);

        ctx.font = "75px sans serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillRect(10, 145, 130, 10);
        //ctx.fillText("A", 75, 150);

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

        if (!cameraOn && !streamEnabled && gridEnabled) {
            drawGrid(ctx0);
            drawGrid(ctx1);
        }

        if (snakeGame) {
            if (effect < 7)
            ctx0.drawImage(snakeCanvas, 0, 0, 150, 150);
            else {
                drawGrid(ctx1);
                ctx1.drawImage(snakeCanvas, 0, 75, 150, 150);
            }
        }
        else if (spaceGame)
        ctx0.drawImage(spaceCanvas, 0, 0, 150, 150);

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
                setShape(ctx);
                break;
            case 8:
                anaglyph(ctx, ctx0, ctx1);
                break;
        }

        ctx0.restore();
        ctx1.restore();
    }
};

var gridEnabled = true;
var drawGrid = function(ctx) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "lightblue";
    ctx.fillStyle = "#fff";

    ctx.fillRect(0, 0, 150, 300);

    for (var n = 0; n < 31; n++) {
        ctx.beginPath();
        ctx.moveTo(0, (n*(150/15))+(150/30));
        ctx.lineTo(150, (n*(150/15))+(150/30));
        ctx.stroke();
    }

    for (var n = 0; n < 16; n++) {
        ctx.beginPath();
        ctx.moveTo((n*(300/30)), 0);
        ctx.lineTo((n*(300/30)), 300);
        ctx.stroke();
    }

    ctx.fillStyle = "#000";
    ctx.fontWeight = "900";
    ctx.font = (150/20)+"px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var text = "";
    var offset = Math.floor(text.length/2);
    for (var n = 0; n < text.length; n ++) {
        var x = (((7-offset)+n)*(150/15))+(150/30);
        var y = (15*(150/15));
        ctx.fillText(text[n], x, y);
        //console.log(x, y);
    }

    ctx.beginPath();
    ctx.arc(7*(150/15)+(150/30), 15*(150/15), (150/60), 0,
    (Math.PI*2));
    ctx.fill();

    //ctx.fillText(text, 75, 150);
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

var recoilEnabled = true;
var recoil2Enabled = true;

var scaleArr = [];
var curveArr = [];
var scaleArr2 = [];
var curveArr2 = [];

var fillArray = function() {
    scaleArr = [];
    curveArr = [];
    for (var n = 0; n < 70; n++) {
        var c = { x: 0, y: 0 };
        var p = { x: -1, y: 0 };
        var rp = _rotate2d(c, p, -(n*(90/70)));
        rp.y = (rp.y * recoil);
        var cp = _rotate2d(c, p, -(n*(180/70)));
        cp.y = (cp.y * recoil);
        //console.log(rp);
        var value = recoil > 0 ? 
        1+(Math.abs(rp.y)) : 
        1-(Math.abs(rp.y));
        scaleArr.push(value);
        curveArr.push(cp);
    }

    scaleArr2 = [];
    curveArr2 = [];
    for (var n = 0; n < 70; n++) {
        var c = { x: 0, y: 0 };
        var p = { x: -1, y: 0 };
        var rp = _rotate2d(c, p, -(n*(90/70)));
        rp.y = (rp.y * recoil2);
        var cp = _rotate2d(c, p, -(n*(180/70)));
        cp.y = (cp.y * recoil2);
        //console.log(rp);
        var value = recoil2 > 0 ? 
        1+(Math.abs(rp.y)) : 
        1-(Math.abs(rp.y));
        scaleArr2.push(value);
        curveArr2.push(cp);
    }
};

var double = false;
var _recoilOffset = 0;
var recoil = 1;
var recoil2 = 1;
var setShape = function(ctx, ctx0, ctx1) {
    var canvas = document.createElement("canvas");
    canvas.width = 150;
    canvas.height = 150;

    var centerCtx = canvas.getContext("2d");
    centerCtx.imageSmoothingEnabled = false;

    if (deviceNo == 0 && snakeGame) {
        centerCtx.save();
        centerCtx.scale(-1, 1);
        centerCtx.translate(-150, 0);
    }

    var canvas2 = document.createElement("canvas");
    canvas2.width = 150;
    canvas2.height = 150;

    var centerCtx2 = canvas2.getContext("2d");
    centerCtx2.imageSmoothingEnabled = false;

    if (deviceNo == 0 && snakeGame) {
        centerCtx2.save();
        centerCtx2.scale(-1, 1);
        centerCtx2.translate(-150, 0);
    }

    var canvas3 = document.createElement("canvas");
    canvas3.width = 150;
    canvas3.height = 150;

    var centerCtx3 = canvas3.getContext("2d");
    centerCtx3.imageSmoothingEnabled = false;

    centerCtx3.strokeStyle = "#555";
    centerCtx3.fillStyle = "rgba(255, 255, 255, 1)";
    centerCtx3.fillRect((150/2.5), (150/2.5), (150/5), (150/5));
    centerCtx3.strokeRect((150/2.5), (150/2.5), (150/5), (150/5));
    centerCtx3.drawImage(snakeCanvas, 
    (150/2.5), (150/2.5), (150/5), (150/5));

    ctx.drawImage(frameView1, 0, 0, 150, 300);
    if (recoilEnabled)
    for (var n = 0; n < 70 ; n++) {
        var radius = (70-n);
        centerCtx.save();
        centerCtx.beginPath();
        centerCtx.arc(75, 75, radius, 0, (Math.PI*2));
        centerCtx.clip();

        var scale = 1+scaleArr[n] ;

        if (!gridEnabled)
        centerCtx.drawImage(camera, 
        ((vw/2)-(75/scale)), ((vh/2)-(75/scale)),
        (150/scale), (150/scale), 
        0, 0, 150, 150);
        else if (!snakeGame)
        centerCtx.drawImage(frameView1, 
        75-(75/scale), 150-(75/scale),
        (150/scale), (150/scale),
        0, 0, 150, 150);
        else if (snakeGame)
        centerCtx.drawImage(canvas3, 
        75-(75/scale), 75-(75/scale),
        (150/scale), (150/scale),
        0, 0, 150, 150);

        centerCtx.restore();
    }

    if (deviceNo == 0 && snakeGame) {
        centerCtx.restore();
    }

    if (recoil2Enabled)
    for (var n = 0; n < 70; n++) {
        var radius = (70-n);
        centerCtx2.save();
        centerCtx2.beginPath();
        centerCtx2.arc(75, 75, radius, 0, (Math.PI*2));
        centerCtx2.clip();

        var scale = 1+scaleArr2[n] ;

        if (double && !gridEnabled)
        centerCtx2.drawImage(camera, 
        ((vw/2)-(75/scale)), ((vh/2)-(75/scale)),
        (150/scale), (150/scale), 
        0, 0, 150, 150);
        else if (double)
        centerCtx2.drawImage(frameView1, 
        75-(75/scale), 150-(75/scale),
        (150/scale), (150/scale),
        0, 0, 150, 150);
        else if (!snakeGame)
        centerCtx2.drawImage(canvas, 
        75-(75/scale), 75-(75/scale),
        (150/scale), (150/scale),
        0, 0, 150, 150);
        else if (snakeGame)
        centerCtx2.drawImage(canvas3, 
        75-(75/scale), 75-(75/scale),
        (150/scale), (150/scale),
        0, 0, 150, 150);

        centerCtx2.restore();
    }

    if (deviceNo == 0 && snakeGame) {
        centerCtx2.restore();
    }

    if (recoilEnabled && !recoil2Enabled)
    ctx.drawImage(canvas, 0, (double ? 112.5 : 75), 
    (double ? 75 : 150), (double ? 75 : 150));
    else if (recoilEnabled && recoil2Enabled)
    ctx.drawImage(canvas2, (double ? 75 : 0), 
    (double ? 112.5 : 75), (double ? 75 : 150), (double ? 75 : 150));

    if (double && recoil2Enabled)
    ctx.drawImage(canvas, 0, (double ? 112.5 : 75), 
    (double ? 75 : 150), (double ? 75 : 150));

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((double ? 37.5 : 75), 150, 
    (double ? 35.5 : 71), 0, (Math.PI*2));
    ctx.stroke();

    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo((double ? 37.5 : 75), 150+(double ? 35.5 : 71));
    ctx.lineTo((double ? 37.5 : 75), 150+(double ? 50 : 100));
    ctx.stroke();

    if (double) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.arc((double ? 112.5 : 75), 150, 
        (double ? 35.5 : 71), 0, (Math.PI*2));
        ctx.stroke();

        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo((double ? 112.5 : 75), 150+(double ? 35.5 : 71));
        ctx.lineTo((double ? 112.5 : 75), 150+(double ? 50 : 100));
        ctx.stroke();
    }
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