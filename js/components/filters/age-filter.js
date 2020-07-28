// Age Sort
import {updateHTML} from "../filter-helpers";

export const $ageSelect = document.querySelector('.js-age-filter');
const selectData = {
	vOne: 'under-35',
	vTwo: 'from-35-to-40',
	vThree: 'from-40-45',
	vFour: 'over-45',
	vFive: 'any',
};
if ($ageSelect) {
	$ageSelect.addEventListener('change', function () {
		let activeSelect = this.querySelector(':checked').dataset.age;
		const USERS = store.users;
		USERS.forEach(user => {
			user.display = false;
			if (user.dob.age < 35 && activeSelect === selectData.vOne) {
				user.display = true;
			} else if ((user.dob.age >= 35 && user.dob.age <= 40) && activeSelect === selectData.vTwo) {
				user.display = true;
			} else if ((user.dob.age >= 40 && user.dob.age <= 45) && activeSelect === selectData.vThree) {
				user.display = true;
			} else if (user.dob.age > 45 && activeSelect === selectData.vFour) {
				user.display = true;
			} else if (activeSelect === selectData.vFive) {
				user.display = true;
			}
		});
		updateHTML();
	});
}