const socket = io();

function registerWithUsername(username) {
    socket.emit("verify username", {username: username});
    socket.on("verified username",function(bool){

        if(bool){
            alert('username taken');
        }else{

            let passPhrase = new Date().getTime().toString();
            let pvtKey = window.App.generateRSAKey(passPhrase, 512);
            try {
                Android.sendPrivateKey(JSON.stringify(pvtKey.toJSON()));
                Android.storeUsername(username);
            } catch (e) {
                localStorage.setItem('key', JSON.stringify(pvtKey.toJSON()));
                localStorage.setItem('username', username);
            } finally {
                let publicKey = window.App.publicKeyString(pvtKey);
                socket.emit('setNewDevice',{clientId: username, publicKey: publicKey});
                listenForShards(pvtKey);
                waitForRequest(pvtKey, username);
                document.getElementById('output').innerHTML += "\nDevice Stored on socket";
            }

        }

    });
}

function loginWithUsername(username) {
    let pvtKey_string;
    try {
        pvtKey_string =  Android.getPrivateKey()
    } catch (e) {
        pvtKey_string =  localStorage.getItem('key');
    } finally {
        let PVTKEY = window.App.RSAParse(pvtKey_string);
        let publicKey = window.App.publicKeyString(PVTKEY);
        socket.emit('login user',{clientId: username, publicKey: publicKey});
        listenForShards(PVTKEY);
        waitForRequest(PVTKEY, username);
        document.getElementById('output').innerHTML += "\nDevice Stored on socket";
    }
}

function listenForShards(privateKey) {
    document.getElementById('output').innerHTML += "\nDevice Listening";
    socket.on('send shard to android',function(data){
        let decrypted_object = window.App.decryptObject(data, privateKey);
        //android code to store this object
        document.getElementById('output').innerHTML += "\nObj = " + JSON.stringify(decrypted_object);
        console.log(decrypted_object);
        try {
            Android.sendNewShard(JSON.stringify(decrypted_object));
        } catch (e) {
            localStorage.setItem(decrypted_object.identity,decrypted_object.shard);
        } finally {
        }
    });
}

function waitForRequest(privateKey, username) {
    socket.on('request shard from android',function(data){
        let decrypted_object = window.App.decryptObject(data, privateKey);
        console.log('decrypted_object', decrypted_object);
        let shardToBeSent;
        try {
            shardToBeSent = Android.requestForShard(decrypted_object.key)
        } catch (e) {
            shardToBeSent =  localStorage.getItem(decrypted_object.key);
        } finally {
            let user_to_be_sent = decrypted_object.username;
            let object_to_be_sent ={
                userSending: username,
                shard: shardToBeSent
            };
            let encrypted_object = window.App.encryptShardToSendIt(object_to_be_sent, decrypted_object.publicKey);
            console.log(encrypted_object);
            socket.emit('send shard to user',{user_to_be_sent: user_to_be_sent, encrypted_object: encrypted_object});
        }
    })
}