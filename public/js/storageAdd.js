$(document).ready(function(){
	units = units.replace(/&quot;/g,'"');
	unitsArr = eval("("+units+")");
	var selectedPcgUnit = jQuery('#package_unit').val();
	unit = null;
	var i=0;
	while ((unitsArr[i])&&(unit==null)){
		if (unitsArr[i]._id == selectedPcgUnit) {
			unit = unitsArr[i];
		}
	}
	jQuery('#ration_unit').html('<option value="0">'+unit.title+'</option><option value="1">'+unit.subunit+'</option>');
})