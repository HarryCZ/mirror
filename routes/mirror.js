/*
 * mirror
 */
exports.mirror = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var mirrorsCollection = db.get('mirrorsCollection');
			var userCollection = db.get('usercollection');
			var treasuryCollection = db.get('treasuryCollection');
			mirrorsCollection.find({},{},function(err,mirrors){
				userCollection.find({},{},function(err,users){
					treasuryCollection.find({},{},function(error,treasury){
						res.render('mirror',{
							"mirrors" : mirrors,
							"users" : users,
							"treasuries" : treasury,
							mirrorsArr : JSON.stringify(mirrors),
							usersArr : JSON.stringify(users),
							treasuriesArr : JSON.stringify(treasury)
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}
/*
 * addMirrorForm
 */
exports.addMirrorForm = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var mirrorsCollection = db.get('mirrorsCollection');
			var userCollection = db.get('usercollection');
			var treasuryCollection = db.get('treasuryCollection');
			mirrorsCollection.find({},{},function(err,mirrors){
				userCollection.find({},{},function(err,users){
					treasuryCollection.find({},{},function(error,treasury){
						res.render('addMirror',{
							"mirrors" : mirrors,
							"users" : users,
							"treasuries" : treasury,
							mirrorsArr : JSON.stringify(mirrors),
							usersArr : JSON.stringify(users),
							treasuriesArr : JSON.stringify(treasury)
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}
/*
 * addMirror
 */
exports.addMirror = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var mirrorsCollection = db.get('mirrorsCollection');
			//Get Input Submissions
			var date = req.body.date;
			var user = req.body.user;
			var treasury = req.body.treasury;
			
			mirrorsCollection.insert({
				"date" : date,
				"user" : user,
				"treasury" : treasury
			},function(err,doc){
				if(err){
					res.send('There was a problem');
				} else {
					res.location('mirrorItems');
					res.redirect('mirrorItems');
				}
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * mirrorItems
 */
exports.mirrorItems = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var mirrorsCollection = db.get('mirrorsCollection');
			var storageCollection = db.get('storageCollection');
			var unitsCollection = db.get('unitsCollection');
			var userCollection = db.get('usercollection');
			var treasuryCollection = db.get('treasuryCollection');
			mirrorsCollection.find({},{},function(err,mirrors){
				storageCollection.find({},{},function(error,storage){
					unitsCollection.find({},{},function(error,units){
						userCollection.find({},{},function(error,users){
							treasuryCollection.find({},{},function(error,treasuries){
								res.render('mirrorItems',{
									storageArr : JSON.stringify(storage),
									unitsArr : JSON.stringify(units),
									treasuriesArr : JSON.stringify(treasuries),
									usersArr : JSON.stringify(users),
									mirrorArr : JSON.stringify(mirrors.sort({_id:1})[mirrors.length-1]),
									"mirror" : mirrors.sort({_id:1})[mirrors.length-1],
									"storage" : storage
								});
							});
						});
					});
					
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * updMirrorItemsStaus
 */
exports.updMirrorItemsStaus = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			
			//Get Input Submissions
			var mirror = req.body.mirrorId;
			var items = req.body.items;
			
			var mirrorsCollection = db.get('mirrorsCollection');
			var storageCollection = db.get('storageCollection');
			storageCollection.find({},{},function(error,storage){
				mirrorsCollection.find({'_id' : BSON.ObjectID.createFromHexString(mirror)},{},function(error,mirrors){
					var i = 0;
					while (items[i]) {
						if (items[i].amount == "") {
							var j = 0;
							while (storage[j]) {
								if (items[i].id == storage[j]._id) {
									items[i].amount = storage[j].amount;
								}
								j++;
							}
						}	
						i++;
					}
					mirrorsCollection.update({"_id" : BSON.ObjectID.createFromHexString(mirror)},{
						"date" : mirrors[0].date,
						"user" : mirrors[0].user,
						"treasury" : mirrors[0].treasury,
						"items" : items
					},function(e,doc){
						if(e){
							res.send('There was a problem');
						} else {
							res.location('mirrorTreasuryStat');
							res.redirect('mirrorTreasuryStat');
						}
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * mirrorTreasuryStat
 */
exports.mirrorTreasuryStat = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var mirrorsCollection = db.get('mirrorsCollection');
			var storageCollection = db.get('storageCollection');
			var unitsCollection = db.get('unitsCollection');
			var userCollection = db.get('usercollection');
			var treasuryCollection = db.get('treasuryCollection');
			mirrorsCollection.find({},{},function(err,mirrors){
				storageCollection.find({},{},function(error,storage){
					unitsCollection.find({},{},function(error,units){
						userCollection.find({},{},function(error,users){
							treasuryCollection.find({},{},function(error,treasuries){
								res.render('mirrorTreasuryStat',{
									storageArr : JSON.stringify(storage),
									unitsArr : JSON.stringify(units),
									usersArr : JSON.stringify(users),
									treasuriesArr : JSON.stringify(treasuries),
									mirrorArr :  JSON.stringify(mirrors.sort({_id:1})[mirrors.length-1]),
									"mirror" : mirrors.sort({_id:1})[mirrors.length-1]
								});
							});
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * updMirrorTreasuryStaus
 */
exports.updMirrorTreasuryStaus = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			
			//Get Input Submissions
			var mirror = req.body.mirrorId;
			var amount = req.body.amount;
			
			var mirrorsCollection = db.get('mirrorsCollection');
			mirrorsCollection.find({'_id' : BSON.ObjectID.createFromHexString(mirror)},{},function(error,mirrors){
				mirrorsCollection.update({"_id" : BSON.ObjectID.createFromHexString(mirror)},{
					"date" : mirrors[0].date,
					"user" : mirrors[0].user,
					"treasury" : mirrors[0].treasury,
					"items" : mirrors[0].items,
					"treasury_stat" : amount
				},function(e,doc){
					if(e){
						res.send('There was a problem');
					} else {
						res.location('mirrorDebts');
						res.redirect('mirrorDebts');
					}
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

//mirrorDebts
exports.mirrorDebts = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var mirrorsCollection = db.get('mirrorsCollection');
			var storagecollection = db.get('storageCollection');
			var treasuryCollection = db.get('treasuryCollection');
			var unitsCollection = db.get('unitsCollection');
			var userCollection = db.get('usercollection');
			var debtsCollection = db.get('debtsCollection');
			mirrorsCollection.find({},{},function(err,mirrors){
				storagecollection.find({},{},function(error,storage){
					treasuryCollection.find({},{},function(error,treasuries){
						unitsCollection.find({},{},function(error,units){
							debtsCollection.find({},{},function(err,debts){
								userCollection.find({},{},function(err,users){
									res.render('mirrorDebts',{
										mirrorArr : JSON.stringify(mirrors.sort({_id:1})[mirrors.length-1]),
										storageArr : JSON.stringify(storage),
										unitsArr : JSON.stringify(units),
										debtsArr : JSON.stringify(debts),
										treasuriesArr : JSON.stringify(treasuries),
										usersArr : JSON.stringify(users),
										"mirror" : mirrors.sort({_id:1})[mirrors.length-1],
										"storage" : storage,
										"debts" : debts
									});
								});
							});
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * updMirrorDebt
 */
exports.updMirrorDebt = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			
			//Get Input Submissions
			var mirror = req.body.mirrorId;
			var debtor = req.body.debtor;
			var amount = req.body.amount;
			
			var mirrorsCollection = db.get('mirrorsCollection');
			mirrorsCollection.find({'_id' : BSON.ObjectID.createFromHexString(mirror)},{},function(error,mirrors){
				var i = 0;
				var debts = new Array();
				if (mirrors[0].debts) {
					while (mirrors[0].debts[i]) {
						debts[i] = mirrors[0].debts[i];
						i++;
					}
				}
				debts[i] = {'debtor':debtor, 'amount':amount};
				mirrorsCollection.update({"_id" : BSON.ObjectID.createFromHexString(mirror)},{
					"date" : mirrors[0].date,
					"user" : mirrors[0].user,
					"treasury" : mirrors[0].treasury,
					"items" : mirrors[0].items,
					"treasury_stat" : mirrors[0].treasury_stat,
					"debts" : debts
				},function(e,doc){
					if(e){
						res.send('There was a problem');
					} else {
						res.location('mirrorDebts');
						res.redirect('mirrorDebts');
					}
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * confirmMirror
 */
exports.confirmMirror = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			
			//Get Input Submissions
			var mirror = req.body.mirrorId;
			
			var mirrorsCollection = db.get('mirrorsCollection');
			var storageCollection = db.get('storageCollection');
			var unitscollection = db.get('unitscollection');
			var debtsCollection = db.get('debtsCollection');
			var treasuryCollection = db.get('treasuryCollection');
			mirrorsCollection.find({'_id' : BSON.ObjectID.createFromHexString(mirror)},{},function(error,mirrors){
				storageCollection.find({},{},function(err,storage){
					var i = 0;
					while (mirrors[0].items[i]) {
						var j = 0;
						while (storage[j]) {
							if (mirrors[0].items[i].id == storage[j]._id){
								mirrors[0].items[i].amount_before = storage[j].amount;
								storageCollection.update({"_id" : storage[j]._id},{
									"title" : storage[j].title,
									"amount" : mirrors[0].items[i].amount,
									"unit" : storage[j].unit,
									"ration" : storage[j].ration,
									"sell_price" : storage[j].sell_price,
									"deleted" : storage[j].deleted
								},function(e,doc){
									if(e){
										res.send('There was a problem');
									}
								});
								//storage[j].amount = mirrors[0].items[i].amount;
								break;
							}
							j++;
						}
						i++;
					}
					debtsCollection.find({},{},function(err,debts){
						var i = 0;
						if (mirrors[0].debts) {
							while (mirrors[0].debts[i]){
								var j = 0;
								var matched = 0;
								while (debts[j]) {
									if (mirrors[0].debts[i].debtor.slice(2) == debts[j]._id) {
										debtsCollection.update({"_id" : debts[j]._id},{
											"debtor" : debts[j].debtor,
											"amount" : parseFloat((debts[j].amount+'').replace(',','.')) + parseFloat((mirrors[0].debts[i].amount+'').replace(',','.')),
											"last_change" : mirrors[0].debts[i].amount,
											"last_change_date" : mirrors[0].date
										},function(e,doc){
											if(e){
												res.send('There was a problem');
											}
										});
										matched = 1;
									}
									j++;
								}
								if (matched==0) {
									debtsCollection.insert({
										"debtor" : mirrors[0].debts[i].debtor,
										"amount" : mirrors[0].debts[i].amount,
										"last_change" : mirrors[0].debts[i].amount,
										"last_change_date" : mirrors[0].date
									},function(e,doc){
										if(e){
											res.send('There was a problem');
										}
									});
								}
								i++;
							}
						}
						treasuryCollection.find({'_id' : BSON.ObjectID.createFromHexString(mirrors[0].treasury)},{},function(err,treasury){
							mirrors[0].treasury_status_before = treasury[0].status;
							treasuryCollection.update({"_id" : BSON.ObjectID.createFromHexString(mirrors[0].treasury)},{
								"title" : treasury[0].title,
								"status" : mirrors[0].treasury_stat
							},function(e,doc){
								if(e){
									res.send('There was a problem');
								}
							});
							
							mirrorsCollection.update({"_id" : mirrors[0]._id},{
								"date" : mirrors[0].date,
								"user" : mirrors[0].user,
								"treasury" : mirrors[0].treasury,
								"items" : mirrors[0].items,
								"treasury_stat" : mirrors[0].treasury_stat,
								"treasury_status_before" : mirrors[0].treasury_status_before,
								"debts" : mirrors[0].debts
							},function(e,doc){
								if(e){
									res.send('There was a problem');
								}
							});
							res.location('mirrorSummary'+mirror);
							res.redirect('mirrorSummary'+mirror);
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * mirrorSummary
 */
exports.mirrorSummary = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			var id = req.params.id;
			var mirrorsCollection = db.get('mirrorsCollection');
			var storageCollection = db.get('storageCollection');
			
			var treasuryCollection = db.get('treasuryCollection');
			var unitsCollection = db.get('unitsCollection');
			var userCollection = db.get('usercollection');
			var debtsCollection = db.get('debtsCollection');
			
			mirrorsCollection.find({'_id' : BSON.ObjectID.createFromHexString(id)},{},function(err,mirrors){
				storageCollection.find({},{},function(err,storage){
					treasuryCollection.find({},{},function(err,treasuries){
						unitsCollection.find({},{},function(err,units){
							userCollection.find({},{},function(err,users){
								debtsCollection.find({},{},function(err,debts){
									res.render('mirrorSummary',{
										"mirror" : mirrors[0],
										mirrorArr : JSON.stringify(mirrors[0]),
										storageArr : JSON.stringify(storage),
										unitsArr : JSON.stringify(units),
										debtsArr : JSON.stringify(debts),
										treasuriesArr : JSON.stringify(treasuries),
										usersArr : JSON.stringify(users)
									});
								});
							});
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

/*
 * debts
 */
exports.debts = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var debtsCollection = db.get('debtsCollection');
			debtsCollection.find({},{},function(err,debts){
				res.render('debts',{
					"debts" : debts
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}
/*
 * addDebtForm
 */
exports.addDebtForm = function(db){
	return function(req,res){
		if (req.session.user_id) {
				res.render('addDebt',{});
		}else{
			res.render('signIn');
		};	
	};
}
/*
 * addDebt
 */
exports.addDebt = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var debtsCollection = db.get('debtsCollection');
			//Get Input Submissions
			var debtor = req.body.debtor;
			var amount = req.body.amount;
			var last_change_date = req.body.last_change_date;
			
			debtsCollection.insert({
				"debtor" : debtor,
				"amount" : amount,
				"last_change" : amount,
				"last_change_date" : last_change_date
			},function(err,doc){
				if(err){
					res.send('There was a problem');
				} else {
					res.location('debts');
					res.redirect('debts');
				}
			});
		}else{
			res.render('signIn');
		};	
	};
}