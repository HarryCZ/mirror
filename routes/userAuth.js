var userAuth = function() {
	var userlist =  function(db){
		return function(req,res){
			var collection = db.get('usercollection');
			collection.find({},{},function(e,docs){
				res.render('userlist',{
					"userlist" : docs,
					title : "user_list"
				});
			});
		};
	};
}();
module.exports = userAuth;