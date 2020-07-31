//Pagination
import {updateHTML} from "./filter-helpers";
import {$statisticWrapper, $userContainer} from "./data";
import {displayProfile, displayStatistic} from "./html-template";
import {cardCountVal} from "./filters/card-count-filter";

export const $pagination = document.querySelector('.js-pagination');
let page = 0;


//Pagination
export function pagination() {
	let perPage = Number(cardCountVal);
	const {users} = store;
	const userLength = users.length;
	let target
	if (isNaN(perPage)) {
		perPage = userLength;
	}

	for (let i = 0; i < page + perPage; i++) {
		$userContainer.innerHTML = store.users.map(displayProfile).join('');
		users.forEach(user => {
			user.display = user.id < perPage;
		})
	}

	$pagination.addEventListener('click', function (event) {
		target = event.target;
		if (target !== undefined) {
			if (target.dataset.page === 'next') {
				if (page + (perPage * 2) <= users.length) {
					page = page + perPage;
				} else {
					page = users.length - perPage;
				}
			} else if (target.dataset.page === 'previous' && page !== 0) {
				page = page - perPage
			} else if (target.dataset.page === 'first') {
				page = 0;
			} else if (target.dataset.page === 'last') {
				page = userLength - perPage;
			}
			users.forEach(user => {
				user.display = false;
			});
			for (let i = page; i < page + perPage; i++) {
				users[i].display = true;
			}
			updateHTML();
		}
	});
	$statisticWrapper.innerHTML = displayStatistic();
}


