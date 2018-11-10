const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongo = require('./mongo.js');
const io = require('socket.io').listen(server);


let users = [];
let connections = [];
let nodes =[];
const PORT = 2000;
server.listen(process.env.PORT || PORT, '0.0.0.0', function(){
    mongo.connect()
        .then(function () {
            console.log('Socket Listening at port' , PORT);
        })
});

app.use('/', express.static('public_static'));
//webview for the android app running on iochat
app.use('/app',express.static('phone'));

io.on('connection', function(socket){
    console.log('a user connected');
    console.log(socket.id);

    function workOnDisconnect(socketDisconnected){
        socketDisconnected.on('disconnect',function(data){
            console.log(data);
            let temp = nodes.find(function(obj){
                return obj.socket.id === socketDisconnected.id;
            });
            console.log('disconnecting', temp.clientId);
            let i = nodes.indexOf(temp);
            nodes.splice(i, 1);
        });
    }

    socket.on('verify username', function(data){
        console.log("inside verify username");
        mongo.checkAndroidUser(data.username).then(function(bool){
            socket.emit('verified username',bool);
        })
    });

    socket.on('setNewDevice',function(data){
        nodes.push({clientId: data.clientId, socket: socket});
        mongo.addAndroidUser(data.clientId,"",data.publicKey);
        console.log(data.clientId, 'logged in successfully');
        console.log(nodes.length);
        workOnDisconnect(socket);
    });

    socket.on('login user',function(data){
        nodes.push({clientId: data.clientId, socket: socket});
        console.log(data.clientId, 'logged in successfully');
        console.log(nodes.length);
        workOnDisconnect(socket);
    });

    // for webapp
    socket.on('get user count',function(){
        var usercount = mongo.getNumberOfAndroidUsers;
        socket.emit('user count', usercount)
    });

    socket.on('get user data',function(index){
        console.log('inside get user data');
        console.log(index);
        mongo.getAndroidUserDetailsForEncryption(index).then(function(obj){
            socket.emit('user data',obj);
        })
    });

    socket.on('send shards', function(array){
        console.log('***');
        console.log(array);
        console.log('***');
        array.forEach(function(element){
            console.log('length of nodes', nodes.length);
            let correct_node= nodes.find(function(incorrect_node){
                console.log('incorrect_node clientID', incorrect_node.clientId);
                return incorrect_node.clientId == element.username;
            });
            if(correct_node){
                let correct_socket = correct_node.socket;
                correct_socket.emit('send shard to android', element.data);
                console.log(element);
            }else{
                console.log("Username = ", element.username, "Not Connected");
            }
        })
    });

    socket.on('request shards',function(array){
        array.forEach(function(element){
            let correct_node = nodes.find(function(incorrect_node){
                return incorrect_node.clientId === element.username;
            });
            let correct_socket = correct_node.socket;
            correct_socket.emit('request shard from android', element.data);
        })
    });

    socket.on('send shard to user',function(data){
        console.log('inside send shard to user',data);
        let correct_node = nodes.find(function(incorrect_node){
            return incorrect_node.clientId === data.user_to_be_sent;
        });
        let correct_socket = correct_node.socket;
        correct_socket.emit('send encrypted shard to user',data.encrypted_object)
    })
});
