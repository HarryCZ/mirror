$(document).ready(function(){
	unitsArr = unitsArr.replace(/&quot;/g,'"');
	unitsArr = eval("("+unitsArr+")");
	mirrorArr = mirrorArr.replace(/&quot;/g,'"');
	mirrorArr = eval("("+mirrorArr+")");
	storageArr = storageArr.replace(/&quot;/g,'"');
	storageArr = eval("("+storageArr+")");
	usersArr = usersArr.replace(/&quot;/g,'"');
	usersArr = eval("("+usersArr+")");	
	treasuriesArr = treasuriesArr.replace(/&quot;/g,'"');
	treasuriesArr = eval("("+treasuriesArr+")");	
	
	renderUserName();
	renderTreasuryName();
	renderItemNames();
	
	alignTable();
});

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
	$('.mirrorItems .title').each(function(){
		$(this).text(mirrorArr.items[i].id);
		i++;
	});
}