$(document).ready(function(){
	items = items.replace(/&quot;/g,'"');
	itemsArr = eval("("+items+")");
	storage = storage.replace(/&quot;/g,'"');
	storageArr = eval("("+storage+")");
	var i=0;
	var matched = 0;
	while ((itemsArr[i])&&(matched==0)) {
		if (storageArr[0].storage_item == itemsArr[i]._id) {
			jQuery('.usertable .title').text(itemsArr[i].title);
			matched = 1;
		}
		i++;
	}
})