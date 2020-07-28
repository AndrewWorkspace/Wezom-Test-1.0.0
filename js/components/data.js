import {getNationality, sendRequest} from './helper';
import {nationFilter} from "./filters/nationality-filter";
import {$pagination, pagination} from "./pagination";
import {sortByGender} from "./filters/gender-filter";


const $downloadUsers = document.querySelector('.js-load-users');
const $loader = document.querySelector('.js-loader');
export const $userContainer = document.querySelector('.js-users-container');
export const $statisticWrapper = document.querySelector('.js-statistic');
const $filtersWrap = document.querySelector('.js-filters-wrap');

// Get Users And Enter in Browser
$downloadUsers.addEventListener('click', function () {
	//Generate Users Count
	const usersListSize = Math.floor(Math.random() * 101);
	//Clear Values
	$userContainer.innerHTML = '';
	$statisticWrapper.innerHTML = '';
	//Activate Preloader
	$loader.classList.add('active');
	// Request And Enter Users with Data and Statistic
	try {
		sendRequest(`https://randomuser.me/api/?results=${usersListSize}`)
			.then(({results}) => {
				store.users = results.map((user, i) => ({...user, display: true, id: i}));
				$loader.classList.remove('active');
				$filtersWrap.classList.add('active');
				$pagination.classList.add('active');
				getNationality();
				nationFilter();
				sortByGender();
				pagination();
			});
	} catch (error) {
		$loader.classList.remove('active');
		alert.error('Попробуйте отправить запрос повторно');
	}
});


