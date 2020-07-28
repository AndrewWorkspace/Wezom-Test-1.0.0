//Nationality Sort
import {getNationality} from "../helper";
import {updateHTML} from "../filter-helpers";

export const $nationSelect = document.querySelector('.js-nationality-filter');
export const nationFilter = function () {
	const USERS = store.users;
	const nationality = getNationality();
	if ($nationSelect) {
		const uniqueNat = nationality.filter((item, index) => nationality.indexOf(item) === index);
		uniqueNat.forEach(item => $nationSelect.innerHTML += `<option  value="${item}"> ${item}</option>`);
		$nationSelect.addEventListener('change', function () {
			let activeSelect = this.querySelector(':checked').value;
			USERS.forEach(user => {
				user.display = false;
				if (user.nat === activeSelect) {
					user.display = true;
				} else if (activeSelect === 'all') {
					user.display = true;
				}
			});
			updateHTML();
		});
	}
};