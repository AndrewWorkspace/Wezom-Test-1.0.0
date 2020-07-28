// Alphabetical Sort
import {updateHTML,compareName} from "../filter-helpers";

const $nameSort = document.querySelector('.js-name-sort');
if ($nameSort) {
	$nameSort.addEventListener('click', sortByName);
}

// Alphabetical Sort Helper
function sortByName() {
	store.users.sort(compareName);
	updateHTML();
}