/**
 * Created by Kamil on 2017-01-13.
 */

var ws = require("nodejs-websocket");

var server = ws.createServer(function(conn){

    conn.on("text",function (data) {

        var dataObject = JSON.parse(data);

        if(dataObject.type == "join"){
            conn.nickName = dataObject.name;

            sendToAll({
                type: "status",
                message: conn.nickName + " dołączył/a do czatu."
            });
        }else if(dataObject.type == "message"){
            sendToAll({
                type: "message",
                name: conn.nickName,
                message: dataObject.message
            });
        }
    });

    conn.on("error",function (e) {
        console.log("Nieoczekiwanie przerwano połączenie!")
    });

    conn.on("close",function () {
      if(conn.nickName)
      {
          sendToAll({
              type: 'status',
              message: conn.nickName + " opuścił/a czat."
          })
      }
    })

}).listen(8000,"localhost",function(){
    console.log("Serwer aktywny!")
});

function sendToAll(data){
    var msg = JSON.stringify(data);

    server.connections.forEach(function(conn){
        conn.sendText(msg);
    })
}