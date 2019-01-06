const express = require("express");
const app = express();
const server = require("http").createServer(app);
const mongo = require("./mongo.js");
const io = require("socket.io").listen(server);

let users = [];
let connections = [];

// Stores the messages which are yet to be sent
let messagesArray = [];
// Stores the devices (android and privateKeyHolders who are retrieving) which are connected to the socket
let nodes = [];

const PORT = 2000;
server.listen(process.env.PORT || PORT, "0.0.0.0", function() {
  mongo.connect().then(function() {
    console.log("Socket Listening at port", PORT);
  });
});

app.use("/", express.static("public_static"));
//webview for the android app running on iochat
app.use("/app", express.static("phone"));

io.on("connection", function(socket) {
  console.log("a user connected");
  console.log(socket.id);

  function workOnDisconnect(socketDisconnected) {
    socketDisconnected.on("disconnect", function(data) {
      console.log(data);
      let temp = nodes.find(function(obj) {
        return obj.socket.id === socketDisconnected.id;
      });
      console.log("disconnecting", temp.clientId);
      let i = nodes.indexOf(temp);
      nodes.splice(i, 1);
    });
  }

  // Called from Android mobile to check wheather the user is already registered
  socket.on("verify username", function(data) {
    console.log("inside verify username");
    mongo.checkAndroidUser(data.username).then(function(bool) {
      socket.emit("verified username", bool);
    });
  });

  // add android device to the array of connected users and add the new user to the database
  socket.on("setNewDevice", function(data) {
    // here clientId is the username of android device sent from android device
    nodes.push({ clientId: data.clientId, socket: socket });
    mongo.addAndroidUser(data.clientId, "", data.publicKey);
    console.log(data.clientId, "logged in successfully");
    console.log(nodes.length);
    workOnDisconnect(socket);
  });

  // login android device to the array of connected users
  // this is also emitted by the webapp when the privateKey holder is about to request for shards
  socket.on("login user", function(data) {
    // here clientId is the username of android device sent from android device
    nodes.push({ clientId: data.clientId, socket: socket });
    console.log(data.clientId, "logged in successfully");
    console.log(nodes.length);
    workOnDisconnect(socket);
  });

  // for webapp to select users from password
  socket.on("get user count", function() {
    // mongo.getPrivateKeyUserDetail(username)
    //     .then(function (result) {
    //         socket.emit('user count', result.number);
    //     });
    mongo.getNumberOfAndroidUsers().then(function(number) {
      socket.emit("user count", number);
    });
  });

  // called from Web App to get public key of various android users
  socket.on("get user data", function(index) {
    console.log("inside get user data");
    console.log(index);
    mongo.getAndroidUserDetailsForEncryption(index).then(function(obj) {
      socket.emit("user data", obj);
    });
  });

  // called from WebApp to send shards to the android users
  socket.on("send shards", function(obj) {
    let array = obj.array;
    let mongoObj = obj.mongoObject;
    console.log("***");
    console.log(array);
    console.log("***");
    mongo.addPrivateKeyUser(mongoObj.username, mongoObj.count).then(function() {
      array.forEach(function(element) {
        console.log("length of nodes", nodes.length);
        let correct_node = nodes.find(function(incorrect_node) {
          console.log("incorrect_node clientID", incorrect_node.clientId);
          return incorrect_node.clientId == element.username;
        });
        if (correct_node) {
          // if the user has his app open that is he is connected via socket
          // we send the shard to the user
          let correct_socket = correct_node.socket;
          correct_socket.emit("send shard to android", element.data);
          console.log(element);
        } else {
          // else we store this message to his array of unsent messages
          console.log("Username = ", element.username, "Not Connected");
          addToUserMessageList(element.username, element.data);
        }
      });
    });
  });

  // called from WebApp to request shards from android users
  socket.on("request shards", function(array) {
    array.forEach(function(element) {
      let correct_node = nodes.find(function(incorrect_node) {
        return incorrect_node.clientId === element.username;
      });
      if (correct_node) {
        // if the user has his app open that is he is connected via socket
        // we request the shard from the user
        let correct_socket = correct_node.socket;
        correct_socket.emit("request shard from android", element.data);
      } else {
        // else we store this message to his array of unsent messages
        console.log("Username = ", element.username, "Not Connected");
        addToUserMessageList(element.username, element.data);
      }
    });
  });

  // called by android device to send back the privateKeyPiece he holds
  socket.on("send shard to user", function(data) {
    console.log("inside send shard to user", data);
    let correct_node = nodes.find(function(incorrect_node) {
      return incorrect_node.clientId === data.user_to_be_sent;
    });
    if (correct_node) {
      let correct_socket = correct_node.socket;
      correct_socket.emit(
        "send encrypted shard to user",
        data.encrypted_object
      );
    }
  });
});

app.get("/latestMessages", function(req, res) {
  let username = req.query.username;
  getPendingMessages(username).then(function(arrayToBeReturned) {
    res.send(arrayToBeReturned);
  });
});

function getPendingMessages(username) {
  return new Promise(function(resolve, reject) {
    mongo.getPendingMessages(username).then(function(arr) {
      resolve(arr);
    });
  });
  // let messageObject = messagesArray.find(function (ele) {
  //     return ele.username === username
  // });
  // if(messageObject){
  //     return messageObject.messages;
  // }else{
  //     return [];
  // }
}

function addToUserMessageList(username, data) {
  mongo.addToPendingMessages(username, data);
  // let messageObject = messagesArray.find(function (ele) {
  //     return ele.username === username
  // });
  // if(messageObject){
  //     messageObject.messages.push(data);
  // }else {
  //     let objectToBeAdded = {
  //         username : username,
  //         messages : [data]
  //     };
  //     messagesArray.push(objectToBeAdded);
  // }
}
