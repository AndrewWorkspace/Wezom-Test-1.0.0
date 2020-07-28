(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$statisticWrapper = exports.$userContainer = void 0;

var _helper = require("./helper");

var _nationalityFilter = require("./filters/nationality-filter");

var _pagination = require("./pagination");

var _genderFilter = require("./filters/gender-filter");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var $downloadUsers = document.querySelector('.js-load-users');
var $loader = document.querySelector('.js-loader');
var $userContainer = document.querySelector('.js-users-container');
exports.$userContainer = $userContainer;
var $statisticWrapper = document.querySelector('.js-statistic');
exports.$statisticWrapper = $statisticWrapper;
var $filtersWrap = document.querySelector('.js-filters-wrap'); // Get Users And Enter in Browser

$downloadUsers.addEventListener('click', function () {
  //Generate Users Count
  var usersListSize = Math.floor(Math.random() * 101); //Clear Values

  $userContainer.innerHTML = '';
  $statisticWrapper.innerHTML = ''; //Activate Preloader

  $loader.classList.add('active'); // Request And Enter Users with Data and Statistic

  try {
    (0, _helper.sendRequest)("https://randomuser.me/api/?results=".concat(usersListSize)).then(function (_ref) {
      var results = _ref.results;
      store.users = results.map(function (user, i) {
        return _objectSpread(_objectSpread({}, user), {}, {
          display: true,
          id: i
        });
      });
      $loader.classList.remove('active');
      $filtersWrap.classList.add('active');

      _pagination.$pagination.classList.add('active');

      (0, _helper.getNationality)();
      (0, _nationalityFilter.nationFilter)();
      (0, _genderFilter.sortByGender)();
      (0, _pagination.pagination)();
    });
  } catch (error) {
    $loader.classList.remove('active');
    alert.error('Попробуйте отправить запрос повторно');
  }
});

},{"./filters/gender-filter":6,"./filters/nationality-filter":7,"./helper":9,"./pagination":11}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHTML = updateHTML;
exports.compareName = compareName;

var _htmlTemplate = require("./html-template");

var _data = require("./data");

var _pagination = require("./pagination");

var _searchFilter = require("./filters/search-filter");

var _ageFilter = require("./filters/age-filter");

var _nationalityFilter = require("./filters/nationality-filter");

var _cardCountFilter = require("./filters/card-count-filter");

// Filter By Name,Email,Phone
function updateHTML() {
  _data.$userContainer.innerHTML = store.users.map(_htmlTemplate.displayProfile).join('');
  _data.$statisticWrapper.innerHTML = (0, _htmlTemplate.displayStatistic)();
} // Compare name without repeat


function compareName(a, b) {
  if (a.name.first < b.name.first) {
    return -1;
  } else if (a.name.first > b.name.first) {
    return 1;
  }

  return 0;
} //Reset Button


var reset = document.querySelector('.js-reset-filters');
var $defaultRadio = document.querySelector('#show-all');
reset.addEventListener('click', function () {
  $defaultRadio.checked = true;
  _searchFilter.input.value = '';
  _ageFilter.$ageSelect.value = 'Any Age';
  _nationalityFilter.$nationSelect.value = 'All Nationalities';
  _cardCountFilter.$cardFilter.value = '5';
  var resetCards = new Event('change');

  _cardCountFilter.$cardFilter.dispatchEvent(resetCards);
});

},{"./data":1,"./filters/age-filter":3,"./filters/card-count-filter":5,"./filters/nationality-filter":7,"./filters/search-filter":8,"./html-template":10,"./pagination":11}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$ageSelect = void 0;

var _filterHelpers = require("../filter-helpers");

// Age Sort
var $ageSelect = document.querySelector('.js-age-filter');
exports.$ageSelect = $ageSelect;
var selectData = {
  vOne: 'under-35',
  vTwo: 'from-35-to-40',
  vThree: 'from-40-45',
  vFour: 'over-45',
  vFive: 'any'
};

