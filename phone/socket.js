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