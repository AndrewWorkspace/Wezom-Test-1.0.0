'use strict';

const store = {};
window.store = store;

document.addEventListener('DOMContentLoaded', function () {
	import('./components/data');
	import('./components/filters/search-filter');
	import('./components/filters/gender-filter');
	import('./components/filters/alphabetical-filter');
	import('./components/filters/age-filter');
	import('./components/filters/card-count-filter');
	import('./components/pagination');
	import('./components/filter-helpers');
});

