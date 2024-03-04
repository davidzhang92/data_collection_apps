$(document).ready(function () {
	$('.displayed-username').text(localStorage.getItem('userName'));

	// set the zoom level based on resolution
	var screenWidth = window.innerWidth;
	var zoomLevel;

	if (screenWidth <= 1600) {
		zoomLevel = 0.8; 
	}
	$('.container').css('zoom', zoomLevel);
	// Calculate the screen width
	var screenWidth = window.screen.width;
	// Calculate the desired zoom level based on the screen width
	var zoomLevel = screenWidth / 1920; // Adjust  according to your base resolution
	// Apply the zoom level to the body
	$('.container').css('zoom', zoomLevel);
	

	//logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
	});
});


