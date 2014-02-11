//Purchase
exports.purchase = function(req,res){
	res.render('purchase',{title: 'Add new purchase'});
};

//Add Unit Form
exports.addpurchase =  function(db){
	return function(req,res){
		//Get Input Submissions
		var description = req.body.description;
		
		//Set Collection
		var collection = db.get('purchasecollection');
		
		//Submit to the DB
		collection.insert({
			"description" : description,
			"total_amount" : "null"
		},function(err,doc){
			if(err){
				res.send('There was a problem');
			} else {
				res.location('addpurchaseitem');
				res.redirect('addpurchaseitem');
			}
		});
	};
}; 

//Add item to purchase
exports.addpurchaseitem = function(db){
	return function(req,res){
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
						title:lastEntry.description
					});
				});
			});			
		});
	};
};

//Write item to db form
exports.writedbpurchaseitem = function(db){
	return function(req,res){
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
	};
}; 

//Confirm purchase
exports.confirmpurchase = function(db){
	return function(req,res){
		//Get Input Submissions
		var id = req.body.pid;
		var desc = req.body.pdesc;
		var totAmount=0;
		
		var purchaseitemscollection = db.get('purchaseitemscollection');
		purchaseitemscollection.find({'purchase' : id},{},function(e,doc){
			var i=0;
			while (doc[i]){
				totAmount += parseInt(doc[i].price); 
				i++;
			}
			
			//Set Collection
			var collection = db.get('purchasecollection');
			
			//Submit to the DB
			collection.update({"_id" : id},{
				"total_amount":totAmount.toString(),
				"description":desc
			},function(err,docs){
				if(err){
					res.send('There was a problem');
				} else {
					res.location('purchasedetails'+id);
					res.redirect('purchasedetails'+id);
				}
			});
		});
		
		
		
		
	};
};

//purchasedetails
exports.purchasedetails = function(db){
	return function(req,res){
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
						total_amount: purchase[0].total_amount
					});
				});
			});
		});
	};
};