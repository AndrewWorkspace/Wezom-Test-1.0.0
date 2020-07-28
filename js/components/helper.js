export function sendRequest(url) {
	return fetch(url)
		.then(response => {
			return response.json();
		})
}

export function getNationality() {
	let arr = [];
	const USERS = store.users;
	USERS.forEach(user => {
		if (user.display === true) {
			arr.push(user.nat);
		}
	});
	return arr;
}

export function getDataUser() {
	const USERS = store.users;
	let most;
	let male = 0, female = 0, allUsers = 0;
	const matchResult = {}, nationality = getNationality(), match = [];

	USERS.forEach(user => {
		if (user.display) {
			allUsers += 1;
		}
		if (user.display && user.gender === 'male') {
			male += 1;
		} else if (user.display && user.gender === 'female') {
			female += 1;
		}
	});

	if (female > male) {
		most = 'Женщин Больше';
	} else if (male > female) {
		most = 'Мужчин Больше';
	} else if (male === female) {
		most = 'Мужчин и Женщин Одинаковое Количество';
	} else if (male === 0 && female) {
		most = 'Мужчин и Женщин в каталоге нет'
	}

	nationality.forEach(function (item) {
		matchResult[item] = matchResult[item] + 1 || 1;
	});

	for (let key in matchResult) {
		if (matchResult[key] > 1) {
			match.push(`<li>Национальность: ${key} повторяется ${matchResult[key]} раз(а)</li>`);
		}
	}

	return {
		male, female, allUsers, nationality, match, most
	}
}

