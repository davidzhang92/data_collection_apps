$(document).ready(function () {
	$('.displayed-username').text(localStorage.getItem('userName'));

	//logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
	});
});


