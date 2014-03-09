$(document).ready(function() {
	$('.purchasetable tbody tr').click(function(){
	  window.location = '/purchaseDetails'+$(this).attr('class');
	});
	alignTable();
});