import {$statisticWrapper} from "../data";
import {updateHTML} from "../filter-helpers";
import {$cardFilter} from "./card-count-filter";

// Search Filter
export const input = document.querySelector('.js-input-filter');
if (input) {
	input.addEventListener('input', function () {
		$statisticWrapper.innerHTML = '';
		const filter = input.value.toLowerCase();
		let $checkMale = document.querySelector('#show-male');
		let $checkFeMale = document.querySelector('#show-female');
		let $checkFeAll = document.querySelector('#show-all');

		store.users.forEach(user => {
			const phone = user.phone;
			const email = user.email;
			const name = user.name.first.toLowerCase() + ' ' + user.name.last.toLowerCase();
			if (phone.indexOf(filter) > -1 || email.indexOf(filter) > -1 || name.indexOf(filter) > -1) {
				if ($checkMale.checked && user.gender !== 'female') {
					user.display = true;
				} else if ($checkFeMale.checked && user.gender !== 'male') {
					user.display = true;
				} else if ($checkFeAll.checked) {
					user.display = true;
				}
			} else {
				user.display = false;
			}
			updateHTML();
		});
	});
}
