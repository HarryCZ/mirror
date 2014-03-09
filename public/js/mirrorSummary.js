var totItemsPrice = 0;
var totDebts = 0;
var corection = 0;
	
$(document).ready(function(){
	mirrorArr = mirrorArr.replace(/&quot;/g,'"');
	mirrorArr = eval("("+mirrorArr+")");
	storageArr = storageArr.replace(/&quot;/g,'"');
	storageArr = eval("("+storageArr+")");
	unitsArr = unitsArr.replace(/&quot;/g,'"');
	unitsArr = eval("("+unitsArr+")");
	usersArr = usersArr.replace(/&quot;/g,'"');
	usersArr = eval("("+usersArr+")");	
	treasuriesArr = treasuriesArr.replace(/&quot;/g,'"');
	treasuriesArr = eval("("+treasuriesArr+")");	
	debtsArr = debtsArr.replace(/&quot;/g,'"');
	debtsArr = eval("("+debtsArr+")");	
	
	countItems();
	countDebts();
	renderUserName();
	renderTreasuryName();
	renderItemNames();
	if(mirrorArr.debts) renderDebtorNames();
	
	corection = (parseFloat((mirrorArr.treasury_stat+'').replace(',','.')) + totItemsPrice + totDebts) - parseFloat((mirrorArr.treasury_status_before+'').replace(',','.'));
	$('.corection').text(corection);
	
	alignTable();
});

function countItems() {
	var i = 0;
	while ($('.mirrorItemsTable .item')[i]) {
		var diference = 0;
		var itemTotsold = 0;
		var j = 0;
		while (mirrorArr.items[j]) {
			if ($($('.mirrorItemsTable .item')[i]).children('.title').text() == mirrorArr.items[j].id) {
				var amountBefore = parseFloat((mirrorArr.items[j].amount_before+'').replace(',','.'));
				var amount = parseFloat((mirrorArr.items[j].amount+'').replace(',','.'));
				diference = Math.round((amountBefore - amount)*10)/10;
				break;
			}
			j++;
		}
		var k = 0;
		while (storageArr[k]) {
			if ($($('.mirrorItemsTable .item')[i]).children('.title').text() == storageArr[k]._id) {
				var ration =  parseFloat((storageArr[k].ration+'').replace(',','.'));
				var price = storageArr[k].sell_price;
				var pkg = storageArr[k].package; 
				var rationsSold = (diference)/ration;
				var totPrice = rationsSold*price;
				totItemsPrice += totPrice;
				$($('.mirrorItemsTable .item')[i]).append('<td class="column-9 odd diference">'+diference+'</td><td class="column-10 rationsSold">'+rationsSold+'</td><td class="column-11 totPrice odd">'+totPrice+'</td>');
				break;
			}
			k++;
		}
		i++;
	}
	$('.totalItemsPrice').text(totItemsPrice);
}

function countDebts() {
	var i = 0;
	if (mirrorArr.debts) {
		while (mirrorArr.debts[i]) {
			totDebts += parseFloat((mirrorArr.debts[i].amount+'').replace(',','.'));
			i++;
		}
	}
	$('.totalDebts').text(totDebts);
}

function renderUserName() {
	var i=0;
	while ((usersArr[i])) {
		if (mirrorArr.user == usersArr[i]._id) {
			mirrorArr.user = usersArr[i].username;
		}
		i++;
	}
	var i=0;
	$('.user').each(function(){
		$(this).text(mirrorArr.user);
		i++;
	});
}

function renderTreasuryName() {
	var i=0;
	while ((treasuriesArr[i])) {
		if (mirrorArr.treasury == treasuriesArr[i]._id) {
			mirrorArr.treasury = treasuriesArr[i].title;
		}
		i++;
	}
	var i=0;
	$('.treasury').each(function(){
		$(this).text(mirrorArr.treasury);
		i++;
	});
}

function renderItemNames() {
	var i=0;
	while ((mirrorArr.items[i])) {
		var j = 0;
		while (storageArr[j]) {
			if (mirrorArr.items[i].id == storageArr[j]._id) {
				mirrorArr.items[i].id = storageArr[j].title;
			}
			j++;
		}
		i++;
	}
	var i=0;
	$('.mirrorItemsTable .title').each(function(){
		$(this).text(mirrorArr.items[i].id);
		i++;
	});
}

function renderDebtorNames() {
	var i=0;
	while ((mirrorArr.debts[i])) {
		var j = 0;
		while (debtsArr[j]) {
			if (mirrorArr.debts[i].debtor == 'id'+debtsArr[j]._id) {
				mirrorArr.debts[i].debtor = debtsArr[j].debtor;
			}
			j++;
		}
		i++;
	}
	var i=0;
	$('.mirrorDebtsTable .debtor').each(function(){
		$(this).text(mirrorArr.debts[i].debtor);
		i++;
	});
}