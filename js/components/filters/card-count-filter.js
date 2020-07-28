import {pagination} from "../pagination";

// Filter Cards Count Per Page
export let cardCountVal = 5;
export const $cardFilter = document.querySelector('.js-card-count');

$cardFilter.addEventListener('change', function () {
	cardCountVal = $cardFilter.value;
	pagination();
});