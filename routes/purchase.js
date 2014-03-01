//Purchase
exports.purchase = function(req,res){
	if (req.session.user_id) {
		res.render('purchase',{title: 'Add new purchase'});
	}else{
		res.render('signIn');
	};	
};

//Add Unit Form
exports.addpurchase =  function(db){
	return function(req,res){
		if (req.session.user_id) {
			//Get Input Submissions
			var description = req.body.description;
			var date = req.body.date;
			var supplier = req.body.supplier;
			var treasury = req.body.treasury;
			
			//Set Collection
			var collection = db.get('purchasecollection');

			//Submit to the DB
			collection.insert({
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

//Add item to purchase
exports.addpurchaseitem = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var purchasecollection = db.get('purchasecollection');
			purchasecollection.find({},{},function(err,docs){
				var lastEntry = docs.sort({_id:1})[docs.length-1];
				var storageitemscollection = db.get('storageitemscollection');
				storageitemscollection.find({},{},function(e,doc){
					var purchaseitemscollection = db.get('purchaseitemscollection');
					purchaseitemscollection.find({"purchase":lastEntry._id.toString()},{},function(e,pitem){
						res.render('addpurchaseitem',{
							"storageIt":doc,
							storageItems:JSON.stringify(doc),
							"items":pitem,
							id:lastEntry._id,
							title:lastEntry.description,
							date:lastEntry.date,
							supplier:lastEntry.supplier,
							treasury:lastEntry.treasury
						});
					});
				});			
			});
		}else{
			res.render('signIn');
		};
	};
};

//Write item to db form
exports.writedbpurchaseitem = function(db){
	return function(req,res){
		if (req.session.user_id) {
			//Get Input Submissions
			var item = req.body.item;
			var amount = req.body.amount;
			var price = req.body.price;
			var purchase = req.body.purchase;
			
			//Set Collection
			var collection = db.get('purchaseitemscollection');
			
			//Submit to the DB
			collection.insert({
				"storage_item" : item,
				"amount":amount,
				"price":price,
				"purchase":purchase
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

//Confirm purchase
exports.confirmpurchase = function(db){
	return function(req,res){
		if (req.session.user_id) {
			//Get Input Submissions
			var id = req.body.pid;
			console.log('Id: '+id);
			var desc = req.body.pdesc;
			var date = req.body.pdate;
			var supplier = req.body.psupplier;
			var treasury = req.body.ptreasury;
			var totAmount=0;
			
			var BSON = require('mongodb').BSONPure;
			
			var purchaseitemscollection = db.get('purchaseitemscollection');
			purchaseitemscollection.find({'purchase' : id},{},function(e,doc){
				var storagecollection = db.get('storagecollection');
				storagecollection.find({},{},function(err,storage){
					var i=0;
					while (doc[i]){
						totAmount += parseInt(doc[i].price);
						var j=0;
						var matched = 0;
						while ((storage[j])&&(matched==0)) {
							console.log('DEBUG LINE '+j+" Pitem: "+doc[i].storage_item+" Storage: "+storage[j].storage_item);
							if (doc[i].storage_item==storage[j].storage_item) {
								console.log('Actual: '+parseInt(storage[j].amount)+' New: '+parseInt(doc[i].amount));
								storage[j].amount = parseInt(storage[j].amount) + parseInt(doc[i].amount);
								matched++;
								storagecollection.update({"_id":storage[j]._id},{
									"storage_item":storage[j].storage_item,
									"amount":storage[j].amount
								},function(error,d){
									if(error){
										res.send('There was a problem adding amount to storage');
									}else{
										var treasuryCollection = db.get('treasuryCollection');
										treasuryCollection.find({'_id' : BSON.ObjectID.createFromHexString(treasury)},{},function(e,docs){
											treasuryCollection.update({"_id" : BSON.ObjectID.createFromHexString(treasury)},{
												"title":docs[0].title,
												"status":parseInt(docs[0].status)-totAmount
											},function(e,dc){
												if(e){
													res.send('There was a problem');
												}
											});
										});
									}
								});
							}
							j++;
						}
						i++;
					}
					
					//Set Collection
					var collection = db.get('purchasecollection');
					
					//Submit to the DB
					collection.update({"_id" : id},{
						"total_amount":totAmount.toString(),
						"description":desc,
						"date":date,
						"supplier":supplier,
						"treasury":treasury
					},function(err,docs){
						if(err){
							res.send('There was a problem adding purhase');
						} else {
							console.log('collage updated');
							res.location('purchasedetails'+id);
							res.redirect('purchasedetails'+id);
						}
					});
					
				
				});
			});
		}else{
			res.render('signIn');
		};
	};
};

//purchasedetails
exports.purchasedetails = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var BSON = require('mongodb').BSONPure;
			var purchasecollection = db.get('purchasecollection');
			var purchaseitemscollection = db.get('purchaseitemscollection');
			var storageitemscollection = db.get('storageitemscollection');
			var idObj = BSON.ObjectID.createFromHexString(req.params.id);
			purchasecollection.find({"_id":idObj},{},function(err,purchase){
				purchaseitemscollection.find({"purchase":req.params.id},{},function(e,pitems){
					storageitemscollection.find({},{},function(e,sitems){
					
					res.render('purchasedetails',{
							"pitems":pitems,
							sitems:JSON.stringify(sitems),
							title: purchase[0].description,
							total_amount: purchase[0].total_amount,
							date: purchase[0].date,
							supplier: purchase[0].supplier,
							treasury: purchase[0].treasury
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};
	};
};

//Purchase List
exports.purchaselist = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var collection = db.get('purchasecollection');
			var treasuryCollection = db.get('treasuryCollection');
			
			collection.find({},{},function(e,docs){
				treasuryCollection.find({},{},function(e,doc){
					res.render('purchaselist',{
						"purchases" : docs,
						"treasuries" : doc,
						title : "purchases"
					});
				});
			});
		}else{
			res.render('signIn');
		};
	};
};