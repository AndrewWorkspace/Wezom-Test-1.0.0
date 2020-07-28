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
	if (isNaN(perPage)) {
		perPage = users.length;
	}

	for (let i = 0; i < page + perPage; i++) {
		$userContainer.innerHTML = store.users.map(displayProfile).join('');
		users.forEach(user => {
			user.display = user.id < perPage;
		})
	}

	$pagination.addEventListener('click', function (event) {
		event.stopImmediatePropagation();
		const target = event.target;
		if (target !== undefined) {
			users.forEach(user => user.display = false);
			page = getPageLength(target.dataset.page, userLength, page, perPage);

			for (let i = page; i < page + perPage; i++) {
				users[i].display = true;
			}
			updateHTML();
		}
	});
	$statisticWrapper.innerHTML = displayStatistic();
}

// Cards Per Page
function getPageLength(dataPage, userLength, page, perPage) {
	if (dataPage === 'next') {
		if (page + (perPage * 2) <= userLength) {
			page = page + perPage;
		} else {
			page = userLength - perPage;
		}
	} else if (dataPage === 'previous' && page !== 0) {
		page = page - perPage
	} else if (dataPage === 'first') {
		page = 0;
	} else if (dataPage === 'last') {
		page = userLength - perPage;
	}
	return page;
}