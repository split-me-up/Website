const express = require("express");
const app = express();
const server = require('http').createServer(app);
const mongo = require('./mongo.js');
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Stores the devices (android and privateKeyHolders who are retrieving) which are connected to the socket
let nodes = [];

// The interval after which a push notification is sent to the android user
let PUSH_INTERVAL = 60000;
const PORT = 2000;

server.listen(process.env.PORT || PORT, "0.0.0.0", function() {
    mongo.connect().then(function() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://splitmeup2.firebaseio.com'
        });
        console.log("Socket Listening at port", PORT);
        // sendPushNotificationToUser('Dadi');
        // sendPushNotificationToUser('Baal');
    });
});

app.use("/", express.static("public_static"));

//webview for the android app running on iochat
app.use("/app", express.static("phone"));

// whenever some frontend attempts to connect to the socket
io.on("connection", function(socket) {
    console.log("a user connected");
    console.log(socket.id);

    // this is to be performed whenever a connected node is disconnected and it
    // is to be removed from the nodes array
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


    app.post('/auth', function (req, res) {
       let username = req.body.username;
       let pass = req.body.password;
       // console.log(username, pass);
       mongo.registerAndroidUser(username, pass);
       res.send();
    });

    // add android device to the array of connected users and add the new user to the database
    socket.on("setNewDevice", function(data) {
        // here clientId is the username of android device sent from android device
        // nodes.push({ clientId: data.clientId, socket: socket });
        console.log("token", data.token);
        mongo.addToPendingRegistrations(data.clientId, data.publicKey, data.address, data.token);
        // mongo.addAndroidUser(data.clientId, "", data.publicKey, data.token);
        console.log(data.clientId, "registered successfully");
        // console.log(nodes.length);
        // workOnDisconnect(socket);
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
                    checkForPendingMessages(element.username, element.data);
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
                checkForPendingMessages(element.username, element.data);
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

// called from the android device whenever it is opened to get the latest list of pending messages
app.post("/latestMessages", function(req, res) {
    let username = req.body.username;
    console.log("Latest Messages Requested by", username);
    getPendingMessages(username).then(function(arrayToBeReturned) {
        console.log(arrayToBeReturned);
        res.send(arrayToBeReturned);
    });
});

app.post("/updateToken", function (req, res) {

});


function sendPushNotificationToUser(username) {
    mongo.getAndroidUserPushToken(username)
        .then(function (token) {
            let message = {
                notification: {
                    title: 'Hey!, ' + username,
                    body: 'You May Have Earned Dai!'
                }
            };
            admin.messaging().sendToDevice(token, message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log("Notification Pushed to at token  " + username, token);
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        });
}

function checkForPendingMessages(username, message){
    mongo.getNumberOfPendingMessages(username)
        .then(function (number) {
            if(number === 0){
                sendPushNotificationToUser(username);
                let interval = setInterval(function () {
                    mongo.getNumberOfPendingMessages(username)
                        .then(function (arr) {
                            if(number === 0){
                                clearInterval(interval);
                            }else{
                                sendPushNotificationToUser(username);
                            }
                        })
                }, PUSH_INTERVAL);
            }
            console.log("sending");
            mongo.addToPendingMessages(username, message);
        });
}

function getPendingMessages(username) {
    return new Promise(function(resolve, reject) {
        mongo.getPendingMessages(username).then(function(arr) {
            resolve(arr);
        });
    });
}

// function addToUserMessageList(username, data) {
//     mongo.addToPendingMessages(username, data);
//     // let messageObject = messagesArray.find(function (ele) {
//     //     return ele.username === username
//     // });
//     // if(messageObject){
//     //     messageObject.messages.push(data);
//     // }else {
//     //     let objectToBeAdded = {
//     //         username : username,
//     //         messages : [data]
//     //     };
//     //     messagesArray.push(objectToBeAdded);
//     // }
// }