if ($ageSelect) {
  $ageSelect.addEventListener('change', function () {
    var activeSelect = this.querySelector(':checked').dataset.age;
    var USERS = store.users;
    USERS.forEach(function (user) {
      user.display = false;

      if (user.dob.age < 35 && activeSelect === selectData.vOne) {
        user.display = true;
      } else if (user.dob.age >= 35 && user.dob.age <= 40 && activeSelect === selectData.vTwo) {
        user.display = true;
      } else if (user.dob.age >= 40 && user.dob.age <= 45 && activeSelect === selectData.vThree) {
        user.display = true;
      } else if (user.dob.age > 45 && activeSelect === selectData.vFour) {
        user.display = true;
      } else if (activeSelect === selectData.vFive) {
        user.display = true;
      }
    });
    (0, _filterHelpers.updateHTML)();
  });
}

},{"../filter-helpers":2}],4:[function(require,module,exports){
"use strict";

var _filterHelpers = require("../filter-helpers");

// Alphabetical Sort
var $nameSort = document.querySelector('.js-name-sort');

if ($nameSort) {
  $nameSort.addEventListener('click', sortByName);
} // Alphabetical Sort Helper


function sortByName() {
  store.users.sort(_filterHelpers.compareName);
  (0, _filterHelpers.updateHTML)();
}

},{"../filter-helpers":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$cardFilter = exports.cardCountVal = void 0;

var _pagination = require("../pagination");

// Filter Cards Count Per Page
var cardCountVal = 5;
exports.cardCountVal = cardCountVal;
var $cardFilter = document.querySelector('.js-card-count');
exports.$cardFilter = $cardFilter;
$cardFilter.addEventListener('change', function () {
  exports.cardCountVal = cardCountVal = $cardFilter.value;
  (0, _pagination.pagination)();
});

},{"../pagination":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByGender = sortByGender;

var _filterHelpers = require("../filter-helpers");

// Gender Filter Helper
function genderFilter(users, male, female, all) {
  users.forEach(function (user) {
    user.display = false;

    if (user.gender === female) {
      user.display = true;
    } else if (user.gender === male) {
      user.display = true;
    } else if (all) {
      user.display = true;
    }
  });
  (0, _filterHelpers.updateHTML)();
} // Gender Filter


var $radioFilter = document.querySelectorAll('.js-radio-filter');

function sortByGender() {
  var USERS = store.users;
  var male, female, all;

  if ($radioFilter) {
    $radioFilter.forEach(function (item) {
      item.addEventListener('click', function (event) {
        female = '';
        male = '';
        all = '';
        var target = event.target;
        var dataGenderType = target.dataset.gender;

        if (target.checked && dataGenderType === 'male') {
          male = 'male';
        } else if (target.checked && dataGenderType === 'female') {
          female = 'female';
        } else if (target.checked && dataGenderType === 'all') {
          all = 'all';
        }

        genderFilter(USERS, male, female, all);
      });
    });
  }
}

},{"../filter-helpers":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nationFilter = exports.$nationSelect = void 0;

var _helper = require("../helper");

var _filterHelpers = require("../filter-helpers");

//Nationality Sort
var $nationSelect = document.querySelector('.js-nationality-filter');
exports.$nationSelect = $nationSelect;

var nationFilter = function nationFilter() {
  var USERS = store.users;
  var nationality = (0, _helper.getNationality)();

  if ($nationSelect) {
    var uniqueNat = nationality.filter(function (item, index) {
      return nationality.indexOf(item) === index;
    });
    uniqueNat.forEach(function (item) {
      return $nationSelect.innerHTML += "<option  value=\"".concat(item, "\"> ").concat(item, "</option>");
    });
    $nationSelect.addEventListener('change', function () {
      var activeSelect = this.querySelector(':checked').value;
      USERS.forEach(function (user) {
        user.display = false;

        if (user.nat === activeSelect) {
          user.display = true;
        } else if (activeSelect === 'all') {
          user.display = true;
        }
      });
      (0, _filterHelpers.updateHTML)();
    });
  }
};

exports.nationFilter = nationFilter;

},{"../filter-helpers":2,"../helper":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = void 0;

var _data = require("../data");

var _filterHelpers = require("../filter-helpers");

var _cardCountFilter = require("./card-count-filter");

// Search Filter
var input = document.querySelector('.js-input-filter');
exports.input = input;

if (input) {
  input.addEventListener('input', function () {
    _data.$statisticWrapper.innerHTML = '';
    var filter = input.value.toLowerCase();
    var $checkMale = document.querySelector('#show-male');
    var $checkFeMale = document.querySelector('#show-female');
    var $checkFeAll = document.querySelector('#show-all');
    store.users.forEach(function (user) {
      var phone = user.phone;
      var email = user.email;
      var name = user.name.first.toLowerCase() + ' ' + user.name.last.toLowerCase();

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

      (0, _filterHelpers.updateHTML)();
    });
  });
}

},{"../data":1,"../filter-helpers":2,"./card-count-filter":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendRequest = sendRequest;
exports.getNationality = getNationality;
exports.getDataUser = getDataUser;

function sendRequest(url) {
  return fetch(url).then(function (response) {
    return response.json();
  });
}

function getNationality() {
  var arr = [];
  var USERS = store.users;
  USERS.forEach(function (user) {
    if (user.display === true) {
      arr.push(user.nat);
    }
  });
  return arr;
}

function getDataUser() {
  var USERS = store.users;
  var most;
  var male = 0,
      female = 0,
      allUsers = 0;
  var matchResult = {},
      nationality = getNationality(),
      match = [];
  USERS.forEach(function (user) {
    if (user.display) {
      allUsers += 1;
    }

    if (user.display && user.gender === 'male') {
      male += 1;
    } else if (user.display && user.gender === 'female') {
      female += 1;
    }
  });

  if (female > male) {
    most = 'Женщин Больше';
  } else if (male > female) {
    most = 'Мужчин Больше';
  } else if (male === female) {
    most = 'Мужчин и Женщин Одинаковое Количество';
  } else if (male === 0 && female) {
    most = 'Мужчин и Женщин в каталоге нет';
  }

  nationality.forEach(function (item) {
    matchResult[item] = matchResult[item] + 1 || 1;
  });

  for (var key in matchResult) {
    if (matchResult[key] > 1) {
      match.push("<li>\u041D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C: ".concat(key, " \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442\u0441\u044F ").concat(matchResult[key], " \u0440\u0430\u0437(\u0430)</li>"));
    }
  }

  return {
    male: male,
    female: female,
    allUsers: allUsers,
    nationality: nationality,
    match: match,
    most: most
  };
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayProfile = displayProfile;
exports.displayStatistic = displayStatistic;

var _helper = require("./helper");

// User Profile Card
function displayProfile(item) {
  var card = "\n\t<div class=\"col-lg-4 col-md-6 col-12\">\n\t\t\t<div class=\"profile\" >\n\t\t\t\t\t<img src=\"".concat(item.picture.large, "\" alt=\"picture\">\n\t\t\t\t\t<span class='gender'>").concat(item.gender, "</span>\n\t\t\t\t\t<div class=\"profile__name js-profile-name\">\n\t\t\t\t\t\t\t").concat(item.name.first, " ").concat(item.name.last, " \n\t\t\t\t\t</div>\n\t\t\t\t\t<ul class=\"profile__info-list\">\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>Phone:</span>\n\t\t\t\t\t\t\t<a href=\"tel:#\" title=\"Call\">\n\t\t\t\t\t\t\t\t\t").concat(item.phone, "\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>E-mail:</span>\n\t\t\t\t\t\t\t<a href=\"mailto:#\" title=\"E-mail\">\n\t\t\t\t\t\t\t\t").concat(item.email, "\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>Adress:</span>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t").concat(item.location.city, ",\n\t\t\t\t\t\t\t\t").concat(item.location.country, ",\n\t\t\t\t\t\t\t\t").concat(item.location.street.name, " - ").concat(item.location.street.number, "\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>Birth date:</span>\n\t\t\t\t\t\t\t<span>").concat(item.dob.date, "</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>Register date:</span>\n\t\t\t\t\t\t\t<span>").concat(item.registered.date, "</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t</div>\n\t</div>\n");
  return item.display ? card : '';
} // Dynamic Users Statistic


function displayStatistic() {
  var _getDataUser = (0, _helper.getDataUser)(),
      male = _getDataUser.male,
      female = _getDataUser.female,
      allUsers = _getDataUser.allUsers,
      match = _getDataUser.match,
      most = _getDataUser.most;

  return "\n\t\t<ul class=\"statistic-list\">\n\t\t\t<li>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439: ".concat(allUsers, "</li>\n\t\t\t<li>\u041C\u0443\u0436\u0447\u0438\u043D: ").concat(male, "</li>\n\t\t\t<li>\u0416\u0435\u043D\u0449\u0438\u043D ").concat(female, "</li>\n\t\t\t<li>").concat(most, "</li>\n\t\t\t").concat(match.length ? match.join('') : '', "\n\t\t</ul>\n\t");
}

},{"./helper":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pagination = pagination;
exports.$pagination = void 0;

var _filterHelpers = require("./filter-helpers");

var _data = require("./data");

var _htmlTemplate = require("./html-template");

var _cardCountFilter = require("./filters/card-count-filter");

//Pagination
var $pagination = document.querySelector('.js-pagination');
exports.$pagination = $pagination;
var page = 0; //Pagination

function pagination() {
  var perPage = Number(_cardCountFilter.cardCountVal);
  var _store = store,
      users = _store.users;
  var userLength = users.length;

  if (isNaN(perPage)) {
    perPage = users.length;
  }

  for (var i = 0; i < page + perPage; i++) {
    _data.$userContainer.innerHTML = store.users.map(_htmlTemplate.displayProfile).join('');
    users.forEach(function (user) {
      user.display = user.id < perPage;
    });
  }

  $pagination.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    var target = event.target;

    if (target !== undefined) {
      users.forEach(function (user) {
        return user.display = false;
      });
      page = getPageLength(target.dataset.page, userLength, page, perPage);

      for (var _i = page; _i < page + perPage; _i++) {
        users[_i].display = true;
      }

      (0, _filterHelpers.updateHTML)();
    }
  });
  _data.$statisticWrapper.innerHTML = (0, _htmlTemplate.displayStatistic)();
} // Cards Per Page


function getPageLength(dataPage, userLength, page, perPage) {
  if (dataPage === 'next') {
    if (page + perPage * 2 <= userLength) {
      page = page + perPage;
    } else {
      page = userLength - perPage;
    }
  } else if (dataPage === 'previous' && page !== 0) {
    page = page - perPage;
  } else if (dataPage === 'first') {
    page = 0;
  } else if (dataPage === 'last') {
    page = userLength - perPage;
  }

  return page;
}

},{"./data":1,"./filter-helpers":2,"./filters/card-count-filter":5,"./html-template":10}],12:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var store = {};
window.store = store;
document.addEventListener('DOMContentLoaded', function () {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/data'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filters/search-filter'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filters/gender-filter'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filters/alphabetical-filter'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filters/age-filter'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filters/card-count-filter'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filter-helpers'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/pagination'));
  });
});

},{"./components/data":1,"./components/filter-helpers":2,"./components/filters/age-filter":3,"./components/filters/alphabetical-filter":4,"./components/filters/card-count-filter":5,"./components/filters/gender-filter":6,"./components/filters/search-filter":8,"./components/pagination":11}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2RhdGEuanMiLCJqcy9jb21wb25lbnRzL2ZpbHRlci1oZWxwZXJzLmpzIiwianMvY29tcG9uZW50cy9maWx0ZXJzL2FnZS1maWx0ZXIuanMiLCJqcy9jb21wb25lbnRzL2ZpbHRlcnMvYWxwaGFiZXRpY2FsLWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9jYXJkLWNvdW50LWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9nZW5kZXItZmlsdGVyLmpzIiwianMvY29tcG9uZW50cy9maWx0ZXJzL25hdGlvbmFsaXR5LWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9zZWFyY2gtZmlsdGVyLmpzIiwianMvY29tcG9uZW50cy9oZWxwZXIuanMiLCJqcy9jb21wb25lbnRzL2h0bWwtdGVtcGxhdGUuanMiLCJqcy9jb21wb25lbnRzL3BhZ2luYXRpb24uanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUdBLElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixDQUF2QjtBQUNBLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQWhCO0FBQ08sSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIscUJBQXZCLENBQXZCOztBQUNBLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBMUI7O0FBQ1AsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCLENBQXJCLEMsQ0FFQTs7QUFDQSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsWUFBWTtBQUNwRDtBQUNBLE1BQU0sYUFBYSxHQUFHLElB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QUFNLEtBQUssR0FBRyxFQUFkO0FBQ0EsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUFmO0FBR0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFZO0FBQ3pEO0FBQUEsMkNBQU8sbUJBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8sb0NBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8sb0NBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8sMENBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8saUNBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8sd0NBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8sNkJBQVA7QUFBQTtBQUNBO0FBQUEsMkNBQU8seUJBQVA7QUFBQTtBQUNBLENBVEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge2dldE5hdGlvbmFsaXR5LCBzZW5kUmVxdWVzdH0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHtuYXRpb25GaWx0ZXJ9IGZyb20gXCIuL2ZpbHRlcnMvbmF0aW9uYWxpdHktZmlsdGVyXCI7XG5pbXBvcnQgeyRwYWdpbmF0aW9uLCBwYWdpbmF0aW9ufSBmcm9tIFwiLi9wYWdpbmF0aW9uXCI7XG5pbXBvcnQge3NvcnRCeUdlbmRlcn0gZnJvbSBcIi4vZmlsdGVycy9nZW5kZXItZmlsdGVyXCI7XG5cblxuY29uc3QgJGRvd25sb2FkVXNlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbG9hZC11c2VycycpO1xuY29uc3QgJGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1sb2FkZXInKTtcbmV4cG9ydCBjb25zdCAkdXNlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy11c2Vycy1jb250YWluZXInKTtcbmV4cG9ydCBjb25zdCAkc3RhdGlzdGljV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zdGF0aXN0aWMnKTtcbmNvbnN0ICRmaWx0ZXJzV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1maWx0ZXJzLXdyYXAnKTtcblxuLy8gR2V0IFVzZXJzIEFuZCBFbnRlciBpbiBCcm93c2VyXG4kZG93bmxvYWRVc2Vycy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0Ly9HZW5lcmF0ZSBVc2VycyBDb3VudFxuXHRjb25zdCB1c2Vyc0xpc3RTaXplID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKTtcblx0Ly9DbGVhciBWYWx1ZXNcblx0JHVzZXJDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cdCRzdGF0aXN0aWNXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xuXHQvL0FjdGl2YXRlIFByZWxvYWRlclxuXHQkbG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHQvLyBSZXF1ZXN0IEFuZCBFbnRlciBVc2VycyB3aXRoIERhdGEgYW5kIFN0YXRpc3RpY1xuXHR0cnkge1xuXHRcdHNlbmRSZXF1ZXN0KGBodHRwczovL3JhbmRvbXVzZXIubWUvYXBpLz9yZXN1bHRzPSR7dXNlcnNMaXN0U2l6ZX1gKVxuXHRcdFx0LnRoZW4oKHtyZXN1bHRzfSkgPT4ge1xuXHRcdFx0XHRzdG9yZS51c2VycyA9IHJlc3VsdHMubWFwKCh1c2VyLCBpKSA9PiAoey4uLnVzZXIsIGRpc3BsYXk6IHRydWUsIGlkOiBpfSkpO1xuXHRcdFx0XHQkbG9hZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHQkZmlsdGVyc1dyYXAuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdpbmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRnZXROYXRpb25hbGl0eSgpO1xuXHRcdFx0XHRuYXRpb25GaWx0ZXIoKTtcblx0XHRcdFx0c29ydEJ5R2VuZGVyKCk7XG5cdFx0XHRcdHBhZ2luYXRpb24oKTtcblx0XHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdCRsb2FkZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0YWxlcnQuZXJyb3IoJ9Cf0L7Qv9GA0L7QsdGD0LnRgtC1INC+0YLQv9GA0LDQstC40YLRjCDQt9Cw0L/RgNC+0YEg0L/QvtCy0YLQvtGA0L3QvicpO1xuXHR9XG59KTtcblxuXG4iLCIvLyBGaWx0ZXIgQnkgTmFtZSxFbWFpbCxQaG9uZVxuaW1wb3J0IHtkaXNwbGF5UHJvZmlsZSwgZGlzcGxheVN0YXRpc3RpY30gZnJvbSBcIi4vaHRtbC10ZW1wbGF0ZVwiO1xuaW1wb3J0IHskc3RhdGlzdGljV3JhcHBlciwgJHVzZXJDb250YWluZXJ9IGZyb20gJy4vZGF0YSc7XG5pbXBvcnQge3BhZ2luYXRpb259IGZyb20gXCIuL3BhZ2luYXRpb25cIjtcbmltcG9ydCAge2lucHV0fSBmcm9tIFwiLi9maWx0ZXJzL3NlYXJjaC1maWx0ZXJcIlxuaW1wb3J0IHskYWdlU2VsZWN0fSBmcm9tIFwiLi9maWx0ZXJzL2FnZS1maWx0ZXJcIjtcbmltcG9ydCB7JG5hdGlvblNlbGVjdH0gZnJvbSBcIi4vZmlsdGVycy9uYXRpb25hbGl0eS1maWx0ZXJcIjtcbmltcG9ydCB7JGNhcmRGaWx0ZXIsIGNhcmRDb3VudFZhbH0gZnJvbSBcIi4vZmlsdGVycy9jYXJkLWNvdW50LWZpbHRlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlSFRNTCgpIHtcblx0JHVzZXJDb250YWluZXIuaW5uZXJIVE1MID0gc3RvcmUudXNlcnMubWFwKGRpc3BsYXlQcm9maWxlKS5qb2luKCcnKTtcblx0JHN0YXRpc3RpY1dyYXBwZXIuaW5uZXJIVE1MID0gZGlzcGxheVN0YXRpc3RpYygpO1xufVxuXG4vLyBDb21wYXJlIG5hbWUgd2l0aG91dCByZXBlYXRcbmV4cG9ydCBmdW5jdGlvbiBjb21wYXJlTmFtZShhLCBiKSB7XG5cdGlmIChhLm5hbWUuZmlyc3QgPCBiLm5hbWUuZmlyc3QpIHtcblx0XHRyZXR1cm4gLTE7XG5cdH0gZWxzZSBpZiAoYS5uYW1lLmZpcnN0ID4gYi5uYW1lLmZpcnN0KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblx0cmV0dXJuIDA7XG59XG5cbi8vUmVzZXQgQnV0dG9uXG5cbmNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc2V0LWZpbHRlcnMnKTtcbmNvbnN0ICRkZWZhdWx0UmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2hvdy1hbGwnKTtcbnJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoKSB7XG5cdCRkZWZhdWx0UmFkaW8uY2hlY2tlZCA9IHRydWU7XG5cdGlucHV0LnZhbHVlID0gJyc7XG5cdCRhZ2VTZWxlY3QudmFsdWUgPSAnQW55IEFnZSc7XG5cdCRuYXRpb25TZWxlY3QudmFsdWUgPSAnQWxsIE5hdGlvbmFsaXRpZXMnO1xuXHQkY2FyZEZpbHRlci52YWx1ZSA9ICc1Jztcblx0bGV0IHJlc2V0Q2FyZHMgPSBuZXcgRXZlbnQoJ2NoYW5nZScpO1xuXHQkY2FyZEZpbHRlci5kaXNwYXRjaEV2ZW50KHJlc2V0Q2FyZHMpO1xufSk7IiwiLy8gQWdlIFNvcnRcclxuaW1wb3J0IHt1cGRhdGVIVE1MfSBmcm9tIFwiLi4vZmlsdGVyLWhlbHBlcnNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCAkYWdlU2VsZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWFnZS1maWx0ZXInKTtcclxuY29uc3Qgc2VsZWN0RGF0YSA9IHtcclxuXHR2T25lOiAndW5kZXItMzUnLFxyXG5cdHZUd286ICdmcm9tLTM1LXRvLTQwJyxcclxuXHR2VGhyZWU6ICdmcm9tLTQwLTQ1JyxcclxuXHR2Rm91cjogJ292ZXItNDUnLFxyXG5cdHZGaXZlOiAnYW55JyxcclxufTtcclxuaWYgKCRhZ2VTZWxlY3QpIHtcclxuXHQkYWdlU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBhY3RpdmVTZWxlY3QgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykuZGF0YXNldC5hZ2U7XHJcblx0XHRjb25zdCBVU0VSUyA9IHN0b3JlLnVzZXJzO1xyXG5cdFx0VVNFUlMuZm9yRWFjaCh1c2VyID0+IHtcclxuXHRcdFx0dXNlci5kaXNwbGF5ID0gZmFsc2U7XHJcblx0XHRcdGlmICh1c2VyLmRvYi5hZ2UgPCAzNSAmJiBhY3RpdmVTZWxlY3QgPT09IHNlbGVjdERhdGEudk9uZSkge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoKHVzZXIuZG9iLmFnZSA+PSAzNSAmJiB1c2VyLmRvYi5hZ2UgPD0gNDApICYmIGFjdGl2ZVNlbGVjdCA9PT0gc2VsZWN0RGF0YS52VHdvKSB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIGlmICgodXNlci5kb2IuYWdlID49IDQwICYmIHVzZXIuZG9iLmFnZSA8PSA0NSkgJiYgYWN0aXZlU2VsZWN0ID09PSBzZWxlY3REYXRhLnZUaHJlZSkge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSBpZiAodXNlci5kb2IuYWdlID4gNDUgJiYgYWN0aXZlU2VsZWN0ID09PSBzZWxlY3REYXRhLnZGb3VyKSB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIGlmIChhY3RpdmVTZWxlY3QgPT09IHNlbGVjdERhdGEudkZpdmUpIHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHVwZGF0ZUhUTUwoKTtcclxuXHR9KTtcclxufSIsIi8vIEFscGhhYmV0aWNhbCBTb3J0XHJcbmltcG9ydCB7dXBkYXRlSFRNTCxjb21wYXJlTmFtZX0gZnJvbSBcIi4uL2ZpbHRlci1oZWxwZXJzXCI7XHJcblxyXG5jb25zdCAkbmFtZVNvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbmFtZS1zb3J0Jyk7XHJcbmlmICgkbmFtZVNvcnQpIHtcclxuXHQkbmFtZVNvcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzb3J0QnlOYW1lKTtcclxufVxyXG5cclxuLy8gQWxwaGFiZXRpY2FsIFNvcnQgSGVscGVyXHJcbmZ1bmN0aW9uIHNvcnRCeU5hbWUoKSB7XHJcblx0c3RvcmUudXNlcnMuc29ydChjb21wYXJlTmFtZSk7XHJcblx0dXBkYXRlSFRNTCgpO1xyXG59IiwiaW1wb3J0IHtwYWdpbmF0aW9ufSBmcm9tIFwiLi4vcGFnaW5hdGlvblwiO1xyXG5cclxuLy8gRmlsdGVyIENhcmRzIENvdW50IFBlciBQYWdlXHJcbmV4cG9ydCBsZXQgY2FyZENvdW50VmFsID0gNTtcclxuZXhwb3J0IGNvbnN0ICRjYXJkRmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNhcmQtY291bnQnKTtcclxuXHJcbiRjYXJkRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRjYXJkQ291bnRWYWwgPSAkY2FyZEZpbHRlci52YWx1ZTtcclxuXHRwYWdpbmF0aW9uKCk7XHJcbn0pOyIsIi8vIEdlbmRlciBGaWx0ZXIgSGVscGVyXHJcbmltcG9ydCB7dXBkYXRlSFRNTH0gZnJvbSBcIi4uL2ZpbHRlci1oZWxwZXJzXCI7XHJcblxyXG5mdW5jdGlvbiBnZW5kZXJGaWx0ZXIodXNlcnMsIG1hbGUsIGZlbWFsZSwgYWxsKSB7XHJcblx0dXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuXHRcdHVzZXIuZGlzcGxheSA9IGZhbHNlO1xyXG5cdFx0aWYgKHVzZXIuZ2VuZGVyID09PSBmZW1hbGUpIHtcclxuXHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSBpZiAodXNlci5nZW5kZXIgPT09IG1hbGUpIHtcclxuXHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSBpZiAoYWxsKSB7XHJcblx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0dXBkYXRlSFRNTCgpO1xyXG59XHJcblxyXG4vLyBHZW5kZXIgRmlsdGVyXHJcbmNvbnN0ICRyYWRpb0ZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1yYWRpby1maWx0ZXInKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlHZW5kZXIoKSB7XHJcblx0Y29uc3QgVVNFUlMgPSBzdG9yZS51c2VycztcclxuXHRsZXQgbWFsZSwgZmVtYWxlLCBhbGw7XHJcblx0aWYgKCRyYWRpb0ZpbHRlcikge1xyXG5cdFx0JHJhZGlvRmlsdGVyLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRmZW1hbGUgPSAnJztcclxuXHRcdFx0XHRtYWxlID0gJyc7XHJcblx0XHRcdFx0YWxsID0gJyc7XHJcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cdFx0XHRcdGNvbnN0IGRhdGFHZW5kZXJUeXBlID0gdGFyZ2V0LmRhdGFzZXQuZ2VuZGVyO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQuY2hlY2tlZCAmJiBkYXRhR2VuZGVyVHlwZSA9PT0gJ21hbGUnKSB7XHJcblx0XHRcdFx0XHRtYWxlID0gJ21hbGUnO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmNoZWNrZWQgJiYgZGF0YUdlbmRlclR5cGUgPT09ICdmZW1hbGUnKSB7XHJcblx0XHRcdFx0XHRmZW1hbGUgPSAnZmVtYWxlJztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldC5jaGVja2VkICYmIGRhdGFHZW5kZXJUeXBlID09PSAnYWxsJykge1xyXG5cdFx0XHRcdFx0YWxsID0gJ2FsbCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGdlbmRlckZpbHRlcihVU0VSUywgbWFsZSwgZmVtYWxlLCBhbGwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsIi8vTmF0aW9uYWxpdHkgU29ydFxyXG5pbXBvcnQge2dldE5hdGlvbmFsaXR5fSBmcm9tIFwiLi4vaGVscGVyXCI7XHJcbmltcG9ydCB7dXBkYXRlSFRNTH0gZnJvbSBcIi4uL2ZpbHRlci1oZWxwZXJzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgJG5hdGlvblNlbGVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1uYXRpb25hbGl0eS1maWx0ZXInKTtcclxuZXhwb3J0IGNvbnN0IG5hdGlvbkZpbHRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHRjb25zdCBVU0VSUyA9IHN0b3JlLnVzZXJzO1xyXG5cdGNvbnN0IG5hdGlvbmFsaXR5ID0gZ2V0TmF0aW9uYWxpdHkoKTtcclxuXHRpZiAoJG5hdGlvblNlbGVjdCkge1xyXG5cdFx0Y29uc3QgdW5pcXVlTmF0ID0gbmF0aW9uYWxpdHkuZmlsdGVyKChpdGVtLCBpbmRleCkgPT4gbmF0aW9uYWxpdHkuaW5kZXhPZihpdGVtKSA9PT0gaW5kZXgpO1xyXG5cdFx0dW5pcXVlTmF0LmZvckVhY2goaXRlbSA9PiAkbmF0aW9uU2VsZWN0LmlubmVySFRNTCArPSBgPG9wdGlvbiAgdmFsdWU9XCIke2l0ZW19XCI+ICR7aXRlbX08L29wdGlvbj5gKTtcclxuXHRcdCRuYXRpb25TZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsZXQgYWN0aXZlU2VsZWN0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpLnZhbHVlO1xyXG5cdFx0XHRVU0VSUy5mb3JFYWNoKHVzZXIgPT4ge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICh1c2VyLm5hdCA9PT0gYWN0aXZlU2VsZWN0KSB7XHJcblx0XHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoYWN0aXZlU2VsZWN0ID09PSAnYWxsJykge1xyXG5cdFx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR1cGRhdGVIVE1MKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn07IiwiaW1wb3J0IHskc3RhdGlzdGljV3JhcHBlcn0gZnJvbSBcIi4uL2RhdGFcIjtcclxuaW1wb3J0IHt1cGRhdGVIVE1MfSBmcm9tIFwiLi4vZmlsdGVyLWhlbHBlcnNcIjtcclxuaW1wb3J0IHskY2FyZEZpbHRlcn0gZnJvbSBcIi4vY2FyZC1jb3VudC1maWx0ZXJcIjtcclxuXHJcbi8vIFNlYXJjaCBGaWx0ZXJcclxuZXhwb3J0IGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWlucHV0LWZpbHRlcicpO1xyXG5pZiAoaW5wdXQpIHtcclxuXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdCRzdGF0aXN0aWNXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0Y29uc3QgZmlsdGVyID0gaW5wdXQudmFsdWUudG9Mb3dlckNhc2UoKTtcclxuXHRcdGxldCAkY2hlY2tNYWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3ctbWFsZScpO1xyXG5cdFx0bGV0ICRjaGVja0ZlTWFsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaG93LWZlbWFsZScpO1xyXG5cdFx0bGV0ICRjaGVja0ZlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3ctYWxsJyk7XHJcblxyXG5cdFx0c3RvcmUudXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuXHRcdFx0Y29uc3QgcGhvbmUgPSB1c2VyLnBob25lO1xyXG5cdFx0XHRjb25zdCBlbWFpbCA9IHVzZXIuZW1haWw7XHJcblx0XHRcdGNvbnN0IG5hbWUgPSB1c2VyLm5hbWUuZmlyc3QudG9Mb3dlckNhc2UoKSArICcgJyArIHVzZXIubmFtZS5sYXN0LnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdGlmIChwaG9uZS5pbmRleE9mKGZpbHRlcikgPiAtMSB8fCBlbWFpbC5pbmRleE9mKGZpbHRlcikgPiAtMSB8fCBuYW1lLmluZGV4T2YoZmlsdGVyKSA+IC0xKSB7XHJcblx0XHRcdFx0aWYgKCRjaGVja01hbGUuY2hlY2tlZCAmJiB1c2VyLmdlbmRlciAhPT0gJ2ZlbWFsZScpIHtcclxuXHRcdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIGlmICgkY2hlY2tGZU1hbGUuY2hlY2tlZCAmJiB1c2VyLmdlbmRlciAhPT0gJ21hbGUnKSB7XHJcblx0XHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoJGNoZWNrRmVBbGwuY2hlY2tlZCkge1xyXG5cdFx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0dXBkYXRlSFRNTCgpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNlbmRSZXF1ZXN0KHVybCkge1xuXHRyZXR1cm4gZmV0Y2godXJsKVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hdGlvbmFsaXR5KCkge1xuXHRsZXQgYXJyID0gW107XG5cdGNvbnN0IFVTRVJTID0gc3RvcmUudXNlcnM7XG5cdFVTRVJTLmZvckVhY2godXNlciA9PiB7XG5cdFx0aWYgKHVzZXIuZGlzcGxheSA9PT0gdHJ1ZSkge1xuXHRcdFx0YXJyLnB1c2godXNlci5uYXQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhVXNlcigpIHtcblx0Y29uc3QgVVNFUlMgPSBzdG9yZS51c2Vycztcblx0bGV0IG1vc3Q7XG5cdGxldCBtYWxlID0gMCwgZmVtYWxlID0gMCwgYWxsVXNlcnMgPSAwO1xuXHRjb25zdCBtYXRjaFJlc3VsdCA9IHt9LCBuYXRpb25hbGl0eSA9IGdldE5hdGlvbmFsaXR5KCksIG1hdGNoID0gW107XG5cblx0VVNFUlMuZm9yRWFjaCh1c2VyID0+IHtcblx0XHRpZiAodXNlci5kaXNwbGF5KSB7XG5cdFx0XHRhbGxVc2VycyArPSAxO1xuXHRcdH1cblx0XHRpZiAodXNlci5kaXNwbGF5ICYmIHVzZXIuZ2VuZGVyID09PSAnbWFsZScpIHtcblx0XHRcdG1hbGUgKz0gMTtcblx0XHR9IGVsc2UgaWYgKHVzZXIuZGlzcGxheSAmJiB1c2VyLmdlbmRlciA9PT0gJ2ZlbWFsZScpIHtcblx0XHRcdGZlbWFsZSArPSAxO1xuXHRcdH1cblx0fSk7XG5cblx0aWYgKGZlbWFsZSA+IG1hbGUpIHtcblx0XHRtb3N0ID0gJ9CW0LXQvdGJ0LjQvSDQkdC+0LvRjNGI0LUnO1xuXHR9IGVsc2UgaWYgKG1hbGUgPiBmZW1hbGUpIHtcblx0XHRtb3N0ID0gJ9Cc0YPQttGH0LjQvSDQkdC+0LvRjNGI0LUnO1xuXHR9IGVsc2UgaWYgKG1hbGUgPT09IGZlbWFsZSkge1xuXHRcdG1vc3QgPSAn0JzRg9C20YfQuNC9INC4INCW0LXQvdGJ0LjQvSDQntC00LjQvdCw0LrQvtCy0L7QtSDQmtC+0LvQuNGH0LXRgdGC0LLQvic7XG5cdH0gZWxzZSBpZiAobWFsZSA9PT0gMCAmJiBmZW1hbGUpIHtcblx0XHRtb3N0ID0gJ9Cc0YPQttGH0LjQvSDQuCDQltC10L3RidC40L0g0LIg0LrQsNGC0LDQu9C+0LPQtSDQvdC10YInXG5cdH1cblxuXHRuYXRpb25hbGl0eS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0bWF0Y2hSZXN1bHRbaXRlbV0gPSBtYXRjaFJlc3VsdFtpdGVtXSArIDEgfHwgMTtcblx0fSk7XG5cblx0Zm9yIChsZXQga2V5IGluIG1hdGNoUmVzdWx0KSB7XG5cdFx0aWYgKG1hdGNoUmVzdWx0W2tleV0gPiAxKSB7XG5cdFx0XHRtYXRjaC5wdXNoKGA8bGk+0J3QsNGG0LjQvtC90LDQu9GM0L3QvtGB0YLRjDogJHtrZXl9INC/0L7QstGC0L7RgNGP0LXRgtGB0Y8gJHttYXRjaFJlc3VsdFtrZXldfSDRgNCw0Lco0LApPC9saT5gKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG1hbGUsIGZlbWFsZSwgYWxsVXNlcnMsIG5hdGlvbmFsaXR5LCBtYXRjaCwgbW9zdFxuXHR9XG59XG5cbiIsIi8vIFVzZXIgUHJvZmlsZSBDYXJkXG5pbXBvcnQge2dldERhdGFVc2VyfSBmcm9tICcuL2hlbHBlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5UHJvZmlsZShpdGVtKSB7XG5cdGNvbnN0IGNhcmQgPSBgXG5cdDxkaXYgY2xhc3M9XCJjb2wtbGctNCBjb2wtbWQtNiBjb2wtMTJcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwcm9maWxlXCIgPlxuXHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpdGVtLnBpY3R1cmUubGFyZ2V9XCIgYWx0PVwicGljdHVyZVwiPlxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzPSdnZW5kZXInPiR7aXRlbS5nZW5kZXJ9PC9zcGFuPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9maWxlX19uYW1lIGpzLXByb2ZpbGUtbmFtZVwiPlxuXHRcdFx0XHRcdFx0XHQke2l0ZW0ubmFtZS5maXJzdH0gJHtpdGVtLm5hbWUubGFzdH0gXG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PHVsIGNsYXNzPVwicHJvZmlsZV9faW5mby1saXN0XCI+XG5cdFx0XHRcdFx0XHQ8bGk+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPlBob25lOjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cInRlbDojXCIgdGl0bGU9XCJDYWxsXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQke2l0ZW0ucGhvbmV9XG5cdFx0XHRcdFx0XHRcdDwvYT5cblx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPkUtbWFpbDo8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCJtYWlsdG86I1wiIHRpdGxlPVwiRS1tYWlsXCI+XG5cdFx0XHRcdFx0XHRcdFx0JHtpdGVtLmVtYWlsfVxuXHRcdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj5BZHJlc3M6PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQke2l0ZW0ubG9jYXRpb24uY2l0eX0sXG5cdFx0XHRcdFx0XHRcdFx0JHtpdGVtLmxvY2F0aW9uLmNvdW50cnl9LFxuXHRcdFx0XHRcdFx0XHRcdCR7aXRlbS5sb2NhdGlvbi5zdHJlZXQubmFtZX0gLSAke2l0ZW0ubG9jYXRpb24uc3RyZWV0Lm51bWJlcn1cblx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdDxsaT5cblx0XHRcdFx0XHRcdFx0PHNwYW4+QmlydGggZGF0ZTo8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPiR7aXRlbS5kb2IuZGF0ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj5SZWdpc3RlciBkYXRlOjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PHNwYW4+JHtpdGVtLnJlZ2lzdGVyZWQuZGF0ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdDwvdWw+XG5cdFx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5gO1xuXHRyZXR1cm4gaXRlbS5kaXNwbGF5ID8gY2FyZCA6ICcnO1xufVxuXG4vLyBEeW5hbWljIFVzZXJzIFN0YXRpc3RpY1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlTdGF0aXN0aWMoKSB7XG5cdGNvbnN0IHttYWxlLCBmZW1hbGUsIGFsbFVzZXJzLCBtYXRjaCwgbW9zdH0gPSBnZXREYXRhVXNlcigpO1xuXG5cdHJldHVybiBgXG5cdFx0PHVsIGNsYXNzPVwic3RhdGlzdGljLWxpc3RcIj5cblx0XHRcdDxsaT7Qn9C+0LvRjNC30L7QstCw0YLQtdC70LXQuTogJHthbGxVc2Vyc308L2xpPlxuXHRcdFx0PGxpPtCc0YPQttGH0LjQvTogJHttYWxlfTwvbGk+XG5cdFx0XHQ8bGk+0JbQtdC90YnQuNC9ICR7ZmVtYWxlfTwvbGk+XG5cdFx0XHQ8bGk+JHttb3N0fTwvbGk+XG5cdFx0XHQke21hdGNoLmxlbmd0aCA/IG1hdGNoLmpvaW4oJycpIDogJyd9XG5cdFx0PC91bD5cblx0YDtcbn1cblxuXG4iLCIvL1BhZ2luYXRpb25cclxuaW1wb3J0IHt1cGRhdGVIVE1MfSBmcm9tIFwiLi9maWx0ZXItaGVscGVyc1wiO1xyXG5pbXBvcnQgeyRzdGF0aXN0aWNXcmFwcGVyLCAkdXNlckNvbnRhaW5lcn0gZnJvbSBcIi4vZGF0YVwiO1xyXG5pbXBvcnQge2Rpc3BsYXlQcm9maWxlLCBkaXNwbGF5U3RhdGlzdGljfSBmcm9tIFwiLi9odG1sLXRlbXBsYXRlXCI7XHJcbmltcG9ydCB7Y2FyZENvdW50VmFsfSBmcm9tIFwiLi9maWx0ZXJzL2NhcmQtY291bnQtZmlsdGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgJHBhZ2luYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcGFnaW5hdGlvbicpO1xyXG5sZXQgcGFnZSA9IDA7XHJcblxyXG5cclxuLy9QYWdpbmF0aW9uXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWdpbmF0aW9uKCkge1xyXG5cdGxldCBwZXJQYWdlID0gTnVtYmVyKGNhcmRDb3VudFZhbCk7XHJcblx0Y29uc3Qge3VzZXJzfSA9IHN0b3JlO1xyXG5cdGNvbnN0IHVzZXJMZW5ndGggPSB1c2Vycy5sZW5ndGg7XHJcblx0aWYgKGlzTmFOKHBlclBhZ2UpKSB7XHJcblx0XHRwZXJQYWdlID0gdXNlcnMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlICsgcGVyUGFnZTsgaSsrKSB7XHJcblx0XHQkdXNlckNvbnRhaW5lci5pbm5lckhUTUwgPSBzdG9yZS51c2Vycy5tYXAoZGlzcGxheVByb2ZpbGUpLmpvaW4oJycpO1xyXG5cdFx0dXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuXHRcdFx0dXNlci5kaXNwbGF5ID0gdXNlci5pZCA8IHBlclBhZ2U7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0JHBhZ2luYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cdFx0aWYgKHRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHVzZXJzLmZvckVhY2godXNlciA9PiB1c2VyLmRpc3BsYXkgPSBmYWxzZSk7XHJcblx0XHRcdHBhZ2UgPSBnZXRQYWdlTGVuZ3RoKHRhcmdldC5kYXRhc2V0LnBhZ2UsIHVzZXJMZW5ndGgsIHBhZ2UsIHBlclBhZ2UpO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IHBhZ2U7IGkgPCBwYWdlICsgcGVyUGFnZTsgaSsrKSB7XHJcblx0XHRcdFx0dXNlcnNbaV0uZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0dXBkYXRlSFRNTCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCRzdGF0aXN0aWNXcmFwcGVyLmlubmVySFRNTCA9IGRpc3BsYXlTdGF0aXN0aWMoKTtcclxufVxyXG5cclxuLy8gQ2FyZHMgUGVyIFBhZ2VcclxuZnVuY3Rpb24gZ2V0UGFnZUxlbmd0aChkYXRhUGFnZSwgdXNlckxlbmd0aCwgcGFnZSwgcGVyUGFnZSkge1xyXG5cdGlmIChkYXRhUGFnZSA9PT0gJ25leHQnKSB7XHJcblx0XHRpZiAocGFnZSArIChwZXJQYWdlICogMikgPD0gdXNlckxlbmd0aCkge1xyXG5cdFx0XHRwYWdlID0gcGFnZSArIHBlclBhZ2U7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwYWdlID0gdXNlckxlbmd0aCAtIHBlclBhZ2U7XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmIChkYXRhUGFnZSA9PT0gJ3ByZXZpb3VzJyAmJiBwYWdlICE9PSAwKSB7XHJcblx0XHRwYWdlID0gcGFnZSAtIHBlclBhZ2VcclxuXHR9IGVsc2UgaWYgKGRhdGFQYWdlID09PSAnZmlyc3QnKSB7XHJcblx0XHRwYWdlID0gMDtcclxuXHR9IGVsc2UgaWYgKGRhdGFQYWdlID09PSAnbGFzdCcpIHtcclxuXHRcdHBhZ2UgPSB1c2VyTGVuZ3RoIC0gcGVyUGFnZTtcclxuXHR9XHJcblx0cmV0dXJuIHBhZ2U7XHJcbn0iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0b3JlID0ge307XG53aW5kb3cuc3RvcmUgPSBzdG9yZTtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9kYXRhJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlcnMvc2VhcmNoLWZpbHRlcicpO1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9maWx0ZXJzL2dlbmRlci1maWx0ZXInKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvZmlsdGVycy9hbHBoYWJldGljYWwtZmlsdGVyJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlcnMvYWdlLWZpbHRlcicpO1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9maWx0ZXJzL2NhcmQtY291bnQtZmlsdGVyJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlci1oZWxwZXJzJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL3BhZ2luYXRpb24nKTtcbn0pO1xuXG4iXX0=
