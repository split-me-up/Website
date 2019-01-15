const mongodb = require("mongodb").MongoClient;
const pkHolderCollection = "webusers";
const androidCollection = "androidusers";
const pendingMessagesCollection = "pending";
const incompleteRegistration = 'pendingRegistrations';
const url =
    "mongodb://arvind123:arvind123@ds145574.mlab.com:45574/splitmeup-v2";
const DbName = "splitmeup-v2";

module.exports = {

    /*
        Function used to connect to the mongo database
        Called when server is initiated

        @Returns {Promise} resolve true if connected
    */
    connect: function() {
        let self = this;
        return new Promise(function(resolve, reject) {
            mongodb.connect(
                url,
                function(err, database) {
                    if (err) reject(err);
                    else {
                        self.obj = database.db(DbName);
                        self.obj.collection(androidCollection).count(function(err, count) {
                            if (err) throw err;
                            if (count >= 1) {
                                console.log("inside if *mongo.js*");
                                self.currentIndex = count - 1;
                                resolve(true);
                            } else {
                                console.log("inside else *mongo.js*");
                                self.currentIndex = -1;
                                resolve(true);
                            }
                        });
                    }
                }
            );
        });
    },



    /*
        Function to register a Storage Device on Database
        Called by Server Administrator after he is added to the contract

        @Param {string} username : username of the Storage Device
        @Returns {promise} resolve true if registered
     */
    registerAndroidUser: function(username) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection('password').findOne(
                {password : password}, function (err, result) {
                    if(err) throw err;
                    if(result){
                        self.obj.collection(incompleteRegistration).findOneAndDelete({
                            username : username
                        }, function (err, res) {
                            let result = res.value;
                            let objtoadd = {
                                username: result.username,
                                publicKey: result.publicKey,
                                token : result.token,
                                index: self.currentIndex + 1
                            };
                            self.obj
                                .collection(androidCollection)
                                .insertOne(objtoadd, function(err, result) {
                                    if (err) reject(err);
                                    else {
                                        self.currentIndex = self.currentIndex + 1;
                                        resolve(true);
                                    }
                                });
                        });
                    }
                });
        });
    },



    /*
        Function to check if the Storage Account username is available
        Called by the Storage Device at the time of registration

        @Param {string} username : username of the Storage Account
        @Returns {Promise} { resolve true if available }
                           { resolve false if unavailable }
     */
    checkAndroidUser: function(username) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(androidCollection).findOne(
                {
                    username: username
                },
                function(err, result) {
                    if (err) reject(err);
                    else {
                        if (result == null) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                }
            );
        });
    },



    /*
        Function to get the number of Storage Accounts already registered with the network
        Called by Key Splitter while splitting the key
        Added async here to wrap the return value into a promise

        @Returns {number} : number of registered Storage Accounts
     */
    getNumberOfAndroidUsers: async function() {
        return this.currentIndex + 1;
    },




    /*
        Function to get details of the Storage Account to be used for encryption
        Called by Key Splitter at the time of splitting

        @Param {number} index : index of the Storage Account whose details are needed
        @Returns {Promise} { resolves Object {
                                                username    : username of Storage Account,
                                                publicKey   : public key of Storage Account
                                              }

     */
    getAndroidUserDetailsForEncryption: function(index) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(androidCollection).findOne(
                {
                    index: index
                },
                function(err, result) {
                    if (err) reject(err);
                    else {
                        let retVal = {
                            username: result.username,
                            publicKey: result.publicKey
                        };
                        resolve(retVal);
                    }
                }
            );
        });
    },




    /*
        Function to retrieve Push Token of the Storage Account
        Called from server so that notification can be sent to the device

        @Param {string} username : username of the Storage Account
        @Returns {Promise} { resolves {string} push token }
     */
    getAndroidUserPushToken: function(username){
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(androidCollection).findOne(
                {
                    username: username
                },
                function(err, result) {
                    if (err) reject(err);
                    else {
                        resolve(result.token);
                    }
                }
            );
        });
    },


    // updateToken : function(username){
    //     // let self = this;
    //     // return new Promise(function (resolve, reject) {
    //     //     self.obj.collection(androidCollection).updateOne(
    //     //         {username : username},
    //     //         $set: {  : true }
    //     //     )
    //     // })
    // },



    /*
        Function to add Key Splitter to the database
        Called by Key Splitter after he has sent the pieces

        @Param {string} username : username of the Key Splitter
        @Param {number} noOfUsers : no of storage accounts at the time of splitting
     */
    addPrivateKeyUser: function(username, noOfUsers) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(pkHolderCollection).insertOne(
                {
                    username: username,
                    number: noOfUsers
                },
                function(err, result) {
                    if (err) throw err;
                    resolve(result);
                }
            );
        });
    },




    /*
        Function to get the number of Storage Accounts when the Key Spitter did split
        Called by Key Splitter at the time of Regeneration

        @Param {string} username : username of the Key Splitter
        @Returns {Promise} { resolves {number} : number of Storage Accounts}
     */
    // getPrivateKeyUserDetail: function(username) {
    //     let self = this;
    //     return new Promise(function(resolve, reject) {
    //         self.obj.collection(pkHolderCollection).findOne(
    //             {
    //                 username: username
    //             },
    //             function(err, result) {
    //                 if (err) throw err;
    //                 resolve(result.value);
    //             }
    //         );
    //     });
    // },



    /*
        Function to add a message to the array of pending messages
        Called by the server in case when Storage account is not connected through socket

        @Param {string} username : username of Storage Account
        @Param {string} message : message that is pending
        @Returns {Promise} resolves once done
     */
    addToPendingMessages: function(username, message) {
        console.log("Adding Pending Messages for ", username);
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(pendingMessagesCollection).findOne(
                {
                    username: username
                },
                function(err, result) {
                    if (result) {
                        self.obj
                            .collection(pendingMessagesCollection)
                            .updateOne(
                                { username: username },
                                { $push: { message: message } }
                            );
                    } else {
                        let objectToBeAdded = {
                            username: username,
                            message: [message]
                        };
                        self.obj
                            .collection(pendingMessagesCollection)
                            .insertOne(objectToBeAdded, function(err, result) {
                                resolve();
                            });
                    }
                }
            );
        });
    },



    /*
        Function to get the number of pending messages for a certain Storage Account
        Called by server while adding to the array of pending messages

        @Param {string} username : username of the Storage Account
        @Returns {Promise} {resolves {number} : number of pending messages
     */
    getNumberOfPendingMessages: function(username){
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(pendingMessagesCollection).findOne(
                {username: username},
                function(err, result) {
                    if (result) {
                        console.log(result);
                        if (result == null) {
                            console.log("inside if");
                            resolve(0);
                        } else {
                            console.log("inside else");
                            resolve(result.message.length);
                        }
                    } else {
                        resolve(0);
                    }
                }
            );
        });
    },



    /*
        Function to add to a db of Storage Accounts whose gas cost is yet to be paid by the administrator
        Called by the Storage Account while registering to the network

        @Param {string} username : username of the Storage Account
        @Param {string} publicKey : public key of the Storage Account to be used in ecryption
        @Param {string} address : Ethereum Address of the Storage Account
        @Param {string} key : firebase push token of the Storage Account
     */
    addToPendingRegistrations: function(username, publicKey, address, key) {
        let self = this;
        let objtoadd = {
            username: username,
            publicKey: publicKey,
            token : key,
            address
        };
        console.log(self);
        self.obj.collection(incompleteRegistration).insertOne(objtoadd, function (err, result) {
            if(err) throw err;
        });
    },


    /*
        Function to get the pending messages array for Storage Account
        Called by Storage Account when he opens the app

        @Param {string} username : username of Storage Account
        @Returns {Promise} { resolves {array} : array of pending messages }
     */
    getPendingMessages: function(username) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(pendingMessagesCollection).findOneAndDelete(
                {username: username},
                function(err, result) {
                    if (result) {
                        console.log(result.value);
                        if (result.value == null) {
                            console.log("inside if");
                            resolve([]);
                        } else {
                            console.log("inside else");
                            resolve(result.value.message);
                        }
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }
};

// module.exports.connect().then(function () {
//    module.exports.getPendingMessages("arvind").then(function (arr) {
//        console.log(arr);
//    });
//  module.exports.addToPendingMessages("arvind", "hey3");
//  module.exports.getAndroidUserDetailsForEncryption(0).then(function (rs) {
//      console.log(rs);
//  })
// });
