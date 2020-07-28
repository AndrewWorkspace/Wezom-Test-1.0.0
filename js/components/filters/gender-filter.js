// Gender Filter Helper
import {updateHTML} from "../filter-helpers";

function genderFilter(users, male, female, all) {
	users.forEach(user => {
		user.display = false;
		if (user.gender === female) {
			user.display = true;
		} else if (user.gender === male) {
			user.display = true;
		} else if (all) {
			user.display = true;
		}
	});
	updateHTML();
}

// Gender Filter
const $radioFilter = document.querySelectorAll('.js-radio-filter');

export function sortByGender() {
	const USERS = store.users;
	let male, female, all;
	if ($radioFilter) {
		$radioFilter.forEach(item => {
			item.addEventListener('click', function (event) {
				female = '';
				male = '';
				all = '';
				const target = event.target;
				const dataGenderType = target.dataset.gender;
				if (target.checked && dataGenderType === 'male') {
					male = 'male';
				} else if (target.checked && dataGenderType === 'female') {
					female = 'female';
				} else if (target.checked && dataGenderType === 'all') {
					all = 'all';
				}
				genderFilter(USERS, male, female, all);
			});
		});
	}
}