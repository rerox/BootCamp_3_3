(function () {
var chat = {

    renderRow: function(dataObject) {

        var chatRow = document.createElement("div"),
            date = new Date(),
            time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
            message;

        chatRow.classList.add("chatRow");

        if(dataObject.type == "status")
            message = "<span class='status'>" + dataObject.message + "</span>";
        else
            message = "<span class='name'>" + dataObject.name + "</span>: <span class='message'>" + dataObject.message + "</span>";

        chatRow.innerHTML = "<span class='time'>" + time + "</span>\n" + message;

        this.chatWindow.appendChild(chatRow);
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;

    },

    sendData: function (msgObject) {

        var data = JSON.stringify(msgObject);
        
        this.socket.send(data);
    },
    
    displayMessage: function (e) {
        
        var dataObject = JSON.parse(e.data);
        
        this.renderRow(dataObject);
    },

    sendMessage: function () {
        var message = this.messageInput.value;

        if(message !== ""){
            this.sendData({
                type: "message",
                message: message
            });

            this.messageInput.value="";
        }
    },


    joinToChat: function(e) {
        var name = this.nameInput.value;

        if (name !== ""){
            this.sendData({
                type:"join",
                name: name
            });


            e.target.onclick = null;
            e.target.setAttribute("disabled","disabled");
            this.nameInput.setAttribute("readonly","readonly");

            this.submitButton.removeAttribute("disabled");
            this.submitButton.onclick = this.sendMessage.bind(this);

        }
    },

    stopApp: function(){
      this.joinButton.onclick = null;
      this.joinButton.setAttribute("disabled","disabled");

      this.submitButton.onclikc = null;
      this.submitButton.setAttribute("disabled","disabled");

      this.renderRow({
          type:"status",
          message:"Przerwano połączenie z serwerem"
      })
    },

    connectToServer: function () {
        this.socket = new WebSocket("ws://localhost:8000/");
        this.socket.onmessage = this.displayMessage.bind(this);
        this.socket.onclose = this.stopApp.bind(this);
    },

    init:function(){
        if(!window.WebSocket) return;

        this.nameInput = document.querySelector("#yourName");
        this.joinButton = document.querySelector("#join");
        this.chatWindow = document.querySelector("#chatWindow");
        this.messageInput = document.querySelector("#message");
        this.submitButton = document.querySelector("#submit");


        this.joinButton.onclick = this.joinToChat.bind(this);

        this.connectToServer();
    }
};

chat.init()
})();