$(document).ready(function(){
	unitsArr = unitsArr.replace(/&quot;/g,'"');
	unitsArr = eval("("+unitsArr+")");
	storageArr = storageArr.replace(/&quot;/g,'"');
	storageArr = eval("("+storageArr+")");
	
	var j=0;
	while (storageArr[j]){
		var i=0;
		while ((unitsArr[i])) {
			if (storageArr[j].unit == unitsArr[i]._id) {
				storageArr[j].unit = unitsArr[i].sign;
			}
			i++;
		}
		j++;
	}
	var i=0;
	jQuery('.storageTable .amount').each(function(){
		jQuery(this).append(' '+storageArr[i].unit);
		i++;
	});
	i=0;
	jQuery('.storageTable .ration').each(function(){
		jQuery(this).append(' '+storageArr[i].unit);
		i++;
	});
	alignTable();
});