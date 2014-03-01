//Treasury
exports.treasury = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var treasuryCollection = db.get('treasuryCollection');
			treasuryCollection.find({},{},function(err,docs){
				res.render('treasury',{
					"treasuries" : docs,
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}
//addTreasury
exports.addTreasury = function(db){
	return function(req,res){
		if (req.session.user_id) {
			//Get Input Submissions
			var title = req.body.title;
			var status = req.body.status;
			
			var treasuryCollection = db.get('treasuryCollection');			
			treasuryCollection.insert({
				"title" : title,
				"status" : status,
				"deleted" : "0"
			},function(err,doc){
				if(err){
					res.send('There was a problem');
				} else {
					res.location('treasury');
					res.redirect('treasury');
				}
			});
		}else{
			res.render('signIn');
		};	
	};
}

//incomesSpending
exports.incomesSpending = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var incomesSpendingCollection = db.get('incomesSpendingCollection');
			var treasuryCollection = db.get('treasuryCollection');
			
			incomesSpendingCollection.find({},{},function(err,docs){
				treasuryCollection.find({},{},function(err,doc){
					res.render('incomesSpending',{
						"incomesSpendings" : docs,
						"treasuries" : doc
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

//addIncomeSpending
exports.addIncomeSpending = function(db){
	return function(req,res){
		if (req.session.user_id) {
			//Get Input Submissions
			var description = req.body.description;
			var date = req.body.date;
			var treasury = req.body.treasury;
			var amount = req.body.amount;
			
			var BSON = require('mongodb').BSONPure;
			
			var incomesSpendingCollection = db.get('incomesSpendingCollection');
			incomesSpendingCollection.insert({
				"description" : description,
				"date" : date,
				"treasury" : treasury,
				"amount" : amount
			},function(err,doc){
				if(err){
					res.send('There was a problem');
				} else {
					var treasuryCollection = db.get('treasuryCollection');
					treasuryCollection.find({"_id":BSON.ObjectID.createFromHexString(treasury)},{},function(e,docs){
						treasuryCollection.update({"_id" : BSON.ObjectID.createFromHexString(treasury)},{
							"title":docs[0].title,
							"status":parseInt(docs[0].status)+parseInt(amount)
						},function(e,doc){
							if(e){
								res.send('There was a problem');
							} else {
								res.location('treasury');
								res.redirect('treasury');
							}
						});
					});
				}
			});
		}else{
			res.render('signIn');
		};	
	};
}