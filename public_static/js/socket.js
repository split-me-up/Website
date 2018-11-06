var socket = io();

function selectUsersFromPassword(password, count) {
    return new Promise(function (resolve, reject) {
        resolve([0, 1, 2]);
    });
};

function sendShardsThroughSocket(username, password, seed_phrase) {
    return new Promise(function (resolve, reject) {
        socket.emit('get user count');
        socket.on('user count', function (count) {
            selectUsersFromPassword(password, count)
                .then(function (arrayWithIndices) {
                    // console.log("array of indices", arrayWithIndices);
                    function afterLoop(array){
                        window.App.Send(array, seed_phrase, password, username)
                            .then(function (arrayReturn) {
                                console.log(arrayReturn, "Mine");
                                resolve();
                                // TODO socket.emit('send shards', arrayReturn);
                            });
                    }
                    let arrayOfData = [];
                    let i = 0;
                    requestForData(arrayWithIndices[i]);
                    socket.on('user data', function (data) {
                        // console.log("Data : ", data);
                        arrayOfData.push(data);
                        i++;
                        if(i < arrayWithIndices.length){
                            requestForData(arrayWithIndices[i]);
                        }else{
                            afterLoop(arrayOfData);
                        }
                    })
                });
        });
        function requestForData(index) {
            socket.emit('get user data', index);
        }
    });
}

function requestPieces(username, callback) {
    socket.emit('requestShards', username);
    socket.on('contract-shard', function (firstShard) {
       callback(firstShard);
    });
}

function sendOTP(otp, callback){
    console.log(otp);
    socket.emit('telegram-register', otp);
    socket.on('chat-id', function (chatid) {
        if(callback) callback(chatid.toString());
    });
}

socket.on('telegram-shards', function (shardsArray) {
    console.log("shards Returned");
    window.shardArray = shardsArray;
});