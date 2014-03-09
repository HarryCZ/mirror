$(document).ready(function(){
	storageArr = storageArr.replace(/&quot;/g,'"');
	storageArr = eval("("+storageArr+")");
	unitsArr = unitsArr.replace(/&quot;/g,'"');
	unitsArr = eval("("+unitsArr+")");
	treasuriesArr = treasuriesArr.replace(/&quot;/g,'"');
	treasuriesArr = eval("("+treasuriesArr+")");
	usersArr = usersArr.replace(/&quot;/g,'"');
	usersArr = eval("("+usersArr+")");
	mirrorArr = mirrorArr.replace(/&quot;/g,'"');
	mirrorArr = eval("("+mirrorArr+")");
	
	renderMirrorItem();
	renderTreasuryName();
	renderUserName();
	
	alignTable();
	alignItemsForm()
});

function renderMirrorItem() {
	var j=0;
	while (storageArr[j]){
		
		var k = 0;
		while (unitsArr[k]) {
			if (storageArr[j].unit == unitsArr[k]._id) {
				storageArr[j].unit = unitsArr[k].sign;
				break;
			}
			k++;
		}
		j++;
	}
	i=0;
	jQuery('.updMirrorItemsStaus .item').each(function(){
		jQuery(this).append('<p class="unit">'+storageArr[i].unit+'</p>');
		i++;
	});
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

function alignItemsForm() {
	var i=0;
	var maxLength = 0;
	
	$('.formSelectTitle').each(function(){
		if (maxLength < $($('.formSelectTitle')[i]).width()) {
			maxLength = $($('.formSelectTitle')[i]).width();
		}
		i++;
	});
	$($('.formSelectTitle')).width(maxLength);
}