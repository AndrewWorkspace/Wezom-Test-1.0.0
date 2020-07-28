// Filter By Name,Email,Phone
import {displayProfile, displayStatistic} from "./html-template";
import {$statisticWrapper, $userContainer} from './data';
import {pagination} from "./pagination";
import  {input} from "./filters/search-filter"
import {$ageSelect} from "./filters/age-filter";
import {$nationSelect} from "./filters/nationality-filter";
import {$cardFilter, cardCountVal} from "./filters/card-count-filter";

export function updateHTML() {
	$userContainer.innerHTML = store.users.map(displayProfile).join('');
	$statisticWrapper.innerHTML = displayStatistic();
}

// Compare name without repeat
export function compareName(a, b) {
	if (a.name.first < b.name.first) {
		return -1;
	} else if (a.name.first > b.name.first) {
		return 1;
	}
	return 0;
}

//Reset Button

const reset = document.querySelector('.js-reset-filters');
const $defaultRadio = document.querySelector('#show-all');
reset.addEventListener('click',function () {
	$defaultRadio.checked = true;
	input.value = '';
	$ageSelect.value = 'Any Age';
	$nationSelect.value = 'All Nationalities';
	$cardFilter.value = '5';
	let resetCards = new Event('change');
	$cardFilter.dispatchEvent(resetCards);
});