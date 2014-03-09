$(document).ready(function(){
	treasuriesArr = treasuriesArr.replace(/&quot;/g,'"');
	treasuriesArr = eval("("+treasuriesArr+")");
	incomesSpendingsArr = incomesSpendingsArr.replace(/&quot;/g,'"');
	incomesSpendingsArr = eval("("+incomesSpendingsArr+")");
	
	var j=0;
	while (incomesSpendingsArr[j]){
		var i=0;
		while ((treasuriesArr[i])) {
			if (incomesSpendingsArr[j].treasury == treasuriesArr[i]._id) {
				incomesSpendingsArr[j].treasury = treasuriesArr[i].title;
			}
			i++;
		}
		j++;
	}
	i=0;
	jQuery('.incomeSpendingTable .treasury').each(function(){
		jQuery(this).text(incomesSpendingsArr[i].treasury);
		i++;
	});		
	alignTable();
});