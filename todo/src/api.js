function fetchData(URL) {
	const request = new XMLHttpRequest();

	return new Promise((resolve, reject) => {
		request.open('GET', URL);
		request.onreadystatechange = function() {
			if (request.readyState === request.DONE && request.status === 200) {
				resolve(JSON.parse(request.response));
			}
		};
		request.send();
	});
}

function putData(URL, data) {
	const request = new XMLHttpRequest();

	return new Promise((resolve, reject) => {
		request.open('POST', URL);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onload = function() {
			resolve(JSON.parse(this.responseText).name);
		};
		request.send(JSON.stringify(data));
	});
}

function updateData(URL, data) {
	const request = new XMLHttpRequest();

	return new Promise((resolve, reject) => {
		request.open('PATCH', URL);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onload = function() {
			resolve(JSON.parse(this.responseText).name);
		};
		request.send(JSON.stringify(data));
	});
}

function deleteData(URL, data) {
	const request = new XMLHttpRequest();

	return new Promise((resolve, reject) => {
		request.open('DELETE', URL);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onload = function() {
			resolve(JSON.parse(this.responseText));
		};
		request.send(JSON.stringify(data));
	});
}

export { fetchData, putData, updateData, deleteData };
