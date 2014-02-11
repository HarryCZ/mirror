$(document).ready(function(){
	sitems = sitems.replace(/&quot;/g,'"');
	sitemsArr = eval("("+sitems+")");
	jQuery('.item_title').each(function(){
		var curId = jQuery(this).text().slice(1,jQuery(this).text().length-1);;
		var i = 0;
		var matched = 0;
		while ((sitemsArr[i])&&(matched==0)){
			if (sitemsArr[i]._id == curId){
				jQuery(this).text(sitemsArr[i].title);
				matched++;
			}
			i++;
		}
	});
});