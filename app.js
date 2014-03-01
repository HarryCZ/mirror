//Module Dependencies
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes');
var storagert = require('./routes/storage');
var purchase = require('./routes/purchase');
var user = require('./routes/user');
var treasury = require('./routes/treasury');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mirror');

//Set port number
var portnumber = 3000;

//Initialize Express
var app = express();
console.log('Express has been initialized');

function compile(str,path){
	return stylus(str)
	.set('filename', path)
	.use(nib())
}

//set sessions
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

//Set Views Folder
app.set('views',__dirname+'/views');

//Initialize Jade
app.set('view engine', 'jade');
console.log('Jade has been initialized');

//Stylus Middleware
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('mykey'));
app.use(express.session());
app.use(app.router);
app.use(stylus.middleware(
	{
		src:__dirname + '/public',
		compile: compile
	}
))
app.use(express.static(__dirname+'/public'));

app.get('/',routes.index);
//storage items
app.get('/storage',storagert.storage(db));
app.get('/storage_items',storagert.storageItems(db));
app.post('/addstorageitem',storagert.addstorageitem(db));
//units
app.get('/units',storagert.units(db));
app.post('/addunit',storagert.addunit(db));
//purchase
app.get('/purchase',purchase.purchase);
app.post('/addpurchase', purchase.addpurchase(db));
app.get('/addpurchaseitem', purchase.addpurchaseitem(db));
app.post('/writedbpurchaseitem', purchase.writedbpurchaseitem(db));
app.post('/confirmpurchase', purchase.confirmpurchase(db));
app.get('/purchasedetails:id', purchase.purchasedetails(db));
app.get('/purchaselist', purchase.purchaselist(db));
//users
app.get('/userlist',user.userlist(db));
app.post('/adduser',user.adduser(db));
app.get('/signIn',user.signIn);
app.post('/login', user.login(db));
//treasury
app.get('/treasury',treasury.treasury(db));
app.post('/addTreasury',treasury.addTreasury(db));
app.get('/incomesSpending',treasury.incomesSpending(db));
app.post('/addIncomeSpending',treasury.addIncomeSpending(db));

app.listen(portnumber);
console.log('Server is now running on port '+portnumber);