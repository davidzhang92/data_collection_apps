$(document).ready(function () {

	$('#cancel').click(function(e){
        e.preventDefault();
        if(window.history.length > 1){
            window.history.back();
        } else {
            window.location.href = '/menus/dashboard/dashboard.html'; 
        }
    });
	$('#username').val(localStorage.getItem('userName'))


	$('.body-form').on('submit', function(event) {
		event.preventDefault();
		var password = $('#new-password').val();
		var confirmPassword = $('#confirm-password').val();
	
		if (password === confirmPassword) {
			var validPassword = confirmPassword;
			} else {
				alert('Error: Password doesn\'t match, try again.');
				password = $('#new-password').val('');
				confirmPassword = $('#confirm-password').val('');
				validPassword =''
				return;
			}
	
			$.ajax({
				url: 'http://' + window.location.hostname + ':4000/api/user_profiles',
				type: 'PATCH',
				data: JSON.stringify({
					old_password : $('#old-password').val(),
					new_password : validPassword,
					user_id: localStorage.getItem('userId')
	
				}),
				contentType: 'application/json',
				beforeSend: function(xhr) { 
					xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
				},
				success: function(response) {
					// handle successful response
					$('#old-password').val('');
					$('#new-password').val('');
					$('#confirm-password').val('');
					alert(response.message);
					console.log(response);
		
				},
				error: function(xhr, status, error) {
					if (xhr.status >= 400 && xhr.status < 600) {
						// The response status is 400, indicating an error
						alert(xhr.responseJSON.message);
						
					} else {
						console.error(error);
						alert('An error occurred while changing the password.');
					}
					console.error(error);
				}
			});
	});
    

    });
