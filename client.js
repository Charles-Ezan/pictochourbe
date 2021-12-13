//our username 
var name; 
var connectedUser; 
var users = {};

//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:9000'); 

conn.onopen = function () { 
   console.log("Connected to the signaling server");
};

//when we got a message from a signaling server 
conn.onmessage = function (msg) { 
    console.log("Got message", msg.data); 
    var data = JSON.parse(msg.data); 
    console.log("client data type:", data.type)
    switch(data.type) { 
        case "login": 
           handleLogin(data.success); 
           break; 
        //when somebody wants to call us 
        case "offer": 
           handleOffer(data.offer, data.name); 
           break; 
        case "answer": 
           handleAnswer(data.answer); 
           break; 
        //when a remote peer sends an ice candidate to us 
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

 //alias for sending JSON encoded messages 
function send(message) {
    console.log("send message")
   //attach the other peer username to our messages
    if (connectedUser) { 
        message.name = connectedUser; 
    }
    conn.send(JSON.stringify(message));  
};

var loginPage = document.querySelector('#loginPage'); 
var usernameInput = document.querySelector('#usernameInput'); 
var loginBtn = document.querySelector('#loginBtn'); 
var usersBtn = document.querySelector('#usersBtn'); 

loginBtn.addEventListener("click", function (event) { 
    const name = usernameInput.value; 
    console.log("pressed login button")
    if (name.length > 0) {
        send({ 
            type: "login", 
            name: name 
        }); 
    } 
 });

 usersBtn.addEventListener("click", function (event) { 
    console.log(users)
 });

 function handleLogin(success) { 
    console.log("login")
    if (success === false) {
       alert("Try a different username"); 
    } else { 
       console.log("success !")
    }}

 

 conn.onerror = function (err) { 
   console.log("Got error", err); 
}; 

