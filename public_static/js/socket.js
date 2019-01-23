let socket = io();
let NUMBER_OF_HOLDERS = 2;


function getRandom(arr) {
    let n = NUMBER_OF_HOLDERS;
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


function selectUsersFromPassword(password, count) {
    return new Promise(function (resolve, reject) {

        socket.emit("valid user list");
        socket.on('valid users', function (array) {
            let arrSelected = getRandom(array);
            console.log('arrSelected' ,arrSelected)
            resolve(arrSelected);
        });

        // let arr = [];
        // let initialRand  = getRandomNumber();
        // socket.emit("check user validity", initialRand);
        //
        // socket.on("user validity", function (object) {
        //    if(object.bool){
        //        console.log("Index Selected", object.index);
        //        arr.push(object.index);
        //        if(arr.length !== NUMBER_OF_HOLDERS){
        //            let nextRand;
        //            while(nextRand != null){
        //                nextRand = getRandomNumber();
        //            }
        //            if(arr.indexOf(nextRand) === -1){
        //                socket.emit("check user validity", nextRand);
        //            }
        //        }else {
        //            resolve(arr);
        //        }
        //    }else{
        //        let nextRand = getRandomNumber();
        //        if(arr.indexOf(nextRand) === -1){
        //            socket.emit("check user validity", nextRand);
        //        }
        //    }
        // });
    });
}

function sendShardsThroughSocket(username, password, seed_phrase, callingFunctions) {
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
                                socket.emit('send shards', {
                                    array : arrayReturn,
                                    mongoObject : {
                                        username : username,
                                        count : count
                                    }
                                });
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

function receivingShards(privateKey, password, username, callingFunctions) {
    return new Promise(function (resolve, reject) {
        let shardsArray = [];
        let already = false;
        socket.on('send encrypted shard to user', function (encryptedShard) {
            console.log("inside encrypted shard to user");
            if(shardsArray.length < 2){
                shardsArray.push(encryptedShard);
                console.log(shardsArray);
            }
            if(shardsArray.length === 2 && !already){
                already = true;
                window.App.Combine(shardsArray, privateKey, password)
                    .then(function(obj) {
                        console.log(obj.mnemonic);
                        console.log(obj.users);
                        resolve(obj.mnemonic);
                        releaseFunds(username, obj.users[0], obj.users[1], obj.mnemonic, callingFunctions);
                    });
            }
        });
    });

}

function requestShardsThroughSocket(username, password, callngFunctions) {
    const keyPair = window.App.Generate();
    const privateKey = keyPair.privateKey;
    const publicKey = keyPair.publicKey;
    return new Promise(function (resolve, reject) {
        socket.emit('get user count');
        socket.on('user count', function (count) {
            let arrayWithIndices = [];
            for(let i = 0; i < count; i++){
                arrayWithIndices.push(i)
            };
            function afterLoop(array){
                // console.log(array);
                window.App.Request(array, publicKey, password, username)
                    .then(function (arrayReturn) {
                        // console.log(arrayReturn);
                        socket.emit('login user', {
                            clientId : username,
                            publicKey : publicKey
                        });
                        socket.emit('request shards', arrayReturn);
                        receivingShards(privateKey, password, username, callngFunctions)
                            .then(function (mnemonic) {
                                resolve(mnemonic);
                            });
                    })
            }
            let arrayOfData = [];
            let i = 0;
            requestForData(arrayWithIndices[i]);
            socket.on('user data', function (data) {
                arrayOfData.push(data);
                i++;
                if(i < arrayWithIndices.length){
                    requestForData(arrayWithIndices[i]);
                }else{
                    afterLoop(arrayOfData);
                }
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