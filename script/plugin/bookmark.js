var video = document.getElementsByTagName("video")[0];

var sw = window.innerWidth;
var sh = window.innerHeight;

var playerId = new Date().getTime();

var canvas = document.createElement("canvas");
canvas.style.position = "absolute";

canvas.width = 150;
canvas.height = 300;

canvas.style.left = ((sw/2)-75)+"px";
canvas.style.top = ((sh/2)-150)+"px";

canvas.style.width = "150px";
canvas.style.height = "300px";

canvas.style.zIndex = "999";

document.body.appendChild(canvas);

var host = "wss://websocket-sv.onrender.com/";
var wsh = null;

var messagesWaiting = [];
var messagesSent = [];
var messagesReceived = [];

var ws = {
      start: function () {
           var local = false;
           var queryString = window.location.search;
           var urlParams = new URLSearchParams(queryString);
           if (urlParams.has("local"))
           local = (urlParams.get("local") == "true");

           if (local) wsh = new WebSocket(local_host);
           else wsh = new WebSocket(host);

           wsh.onopen = function (e) {
                for (var k in messagesWaiting) {
                     wsh.send(messagesWaiting[k]);
                };
                messagesWaiting = [];
                this.onopen();
           };
           wsh.onclose = function(e) {
                ws.start();
           };
           wsh.onmessage = function(e) {
                ws.onmessage(e);
                messagesReceived.push(
                     e.data.split("|").slice(0,6).join("|"));
           };
      },
      send: function (e) {
           if (wsh.readyState == 1) {
               wsh.send(e);
               messagesSent.push(
                     e.split("|").slice(0,7).join("|"));
           }
           else { messagesWaiting.push(e); }
      },
      onmessage: function (e) { },
      tempo: 0
};
ws.start();

ws.onopen = function() {
    alert("websocket open");
    ws.send("PAPER|"+playerId+"|connection-request");
    updateImage();
};

ws.onmessage = function() {
    if (msg[0] == "PAPER" &&
        msg[1] != playerId &&
        msg[2] == "remote-downloaded") {
        remoteDownloaded = true;
    }
};

var remoteDownloaded = false;
var updateImage = function() {
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, -300, 0, 600, 300);

    if (remoteDownloaded) {
        var dataURL = canvas.toDataURL();
        ws.send("PAPER|"+playerId+"|image-data|"+dataURL);
        remoteDownloaded = false;
    }
    requestAnimationFrame(updateImage);
}

/*
    javascript: ( function() { alert("123"); var script=document.createElement("script"); document.body.appendChild(script);  script.onload=function(){ eruda.init(); }; script.src="//cdn.jsdelivr.net/npm/eruda"; } ) ();

    javascript: ( function() { alert("123"); var script=document.createElement("script"); document.body.appendChild(script);  script.onload=function(){ alert("script loaded"); }; script.src="https://cpu-test-7.kesug.com/multitouch-c/plugin.bookmark.js"; } ) ();
*/