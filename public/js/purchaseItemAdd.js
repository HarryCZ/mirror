$(document).ready(function(){
	treasuriesArr = treasuriesArr.replace(/&quot;/g,'"');
	treasuriesArr = eval("("+treasuriesArr+")");
	purchaseArr = purchaseArr.replace(/&quot;/g,'"');
	purchaseArr = eval("("+purchaseArr+")");
	storageArr = storageArr.replace(/&quot;/g,'"');
	storageArr = eval("("+storageArr+")");
	
	renderTreasuryName();
	if (purchaseArr.items) renderItemName();	
	alignTable();
});

function renderTreasuryName() {
	var i=0;
	while ((treasuriesArr[i])) {
		if (purchaseArr.treasury == treasuriesArr[i]._id) {
			purchaseArr.treasury = treasuriesArr[i].title;
		}
		i++;
	}
	var i=0;
	$('.treasury').each(function(){
		$(this).text(purchaseArr.treasury);
		i++;
	});
}

function renderItemName() {
	var i=0;
	while ((purchaseArr.items[i])) {
		var j = 0;
		while (storageArr[j]) {
			if (purchaseArr.items[i].item == storageArr[j]._id) {
				purchaseArr.items[i].item = storageArr[j].title;
			}
			j++;
		}
		i++;
	}
	var i=0;
	$('.purchaseItemsTable .item').each(function(){
		$(this).text(purchaseArr.items[i].item);
		i++;
	});
}