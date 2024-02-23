$(document).ready(function () {

    $('#edit-username').val(localStorage.getItem('userName'))

    var password = $('#new-password').val();
    var confirmPassword = $('#confirm-password').val();

    if (password === confirmPassword) {
        var validPassword = confirmPassword;
        }

		// $.ajax({
		// 	url: 'http://' + window.location.hostname + ':4000/api/update_user_api',
		// 	type: 'PATCH',
		// 	data: JSON.stringify({
		// 		old_password : $('#old-password').val(),
		// 		new_password : validPassword,
		// 		user_id: localStorage.getItem('userId')

		// 	}),
		// 	contentType: 'application/json',
		// 	success: function(response) {
		// 		// handle successful response
		// 		console.log(response);
	
		// 	},
		// 	error: function(xhr, status, error) {
		// 		if (xhr.status === 400) {
		// 			// The response status is 400, indicating a duplicate
		// 			alert(xhr.responseJSON.message);
					
		// 		} else {
		// 			console.error(error);
		// 			alert('An error occurred while changing the password.');
		// 		}
		// 		console.error(error);
		// 	}
		// });

    });
