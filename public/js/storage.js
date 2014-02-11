$(document).ready(function(){
	items = items.replace(/&quot;/g,'"');
	itemsArr = eval("("+items+")");
	storage = storage.replace(/&quot;/g,'"');
	storageArr = eval("("+storage+")");
	var i=0; 
	var j=0;
	var matched = 0;
	while (storageArr[j]){
		while ((itemsArr[i])&&(matched==0)) {
			if (storageArr[j].storage_item == itemsArr[i]._id) {
				storageArr[j].storage_item = itemsArr[i].title;
				matched = 1;
			}
			i++;
		}
		j++;
	}
	i=0;
	jQuery('.usertable .title').each(function(){
		jQuery(this).text(storageArr[i].storage_item);
		i++;
	});
	//jQuery('.usertable .title')[j].text(itemsArr[i].title);
				
})