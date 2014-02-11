$(document).ready(function(){
	storageItems = storageItems.replace(/&quot;/g,'"');
	storageItemsArr = eval("("+storageItems+")");
	jQuery('.item_title').each(function(){
		var i = 0;
		var matched = 0;
		var itemId = jQuery(this).text();
		itemId = itemId.slice(1,itemId.length-1);
		while ((storageItemsArr[i])&&(matched==0)){
			if (storageItemsArr[i]._id==itemId){
				jQuery(this).text(storageItemsArr[i].title);
				matched++;
			}
		i++;
		}
	});
})