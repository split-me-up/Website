const mongodb = require("mongodb").MongoClient;
const pkHolderCollection = "webusers";
const androidCollection = "androidusers";
const pendingMessagesCollection = "pending";
const incompleteRegistration = 'pendingRegistrations';
const url =
    "mongodb://arvind123:arvind123@ds145574.mlab.com:45574/splitmeup-v2";
const DbName = "splitmeup-v2";

module.exports = {
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

    registerAndroidUser: function(username, password) {
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
    //adding async here to wrap the return value into a promise
    getNumberOfAndroidUsers: async function() {
        return this.currentIndex + 1;
    },

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

    updateToken : function(username){
        // let self = this;
        // return new Promise(function (resolve, reject) {
        //     self.obj.collection(androidCollection).updateOne(
        //         {username : username},
        //         $set: {  : true }
        //     )
        // })
    },

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

    getPrivateKeyUserDetail: function(username) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(pkHolderCollection).findOne(
                {
                    username: username
                },
                function(err, result) {
                    if (err) throw err;
                    resolve(result.value);
                }
            );
        });
    },

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

    checkPendingMessages: function(username){
        let self = this;
        return new Promise(function(resolve, reject) {
            self.obj.collection(pendingMessagesCollection).findOne(
                {username: username},
                function(err, result) {
                    if (result) {
                        console.log(result);
                        if (result == null) {
                            console.log("inside if");
                            resolve([]);
                        } else {
                            console.log("inside else");
                            resolve(result.message);
                        }
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    },

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
