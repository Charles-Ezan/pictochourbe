var name; 
var connectedUser; 
var users = {};
var userName = '';

//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:9000'); 

conn.onopen = function () { 
   console.log("Connected to the signaling server");
};


conn.onmessage = function (msg) { 
   console.log("Got message", msg.data); 
   var data = JSON.parse(msg.data); 
   console.log("client data type:", data.type)
   switch(data.type) { 
      case "login": 
         handleLogin(data.success); 
         break; 
      case "offer": 
         handleOffer(data.offer, data.name); 
         break; 
      case "answer": 
         handleAnswer(data.answer); 
         break; 
      case "candidate": 
         handleCandidate(data.candidate); 
         break; 
      case "leave": 
         handleLeave(); 
         break; 
      default: 
         break; 
   } 
}; 

function send(message) {
   console.log("send message")
   if (connectedUser) { 
      message.name = connectedUser; 
   }
   conn.send(JSON.stringify(message));  
};

var loginPage = document.querySelector('#loginPage'); 
var mainPage = document.querySelector('#mainPage'); 
var usernameInput = document.querySelector('#usernameInput'); 
var loginBtn = document.querySelector('#loginBtn'); 
var usersBtn = document.querySelector('#usersBtn'); 

mainPage.style.display = "none"; 

loginBtn.addEventListener("click", function (event) { 
    const name = usernameInput.value; 
    userName = name;
    console.log("pressed login button")
    if (name.length > 0) {
        send({ 
            type: "login", 
            name: name 
        }); 
    } 
 });

usersBtn.addEventListener("click", function (event) { 
   console.log(userName)
});

function handleLogin(success) { 
   console.log("login")
   if (success === false) {
      alert("Try a different username"); 
   } else { 
      console.log("success !")
      send({type: "updateUsers", name: userName})
      var configuration = { 
         "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }] 
      }; 
      loginPage.style.display = "none"; 
      mainPage.style.display = "block"; 
		
      yourConn = new webkitRTCPeerConnection(configuration, {optional: [{RtpDataChannels: true}]}); 
		
      yourConn.onicecandidate = function (event) { 
         if (event.candidate) { 
            send({ 
               type: "candidate", 
               candidate: event.candidate 
            }); 
         } 
      }; 

      dataChannel = yourConn.createDataChannel("chanelPictochourbe", {reliable:true}); 
		
      dataChannel.onerror = function (error) { 
         console.log("ERROR", error); 
      }; 
		
      //when we receive a message from the other peer, display it on the screen 
      dataChannel.onmessage = function (event) { 
         chatArea.innerHTML += connectedUser + ": " + event.data + "<br />"; 
      }; 
		
      dataChannel.onclose = function () { 
         console.log("DATA CHANNEL CLOSE"); 
      };
		
   } 
};

 

conn.onerror = function (err) { 
   console.log("ERROR", err); 
}; 

