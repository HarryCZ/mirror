/*
 * Treasury
 */
exports.treasury = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var treasuryCollection = db.get('treasuryCollection');
			treasuryCollection.find({},{},function(err,treasuries){
				res.render('treasury',{
					"treasuries" : treasuries,
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}
/*
 * addTreasuryForm
 */
exports.addTreasuryForm = function(db){
	return function(req,res){
		if (req.session.user_id) {
			res.render('addTreasury',{});
		}else{
			res.render('signIn');
		};
	};
};
/* 
 * remTreasury
 */
exports.remTreasury = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var id = req.body.remId;
			var treasuryCollection = db.get('treasuryCollection');
			treasuryCollection.remove({'_id' : id},{},function(err,storage){
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
};
/*
 * addTreasury
 */
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

/*
 * incomesSpending
 */
exports.incomesSpending = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var incomesSpendingCollection = db.get('incomesSpendingCollection');
			var treasuryCollection = db.get('treasuryCollection');
			
			incomesSpendingCollection.find({},{},function(err,incomesSpendings){
				treasuryCollection.find({},{},function(err,treasuries){
					res.render('incomesSpending',{
						"incomesSpendings" : incomesSpendings,
						"treasuries" : treasuries,
						treasuriesArr :JSON.stringify(treasuries),
						incomesSpendingsArr : JSON.stringify(incomesSpendings)
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}
//addIncomeSpendingForm
exports.addIncomeSpendingForm = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var incomesSpendingCollection = db.get('incomesSpendingCollection');
			var treasuryCollection = db.get('treasuryCollection');
			
			incomesSpendingCollection.find({},{},function(err,incomesSpendings){
				treasuryCollection.find({},{},function(err,treasuries){
					res.render('addIncomeSpending',{
						"incomesSpendings" : incomesSpendings,
						"treasuries" : treasuries,
						treasuriesArr :JSON.stringify(treasuries),
						incomesSpendingsArr : JSON.stringify(incomesSpendings)
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

//treasuryTransfer
exports.treasuryTransfer = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var treasuryCollection = db.get('treasuryCollection');
			treasuryCollection.find({},{},function(err,treasuries){
				res.render('treasuryTransfer',{
					"treasuries" : treasuries,
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}

//confirmTreasuryTransfer
exports.confirmTreasuryTransfer = function(db){
	return function(req,res){
		if (req.session.user_id) {
			var treasuryCollection = db.get('treasuryCollection');
			var incomesSpendingCollection = db.get('incomesSpendingCollection');
			treasuryCollection.find({},{},function(err,treasuries){
				incomesSpendingCollection.find({},{},function(err,treasuries){
					var BSON = require('mongodb').BSONPure;
					
					//Get Input Submissions
					var treasuryFrom = req.body.treasuryFrom;
					var treasuryTo = req.body.treasuryTo;
					var amount = req.body.amount;
					var date = req.body.date;
					
					treasuryCollection.find({"_id":BSON.ObjectID.createFromHexString(treasuryFrom)},{},function(e,treasuryFromArr){
						treasuryCollection.update({"_id" : BSON.ObjectID.createFromHexString(treasuryFrom)},{
							"title":treasuryFromArr[0].title,
							"status":treasuryFromArr[0].status - amount
						},function(e,doc){
							if(e){
								res.send('There was a problem');
							} else {
								treasuryCollection.find({"_id":BSON.ObjectID.createFromHexString(treasuryTo)},{},function(e,treasuryToArr){
									treasuryCollection.update({"_id" : BSON.ObjectID.createFromHexString(treasuryTo)},{
										"title":treasuryToArr[0].title,
										"status" : parseFloat((treasuryToArr[0].status+'').replace(',','.')) + parseFloat((amount+'').replace(',','.'))
									},function(e,docs){
										if(e){
											res.send('There was a problem');
										} else {
											incomesSpendingCollection.insert({
												"description" : 'transfer_to '+treasuryTo,
												"date" : date,
												"treasury" : treasuryFrom,
												"amount" : -amount
											},function (e,d){
												if(e){
													res.send('There was a problem');
												}else{
													incomesSpendingCollection.insert({
														"description" : 'transfer_from '+treasuryFrom,
														"date" : date,
														"treasury" : treasuryTo,
														"amount" : amount
													},function (e,d){
														if(e){
															res.send('There was a problem');
														}else{
															res.location('treasury');
															res.redirect('treasury');
														}
													});
												}
											});
											
										}
									});
								});
							}
						});
					});
				});
			});
		}else{
			res.render('signIn');
		};	
	};
}