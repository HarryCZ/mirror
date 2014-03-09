/*
 * Purchase List
 */
exports.purchaselist = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var purchaseCollection = db.get('purchaseCollection');
			var treasuryCollection = db.get('treasuryCollection');
			
			purchaseCollection.find({},{},function(e,purchases){
				treasuryCollection.find({},{},function(err,treasuries){
					res.render('purchaselist',{
						"purchases" : purchases,
						"treasuries" : treasuries
					});
				});
			});
		}else{
			res.render('signIn');
		};
	};
};

/*
 * addpurchase
 */
exports.addpurchase =  function(db){
	return function(req,res){
		if (req.session.user_id) {
			//Get Input Submissions
			var description = req.body.description;
			var date = req.body.date;
			var supplier = req.body.supplier;
			var treasury = req.body.treasury;
			
			//Set Collection
			var purchaseCollection = db.get('purchaseCollection');

			//Submit to the DB
			purchaseCollection.insert({
				"description" : description,
				"date" : date,
				"supplier" : supplier,
				"treasury" : treasury,
				"total_amount" : "null"
			},function(err,doc){
				if(err){
					res.send('There was a problem');
				} else {
					res.location('addpurchaseitem');
					res.redirect('addpurchaseitem');
				}
			});
		}else{
			res.render('signIn');
		};
	};
}; 

/*
 * Add item to purchase
 */
exports.addpurchaseitem = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var purchaseCollection = db.get('purchaseCollection');
			var storageCollection = db.get('storageCollection');
			var treasuryCollection = db.get('treasuryCollection');
			purchaseCollection.find({},{},function(err,purchases){
				storageCollection.find({},{},function(err,storage){
					treasuryCollection.find({},{},function(err,treasuries){
						var purchase = purchases.sort({_id:1})[purchases.length-1];
						res.render('addpurchaseitem',{
							"purchase" : purchase,
							"storage" : storage,
							purchaseArr : JSON.stringify(purchase),
							storageArr : JSON.stringify(storage),
							treasuriesArr : JSON.stringify(treasuries)							
						});	
					});
				});
			});
		}else{
			res.render('signIn');
		};
	};
};

/*
 * Write item to db form
 */
exports.writedbpurchaseitem = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			//Get Input Submissions
			var item = req.body.item;
			var amount = req.body.amount;
			var price = req.body.price;
			var purchase = req.body.purchase;
			
			var newItem = {'item' : item, 'amount' : amount, 'price' : price}
			
			//Set Collection
			var purchaseCollection = db.get('purchaseCollection');
			purchaseCollection.find({'_id' : BSON.ObjectID.createFromHexString(purchase)},{},function(err,purchases){
				var i = 0;
				var items = new Array();
				var totAmoount = 0;
				if (purchases[0].items) {
					while (purchases[0].items[i]) {
						items[i] = purchases[0].items[i];
						totAmoount += parseFloat((purchases[0].items[i].price+'').replace(',','.'));
						i++;
					}
				}
				totAmoount += parseFloat((price+'').replace(',','.'));
				items[i] = newItem;
				//Submit to the DB
				purchaseCollection.update({"_id" : BSON.ObjectID.createFromHexString(purchase)},{
					"description" : purchases[0].description,
					"date" : purchases[0].date,
					"supplier" : purchases[0].supplier,
					"treasury" : purchases[0].treasury,
					"total_amount" : totAmoount,
					"items" :  items
				},function(err,docs){
					if(err){
						res.send('There was a problem adding purhase');
					} else {
						res.location('addpurchaseitem');
						res.redirect('addpurchaseitem');
					}
				});
			});
		}else{
			res.render('signIn');
		};
	};
}; 

/*
 * remPurchItem
 */
