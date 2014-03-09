$(document).ready(function(){
	usersArr = usersArr.replace(/&quot;/g,'"');
	usersArr = eval("("+usersArr+")");
	mirrorsArr = mirrorsArr.replace(/&quot;/g,'"');
	mirrorsArr = eval("("+mirrorsArr+")");
	treasuriesArr = treasuriesArr.replace(/&quot;/g,'"');
	treasuriesArr = eval("("+treasuriesArr+")");
	
	renderUserName();
	renderTreasuryName();	
	$('.mirrorsTable tbody tr').click(function(){
	  window.location = '/mirrorSummary'+$(this).attr('class');
	});
	alignTable();
});

function renderUserName() {
	var i=0;
	while ((mirrorsArr[i])) {
		var j = 0;
		while (usersArr[j]) {
			if (mirrorsArr[i].user == usersArr[j]._id) {
				mirrorsArr[i].user = usersArr[j].username;
			}
			j++;
		}
		i++;
	}
	var i=0;
	$('.mirrorsTable .user').each(function(){
		$(this).text(mirrorsArr[i].user);
		i++;
	});
}

function renderTreasuryName() {
	var i=0;
	while ((mirrorsArr[i])) {
		var j = 0;
		while (treasuriesArr[j]) {
			if (mirrorsArr[i].treasury == treasuriesArr[j]._id) {
				mirrorsArr[i].treasury = treasuriesArr[j].title;
			}
			j++;
		}
		i++;
	}
	var i=0;
	$('.mirrorsTable .treasury').each(function(){
		$(this).text(mirrorsArr[i].treasury);
		i++;
	});
}