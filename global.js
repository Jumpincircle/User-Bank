var userListData = [];
$(document).ready(function() {
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$('#userList table tbody').on('click', 'td a.linkedituser', toggleUpdate);
	$('#btnEditUser').on('click', editUser);
	$('#btnCancelUpdate').on('click', $('#editUser').hide());
})

function populateTable() {
	var tableContent = "";
	$.getJSON('/users/userlist', function(data) {
		userListData = data;
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
 			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
			tableContent += '</tr>';
		});
		$('#userList table tbody').html(tableContent);
	})
}

function showUserInfo(event) {
	event.preventDefault();
	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) {
		return arrayItem.username;
	}).indexOf(thisUserName);

	var thisUserObject = userListData[arrayPosition];

	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}

function addUser(event) {
	event.preventDefault();
	var errors = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	if (errors === 0) {
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		$.ajax({
			type: 'POST',
			data : newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {
			if (response.msg === '') {
				$('#addUser fieldset input').val('');
				populateTable();
			} else {
				alert('Error Occurred: ' + response.msg);
			}
		})
	} else {
		alert('Fill out all fields');
		return false;
	}
}

function deleteUser(event) {
	event.preventDefault();
	var confirmation = confirm('Are you sure you want to delete this user?');

	if (confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(res) {
			if (res.msg === '') {
			}
			else {
				alert('Error: ' + res.msg);
			}
			populateTable();
		})
	}
	else {
		return false;
	}
}

function toggleUpdate(event) {
	event.preventDefault();
	$('#editUser').show();
	$.ajax({
		type: 'GET',
		url: '/users/edituser/' + $(this).attr('rel')
	}).done(function(res) {
		$('#editUser fieldset input#editUserName').val() = res.username;
		$('#editUser fieldset input#editUserEmail').val() = res.email;
		$('#editUser fieldset input#editUserFullname').val() = res.fullname;
		$('#editUser fieldset input#editUserAge').val() = res.age;
		$('#editUser fieldset input#editUserLocation').val() = res.location;
		$('#editUser fieldset input#editUserGender').val() = res.gender;
	}
}

function editUser(event) {
	event.preventDefault();
	var newUser = {
		'username': $('#editUser fieldset input#editUserName').val(),
		'email': $('#editUser fieldset input#editUserEmail').val(),
		'fullname': $('#editUser fieldset input#editUserFullname').val(),
		'age': $('#editUser fieldset input#editUserAge').val(),
		'location': $('#editUser fieldset input#editUserLocation').val(),
		'gender': $('#editUser fieldset input#editUserGender').val()
	}

	$.ajax({
		type: 'PUT',
		data : newUser,
		url: '/users/edituser/' + $(this).attr('rel'),
		dataType: 'JSON'
	}).done(function(response) {
		if (response.msg === '') {
			$('#edituser').hide();
			populateTable();
		} else {
			alert('Error Occurred: ' + response.msg);
		}
	})
}