exports.remPurchItem = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			//Get Input Submissions
			var id = req.body.remId;
			var purchase = req.body.purchase;
			
			//Set Collection
			var purchaseCollection = db.get('purchaseCollection');
			purchaseCollection.find({'_id' : BSON.ObjectID.createFromHexString(purchase)},{},function(err,purchases){
				var i = 0;
				var j = 0;
				var items = new Array();
				var totAmoount = 0;
				while (purchases[0].items[i]) {
					if (id != purchases[0].items[i].item) {
						items[j] = purchases[0].items[i];
						totAmoount += parseFloat((purchases[0].items[i].price+'').replace(',','.'));
						j++;
					}
					i++;
				}
				//Submit to the DB
				purchaseCollection.update({"_id" : BSON.ObjectID.createFromHexString(purchase)},{
					"description" : purchases[0].description,
					"date" : purchases[0].date,
					"supplier" : purchases[0].supplier,
					"treasury" : purchases[0].treasury,
					"total_amount" : totAmoount,
					"items" :  items
				},function(err,docs){
					if(err){
						res.send('There was a problem adding purhase');
					} else {
						res.location('addpurchaseitem');
						res.redirect('addpurchaseitem');
					}
				});
			});
		}else{
			res.render('signIn');
		};
	};
};
/*
 * Confirm purchase
 */
exports.confirmpurchase = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;

			//Get Input Submissions
			var purchase = req.body.pid;
			
			var purchaseCollection = db.get('purchaseCollection');
			var storageCollection = db.get('storageCollection');
			var treasuryCollection = db.get('treasuryCollection');
			
			purchaseCollection.find({'_id' : BSON.ObjectID.createFromHexString(purchase)},{},function(err,purchases){			
				storageCollection.find({},{},function(err,storage){
					var i = 0;
					while (purchases[0].items[i]) {
						var j = 0;
						while (storage[j]) {
							if (purchases[0].items[i].item == storage[j]._id) {
								storage[j].amount = parseFloat((storage[j].amount+'').replace(',','.'));
								purchases[0].items[i].amount = parseFloat((purchases[0].items[i].amount+'').replace(',','.'));
								
								storageCollection.update({"_id" : storage[j]._id},{
									"title" : storage[j].title,
									"amount" : storage[j].amount + purchases[0].items[i].amount,
									"unit" : storage[j].unit,
									"ration" : storage[j].ration,
									"sell_price" : storage[j].sell_price,
									"deleted" : storage[j].deleted
								},function(e,doc){
									if(e){
										res.send('There was a problem');
									}
								});
							}
							j++;
						}
						i++;
					}
					treasuryCollection.find({'_id' : BSON.ObjectID.createFromHexString(purchases[0].treasury)},{},function(err,treasury){
						console.log('old amount: '+treasury[0].status + ' add:' + parseFloat((purchases[0].total_amount+'').replace(',','.')));
						treasuryCollection.update({"_id" : purchases[0].treasury},{
							"title" : treasury[0].title,
							"status" : parseFloat((treasury[0].status+'').replace(',','.')) - parseFloat((purchases[0].total_amount+'').replace(',','.'))
						},function(e,doc){
							if(e){
								res.send('There was a problem');
							}else{
								res.location('purchasedetails'+purchase);
								res.redirect('purchasedetails'+purchase);
							}
						});
					});
				});
			});
			
		}else{
			res.render('signIn');
		};
	};
};

/*
 * purchasedetails
 */
exports.purchasedetails = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			
			var purchase = req.params.id;
			var purchaseCollection = db.get('purchaseCollection');
			var storageCollection = db.get('storageCollection');
			var treasuryCollection = db.get('treasuryCollection');

			purchaseCollection.find({"_id" : BSON.ObjectID.createFromHexString(purchase)},{},function(err,purchases){
				storageCollection.find({},{},function(err,storage){
					treasuryCollection.find({},{},function(err,treasuries){
						res.render('purchasedetails',{
							"purchases":purchases[0],
							purchaseArr : JSON.stringify(purchases[0]),
							storageArr : JSON.stringify(storage),
							treasuriesArr : JSON.stringify(treasuries)	
						});	
					});
				});
			});
		}else{
			res.render('signIn');
		};
	};
};










//Purchase
exports.purchase = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var treasuryCollection = db.get('treasuryCollection');
				
			treasuryCollection.find({},{},function(err,treasuries){
				res.render('purchase',{
					"treasuries" : treasuries
				});
			});
		}else{
			res.render('signIn');
		};	
	}
};
