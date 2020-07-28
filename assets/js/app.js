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
    return _interopRequireWildcard(require('./components/pagination'));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./components/filter-helpers'));
  });
});

},{"./components/data":1,"./components/filter-helpers":2,"./components/filters/age-filter":3,"./components/filters/alphabetical-filter":4,"./components/filters/card-count-filter":5,"./components/filters/gender-filter":6,"./components/filters/search-filter":8,"./components/pagination":11}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2RhdGEuanMiLCJqcy9jb21wb25lbnRzL2ZpbHRlci1oZWxwZXJzLmpzIiwianMvY29tcG9uZW50cy9maWx0ZXJzL2FnZS1maWx0ZXIuanMiLCJqcy9jb21wb25lbnRzL2ZpbHRlcnMvYWxwaGFiZXRpY2FsLWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9jYXJkLWNvdW50LWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9nZW5kZXItZmlsdGVyLmpzIiwianMvY29tcG9uZW50cy9maWx0ZXJzL25hdGlvbmFsaXR5LWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9zZWFyY2gtZmlsdGVyLmpzIiwianMvY29tcG9uZW50cy9oZWxwZXIuanMiLCJqcy9jb21wb25lbnRzL2h0bWwtdGVtcGxhdGUuanMiLCJqcy9jb21wb25lbnRzL3BhZ2luYXRpb24uanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUdBLElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixDQUF2QjtBQUNBLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQWhCO0FBQ08sSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIscUJBQXZCLENBQXZCOztBQUNBLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBMUI7O0FBQ1AsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCLENBQXJCLEMsQ0FFQTs7QUFDQSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsWUFBWTtBQUNwRDtBQUNBLE1BQU0sYUFBYSxHQUFHLElB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QU0sQ0FBQyxLQUFQLEdBQWUsS0FBZjtBQUVBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBWTtBQUN6RDtBQUFBLDJDQUFPLG1CQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLG9DQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLG9DQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLDBDQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLGlDQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLHdDQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLHlCQUFQO0FBQUE7QUFDQTtBQUFBLDJDQUFPLDZCQUFQO0FBQUE7QUFDQSxDQVREIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtnZXROYXRpb25hbGl0eSwgc2VuZFJlcXVlc3R9IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7bmF0aW9uRmlsdGVyfSBmcm9tIFwiLi9maWx0ZXJzL25hdGlvbmFsaXR5LWZpbHRlclwiO1xuaW1wb3J0IHskcGFnaW5hdGlvbiwgcGFnaW5hdGlvbn0gZnJvbSBcIi4vcGFnaW5hdGlvblwiO1xuaW1wb3J0IHtzb3J0QnlHZW5kZXJ9IGZyb20gXCIuL2ZpbHRlcnMvZ2VuZGVyLWZpbHRlclwiO1xuXG5cbmNvbnN0ICRkb3dubG9hZFVzZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWxvYWQtdXNlcnMnKTtcbmNvbnN0ICRsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbG9hZGVyJyk7XG5leHBvcnQgY29uc3QgJHVzZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdXNlcnMtY29udGFpbmVyJyk7XG5leHBvcnQgY29uc3QgJHN0YXRpc3RpY1dyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc3RhdGlzdGljJyk7XG5jb25zdCAkZmlsdGVyc1dyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZmlsdGVycy13cmFwJyk7XG5cbi8vIEdldCBVc2VycyBBbmQgRW50ZXIgaW4gQnJvd3NlclxuJGRvd25sb2FkVXNlcnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdC8vR2VuZXJhdGUgVXNlcnMgQ291bnRcblx0Y29uc3QgdXNlcnNMaXN0U2l6ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSk7XG5cdC8vQ2xlYXIgVmFsdWVzXG5cdCR1c2VyQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXHQkc3RhdGlzdGljV3JhcHBlci5pbm5lckhUTUwgPSAnJztcblx0Ly9BY3RpdmF0ZSBQcmVsb2FkZXJcblx0JGxvYWRlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0Ly8gUmVxdWVzdCBBbmQgRW50ZXIgVXNlcnMgd2l0aCBEYXRhIGFuZCBTdGF0aXN0aWNcblx0dHJ5IHtcblx0XHRzZW5kUmVxdWVzdChgaHR0cHM6Ly9yYW5kb211c2VyLm1lL2FwaS8/cmVzdWx0cz0ke3VzZXJzTGlzdFNpemV9YClcblx0XHRcdC50aGVuKCh7cmVzdWx0c30pID0+IHtcblx0XHRcdFx0c3RvcmUudXNlcnMgPSByZXN1bHRzLm1hcCgodXNlciwgaSkgPT4gKHsuLi51c2VyLCBkaXNwbGF5OiB0cnVlLCBpZDogaX0pKTtcblx0XHRcdFx0JGxvYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0JGZpbHRlcnNXcmFwLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHQkcGFnaW5hdGlvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0Z2V0TmF0aW9uYWxpdHkoKTtcblx0XHRcdFx0bmF0aW9uRmlsdGVyKCk7XG5cdFx0XHRcdHNvcnRCeUdlbmRlcigpO1xuXHRcdFx0XHRwYWdpbmF0aW9uKCk7XG5cdFx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQkbG9hZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdGFsZXJ0LmVycm9yKCfQn9C+0L/RgNC+0LHRg9C50YLQtSDQvtGC0L/RgNCw0LLQuNGC0Ywg0LfQsNC/0YDQvtGBINC/0L7QstGC0L7RgNC90L4nKTtcblx0fVxufSk7XG5cblxuIiwiLy8gRmlsdGVyIEJ5IE5hbWUsRW1haWwsUGhvbmVcbmltcG9ydCB7ZGlzcGxheVByb2ZpbGUsIGRpc3BsYXlTdGF0aXN0aWN9IGZyb20gXCIuL2h0bWwtdGVtcGxhdGVcIjtcbmltcG9ydCB7JHN0YXRpc3RpY1dyYXBwZXIsICR1c2VyQ29udGFpbmVyfSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHtwYWdpbmF0aW9ufSBmcm9tIFwiLi9wYWdpbmF0aW9uXCI7XG5pbXBvcnQgIHtpbnB1dH0gZnJvbSBcIi4vZmlsdGVycy9zZWFyY2gtZmlsdGVyXCJcbmltcG9ydCB7JGFnZVNlbGVjdH0gZnJvbSBcIi4vZmlsdGVycy9hZ2UtZmlsdGVyXCI7XG5pbXBvcnQgeyRuYXRpb25TZWxlY3R9IGZyb20gXCIuL2ZpbHRlcnMvbmF0aW9uYWxpdHktZmlsdGVyXCI7XG5pbXBvcnQgeyRjYXJkRmlsdGVyLCBjYXJkQ291bnRWYWx9IGZyb20gXCIuL2ZpbHRlcnMvY2FyZC1jb3VudC1maWx0ZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUhUTUwoKSB7XG5cdCR1c2VyQ29udGFpbmVyLmlubmVySFRNTCA9IHN0b3JlLnVzZXJzLm1hcChkaXNwbGF5UHJvZmlsZSkuam9pbignJyk7XG5cdCRzdGF0aXN0aWNXcmFwcGVyLmlubmVySFRNTCA9IGRpc3BsYXlTdGF0aXN0aWMoKTtcbn1cblxuLy8gQ29tcGFyZSBuYW1lIHdpdGhvdXQgcmVwZWF0XG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZU5hbWUoYSwgYikge1xuXHRpZiAoYS5uYW1lLmZpcnN0IDwgYi5uYW1lLmZpcnN0KSB7XG5cdFx0cmV0dXJuIC0xO1xuXHR9IGVsc2UgaWYgKGEubmFtZS5maXJzdCA+IGIubmFtZS5maXJzdCkge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cdHJldHVybiAwO1xufVxuXG4vL1Jlc2V0IEJ1dHRvblxuXG5jb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yZXNldC1maWx0ZXJzJyk7XG5jb25zdCAkZGVmYXVsdFJhZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3ctYWxsJyk7XG5yZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24gKCkge1xuXHQkZGVmYXVsdFJhZGlvLmNoZWNrZWQgPSB0cnVlO1xuXHRpbnB1dC52YWx1ZSA9ICcnO1xuXHQkYWdlU2VsZWN0LnZhbHVlID0gJ0FueSBBZ2UnO1xuXHQkbmF0aW9uU2VsZWN0LnZhbHVlID0gJ0FsbCBOYXRpb25hbGl0aWVzJztcblx0JGNhcmRGaWx0ZXIudmFsdWUgPSAnNSc7XG5cdGxldCByZXNldENhcmRzID0gbmV3IEV2ZW50KCdjaGFuZ2UnKTtcblx0JGNhcmRGaWx0ZXIuZGlzcGF0Y2hFdmVudChyZXNldENhcmRzKTtcbn0pOyIsIi8vIEFnZSBTb3J0XHJcbmltcG9ydCB7dXBkYXRlSFRNTH0gZnJvbSBcIi4uL2ZpbHRlci1oZWxwZXJzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgJGFnZVNlbGVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1hZ2UtZmlsdGVyJyk7XHJcbmNvbnN0IHNlbGVjdERhdGEgPSB7XHJcblx0dk9uZTogJ3VuZGVyLTM1JyxcclxuXHR2VHdvOiAnZnJvbS0zNS10by00MCcsXHJcblx0dlRocmVlOiAnZnJvbS00MC00NScsXHJcblx0dkZvdXI6ICdvdmVyLTQ1JyxcclxuXHR2Rml2ZTogJ2FueScsXHJcbn07XHJcbmlmICgkYWdlU2VsZWN0KSB7XHJcblx0JGFnZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRsZXQgYWN0aXZlU2VsZWN0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpLmRhdGFzZXQuYWdlO1xyXG5cdFx0Y29uc3QgVVNFUlMgPSBzdG9yZS51c2VycztcclxuXHRcdFVTRVJTLmZvckVhY2godXNlciA9PiB7XHJcblx0XHRcdHVzZXIuZGlzcGxheSA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodXNlci5kb2IuYWdlIDwgMzUgJiYgYWN0aXZlU2VsZWN0ID09PSBzZWxlY3REYXRhLnZPbmUpIHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCh1c2VyLmRvYi5hZ2UgPj0gMzUgJiYgdXNlci5kb2IuYWdlIDw9IDQwKSAmJiBhY3RpdmVTZWxlY3QgPT09IHNlbGVjdERhdGEudlR3bykge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoKHVzZXIuZG9iLmFnZSA+PSA0MCAmJiB1c2VyLmRvYi5hZ2UgPD0gNDUpICYmIGFjdGl2ZVNlbGVjdCA9PT0gc2VsZWN0RGF0YS52VGhyZWUpIHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHVzZXIuZG9iLmFnZSA+IDQ1ICYmIGFjdGl2ZVNlbGVjdCA9PT0gc2VsZWN0RGF0YS52Rm91cikge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoYWN0aXZlU2VsZWN0ID09PSBzZWxlY3REYXRhLnZGaXZlKSB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHR1cGRhdGVIVE1MKCk7XHJcblx0fSk7XHJcbn0iLCIvLyBBbHBoYWJldGljYWwgU29ydFxyXG5pbXBvcnQge3VwZGF0ZUhUTUwsY29tcGFyZU5hbWV9IGZyb20gXCIuLi9maWx0ZXItaGVscGVyc1wiO1xyXG5cclxuY29uc3QgJG5hbWVTb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW5hbWUtc29ydCcpO1xyXG5pZiAoJG5hbWVTb3J0KSB7XHJcblx0JG5hbWVTb3J0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc29ydEJ5TmFtZSk7XHJcbn1cclxuXHJcbi8vIEFscGhhYmV0aWNhbCBTb3J0IEhlbHBlclxyXG5mdW5jdGlvbiBzb3J0QnlOYW1lKCkge1xyXG5cdHN0b3JlLnVzZXJzLnNvcnQoY29tcGFyZU5hbWUpO1xyXG5cdHVwZGF0ZUhUTUwoKTtcclxufSIsImltcG9ydCB7cGFnaW5hdGlvbn0gZnJvbSBcIi4uL3BhZ2luYXRpb25cIjtcclxuXHJcbi8vIEZpbHRlciBDYXJkcyBDb3VudCBQZXIgUGFnZVxyXG5leHBvcnQgbGV0IGNhcmRDb3VudFZhbCA9IDU7XHJcbmV4cG9ydCBjb25zdCAkY2FyZEZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYXJkLWNvdW50Jyk7XHJcblxyXG4kY2FyZEZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0Y2FyZENvdW50VmFsID0gJGNhcmRGaWx0ZXIudmFsdWU7XHJcblx0cGFnaW5hdGlvbigpO1xyXG59KTsiLCIvLyBHZW5kZXIgRmlsdGVyIEhlbHBlclxyXG5pbXBvcnQge3VwZGF0ZUhUTUx9IGZyb20gXCIuLi9maWx0ZXItaGVscGVyc1wiO1xyXG5cclxuZnVuY3Rpb24gZ2VuZGVyRmlsdGVyKHVzZXJzLCBtYWxlLCBmZW1hbGUsIGFsbCkge1xyXG5cdHVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcblx0XHR1c2VyLmRpc3BsYXkgPSBmYWxzZTtcclxuXHRcdGlmICh1c2VyLmdlbmRlciA9PT0gZmVtYWxlKSB7XHJcblx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKHVzZXIuZ2VuZGVyID09PSBtYWxlKSB7XHJcblx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKGFsbCkge1xyXG5cdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHVwZGF0ZUhUTUwoKTtcclxufVxyXG5cclxuLy8gR2VuZGVyIEZpbHRlclxyXG5jb25zdCAkcmFkaW9GaWx0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcmFkaW8tZmlsdGVyJyk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc29ydEJ5R2VuZGVyKCkge1xyXG5cdGNvbnN0IFVTRVJTID0gc3RvcmUudXNlcnM7XHJcblx0bGV0IG1hbGUsIGZlbWFsZSwgYWxsO1xyXG5cdGlmICgkcmFkaW9GaWx0ZXIpIHtcclxuXHRcdCRyYWRpb0ZpbHRlci5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0ZmVtYWxlID0gJyc7XHJcblx0XHRcdFx0bWFsZSA9ICcnO1xyXG5cdFx0XHRcdGFsbCA9ICcnO1xyXG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuXHRcdFx0XHRjb25zdCBkYXRhR2VuZGVyVHlwZSA9IHRhcmdldC5kYXRhc2V0LmdlbmRlcjtcclxuXHRcdFx0XHRpZiAodGFyZ2V0LmNoZWNrZWQgJiYgZGF0YUdlbmRlclR5cGUgPT09ICdtYWxlJykge1xyXG5cdFx0XHRcdFx0bWFsZSA9ICdtYWxlJztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldC5jaGVja2VkICYmIGRhdGFHZW5kZXJUeXBlID09PSAnZmVtYWxlJykge1xyXG5cdFx0XHRcdFx0ZmVtYWxlID0gJ2ZlbWFsZSc7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0YXJnZXQuY2hlY2tlZCAmJiBkYXRhR2VuZGVyVHlwZSA9PT0gJ2FsbCcpIHtcclxuXHRcdFx0XHRcdGFsbCA9ICdhbGwnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRnZW5kZXJGaWx0ZXIoVVNFUlMsIG1hbGUsIGZlbWFsZSwgYWxsKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCIvL05hdGlvbmFsaXR5IFNvcnRcclxuaW1wb3J0IHtnZXROYXRpb25hbGl0eX0gZnJvbSBcIi4uL2hlbHBlclwiO1xyXG5pbXBvcnQge3VwZGF0ZUhUTUx9IGZyb20gXCIuLi9maWx0ZXItaGVscGVyc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0ICRuYXRpb25TZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbmF0aW9uYWxpdHktZmlsdGVyJyk7XHJcbmV4cG9ydCBjb25zdCBuYXRpb25GaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0Y29uc3QgVVNFUlMgPSBzdG9yZS51c2VycztcclxuXHRjb25zdCBuYXRpb25hbGl0eSA9IGdldE5hdGlvbmFsaXR5KCk7XHJcblx0aWYgKCRuYXRpb25TZWxlY3QpIHtcclxuXHRcdGNvbnN0IHVuaXF1ZU5hdCA9IG5hdGlvbmFsaXR5LmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IG5hdGlvbmFsaXR5LmluZGV4T2YoaXRlbSkgPT09IGluZGV4KTtcclxuXHRcdHVuaXF1ZU5hdC5mb3JFYWNoKGl0ZW0gPT4gJG5hdGlvblNlbGVjdC5pbm5lckhUTUwgKz0gYDxvcHRpb24gIHZhbHVlPVwiJHtpdGVtfVwiPiAke2l0ZW19PC9vcHRpb24+YCk7XHJcblx0XHQkbmF0aW9uU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0bGV0IGFjdGl2ZVNlbGVjdCA9IHRoaXMucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKS52YWx1ZTtcclxuXHRcdFx0VVNFUlMuZm9yRWFjaCh1c2VyID0+IHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodXNlci5uYXQgPT09IGFjdGl2ZVNlbGVjdCkge1xyXG5cdFx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGFjdGl2ZVNlbGVjdCA9PT0gJ2FsbCcpIHtcclxuXHRcdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dXBkYXRlSFRNTCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59OyIsImltcG9ydCB7JHN0YXRpc3RpY1dyYXBwZXJ9IGZyb20gXCIuLi9kYXRhXCI7XHJcbmltcG9ydCB7dXBkYXRlSFRNTH0gZnJvbSBcIi4uL2ZpbHRlci1oZWxwZXJzXCI7XHJcbmltcG9ydCB7JGNhcmRGaWx0ZXJ9IGZyb20gXCIuL2NhcmQtY291bnQtZmlsdGVyXCI7XHJcblxyXG4vLyBTZWFyY2ggRmlsdGVyXHJcbmV4cG9ydCBjb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1pbnB1dC1maWx0ZXInKTtcclxuaWYgKGlucHV0KSB7XHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHQkc3RhdGlzdGljV3JhcHBlci5pbm5lckhUTUwgPSAnJztcclxuXHRcdGNvbnN0IGZpbHRlciA9IGlucHV0LnZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRsZXQgJGNoZWNrTWFsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaG93LW1hbGUnKTtcclxuXHRcdGxldCAkY2hlY2tGZU1hbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2hvdy1mZW1hbGUnKTtcclxuXHRcdGxldCAkY2hlY2tGZUFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaG93LWFsbCcpO1xyXG5cclxuXHRcdHN0b3JlLnVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcblx0XHRcdGNvbnN0IHBob25lID0gdXNlci5waG9uZTtcclxuXHRcdFx0Y29uc3QgZW1haWwgPSB1c2VyLmVtYWlsO1xyXG5cdFx0XHRjb25zdCBuYW1lID0gdXNlci5uYW1lLmZpcnN0LnRvTG93ZXJDYXNlKCkgKyAnICcgKyB1c2VyLm5hbWUubGFzdC50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRpZiAocGhvbmUuaW5kZXhPZihmaWx0ZXIpID4gLTEgfHwgZW1haWwuaW5kZXhPZihmaWx0ZXIpID4gLTEgfHwgbmFtZS5pbmRleE9mKGZpbHRlcikgPiAtMSkge1xyXG5cdFx0XHRcdGlmICgkY2hlY2tNYWxlLmNoZWNrZWQgJiYgdXNlci5nZW5kZXIgIT09ICdmZW1hbGUnKSB7XHJcblx0XHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoJGNoZWNrRmVNYWxlLmNoZWNrZWQgJiYgdXNlci5nZW5kZXIgIT09ICdtYWxlJykge1xyXG5cdFx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKCRjaGVja0ZlQWxsLmNoZWNrZWQpIHtcclxuXHRcdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHVwZGF0ZUhUTUwoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBzZW5kUmVxdWVzdCh1cmwpIHtcblx0cmV0dXJuIGZldGNoKHVybClcblx0XHQudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYXRpb25hbGl0eSgpIHtcblx0bGV0IGFyciA9IFtdO1xuXHRjb25zdCBVU0VSUyA9IHN0b3JlLnVzZXJzO1xuXHRVU0VSUy5mb3JFYWNoKHVzZXIgPT4ge1xuXHRcdGlmICh1c2VyLmRpc3BsYXkgPT09IHRydWUpIHtcblx0XHRcdGFyci5wdXNoKHVzZXIubmF0KTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YVVzZXIoKSB7XG5cdGNvbnN0IFVTRVJTID0gc3RvcmUudXNlcnM7XG5cdGxldCBtb3N0O1xuXHRsZXQgbWFsZSA9IDAsIGZlbWFsZSA9IDAsIGFsbFVzZXJzID0gMDtcblx0Y29uc3QgbWF0Y2hSZXN1bHQgPSB7fSwgbmF0aW9uYWxpdHkgPSBnZXROYXRpb25hbGl0eSgpLCBtYXRjaCA9IFtdO1xuXG5cdFVTRVJTLmZvckVhY2godXNlciA9PiB7XG5cdFx0aWYgKHVzZXIuZGlzcGxheSkge1xuXHRcdFx0YWxsVXNlcnMgKz0gMTtcblx0XHR9XG5cdFx0aWYgKHVzZXIuZGlzcGxheSAmJiB1c2VyLmdlbmRlciA9PT0gJ21hbGUnKSB7XG5cdFx0XHRtYWxlICs9IDE7XG5cdFx0fSBlbHNlIGlmICh1c2VyLmRpc3BsYXkgJiYgdXNlci5nZW5kZXIgPT09ICdmZW1hbGUnKSB7XG5cdFx0XHRmZW1hbGUgKz0gMTtcblx0XHR9XG5cdH0pO1xuXG5cdGlmIChmZW1hbGUgPiBtYWxlKSB7XG5cdFx0bW9zdCA9ICfQltC10L3RidC40L0g0JHQvtC70YzRiNC1Jztcblx0fSBlbHNlIGlmIChtYWxlID4gZmVtYWxlKSB7XG5cdFx0bW9zdCA9ICfQnNGD0LbRh9C40L0g0JHQvtC70YzRiNC1Jztcblx0fSBlbHNlIGlmIChtYWxlID09PSBmZW1hbGUpIHtcblx0XHRtb3N0ID0gJ9Cc0YPQttGH0LjQvSDQuCDQltC10L3RidC40L0g0J7QtNC40L3QsNC60L7QstC+0LUg0JrQvtC70LjRh9C10YHRgtCy0L4nO1xuXHR9IGVsc2UgaWYgKG1hbGUgPT09IDAgJiYgZmVtYWxlKSB7XG5cdFx0bW9zdCA9ICfQnNGD0LbRh9C40L0g0Lgg0JbQtdC90YnQuNC9INCyINC60LDRgtCw0LvQvtCz0LUg0L3QtdGCJ1xuXHR9XG5cblx0bmF0aW9uYWxpdHkuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdG1hdGNoUmVzdWx0W2l0ZW1dID0gbWF0Y2hSZXN1bHRbaXRlbV0gKyAxIHx8IDE7XG5cdH0pO1xuXG5cdGZvciAobGV0IGtleSBpbiBtYXRjaFJlc3VsdCkge1xuXHRcdGlmIChtYXRjaFJlc3VsdFtrZXldID4gMSkge1xuXHRcdFx0bWF0Y2gucHVzaChgPGxpPtCd0LDRhtC40L7QvdCw0LvRjNC90L7RgdGC0Yw6ICR7a2V5fSDQv9C+0LLRgtC+0YDRj9C10YLRgdGPICR7bWF0Y2hSZXN1bHRba2V5XX0g0YDQsNC3KNCwKTwvbGk+YCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRtYWxlLCBmZW1hbGUsIGFsbFVzZXJzLCBuYXRpb25hbGl0eSwgbWF0Y2gsIG1vc3Rcblx0fVxufVxuXG4iLCIvLyBVc2VyIFByb2ZpbGUgQ2FyZFxuaW1wb3J0IHtnZXREYXRhVXNlcn0gZnJvbSAnLi9oZWxwZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheVByb2ZpbGUoaXRlbSkge1xuXHRjb25zdCBjYXJkID0gYFxuXHQ8ZGl2IGNsYXNzPVwiY29sLWxnLTQgY29sLW1kLTYgY29sLTEyXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZmlsZVwiID5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7aXRlbS5waWN0dXJlLmxhcmdlfVwiIGFsdD1cInBpY3R1cmVcIj5cblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz0nZ2VuZGVyJz4ke2l0ZW0uZ2VuZGVyfTwvc3Bhbj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZmlsZV9fbmFtZSBqcy1wcm9maWxlLW5hbWVcIj5cblx0XHRcdFx0XHRcdFx0JHtpdGVtLm5hbWUuZmlyc3R9ICR7aXRlbS5uYW1lLmxhc3R9IFxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDx1bCBjbGFzcz1cInByb2ZpbGVfX2luZm8tbGlzdFwiPlxuXHRcdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj5QaG9uZTo8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCJ0ZWw6I1wiIHRpdGxlPVwiQ2FsbFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0JHtpdGVtLnBob25lfVxuXHRcdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj5FLW1haWw6PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwibWFpbHRvOiNcIiB0aXRsZT1cIkUtbWFpbFwiPlxuXHRcdFx0XHRcdFx0XHRcdCR7aXRlbS5lbWFpbH1cblx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdDxsaT5cblx0XHRcdFx0XHRcdFx0PHNwYW4+QWRyZXNzOjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PHNwYW4+XG5cdFx0XHRcdFx0XHRcdFx0JHtpdGVtLmxvY2F0aW9uLmNpdHl9LFxuXHRcdFx0XHRcdFx0XHRcdCR7aXRlbS5sb2NhdGlvbi5jb3VudHJ5fSxcblx0XHRcdFx0XHRcdFx0XHQke2l0ZW0ubG9jYXRpb24uc3RyZWV0Lm5hbWV9IC0gJHtpdGVtLmxvY2F0aW9uLnN0cmVldC5udW1iZXJ9XG5cdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPkJpcnRoIGRhdGU6PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj4ke2l0ZW0uZG9iLmRhdGV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdDxsaT5cblx0XHRcdFx0XHRcdFx0PHNwYW4+UmVnaXN0ZXIgZGF0ZTo8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPiR7aXRlbS5yZWdpc3RlcmVkLmRhdGV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0PC9kaXY+XG5cdDwvZGl2PlxuYDtcblx0cmV0dXJuIGl0ZW0uZGlzcGxheSA/IGNhcmQgOiAnJztcbn1cblxuLy8gRHluYW1pYyBVc2VycyBTdGF0aXN0aWNcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5U3RhdGlzdGljKCkge1xuXHRjb25zdCB7bWFsZSwgZmVtYWxlLCBhbGxVc2VycywgbWF0Y2gsIG1vc3R9ID0gZ2V0RGF0YVVzZXIoKTtcblxuXHRyZXR1cm4gYFxuXHRcdDx1bCBjbGFzcz1cInN0YXRpc3RpYy1saXN0XCI+XG5cdFx0XHQ8bGk+0J/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lk6ICR7YWxsVXNlcnN9PC9saT5cblx0XHRcdDxsaT7QnNGD0LbRh9C40L06ICR7bWFsZX08L2xpPlxuXHRcdFx0PGxpPtCW0LXQvdGJ0LjQvSAke2ZlbWFsZX08L2xpPlxuXHRcdFx0PGxpPiR7bW9zdH08L2xpPlxuXHRcdFx0JHttYXRjaC5sZW5ndGggPyBtYXRjaC5qb2luKCcnKSA6ICcnfVxuXHRcdDwvdWw+XG5cdGA7XG59XG5cblxuIiwiLy9QYWdpbmF0aW9uXHJcbmltcG9ydCB7dXBkYXRlSFRNTH0gZnJvbSBcIi4vZmlsdGVyLWhlbHBlcnNcIjtcclxuaW1wb3J0IHskc3RhdGlzdGljV3JhcHBlciwgJHVzZXJDb250YWluZXJ9IGZyb20gXCIuL2RhdGFcIjtcclxuaW1wb3J0IHtkaXNwbGF5UHJvZmlsZSwgZGlzcGxheVN0YXRpc3RpY30gZnJvbSBcIi4vaHRtbC10ZW1wbGF0ZVwiO1xyXG5pbXBvcnQge2NhcmRDb3VudFZhbH0gZnJvbSBcIi4vZmlsdGVycy9jYXJkLWNvdW50LWZpbHRlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0ICRwYWdpbmF0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBhZ2luYXRpb24nKTtcclxubGV0IHBhZ2UgPSAwO1xyXG5cclxuXHJcbi8vUGFnaW5hdGlvblxyXG5leHBvcnQgZnVuY3Rpb24gcGFnaW5hdGlvbigpIHtcclxuXHRsZXQgcGVyUGFnZSA9IE51bWJlcihjYXJkQ291bnRWYWwpO1xyXG5cdGNvbnN0IHt1c2Vyc30gPSBzdG9yZTtcclxuXHRjb25zdCB1c2VyTGVuZ3RoID0gdXNlcnMubGVuZ3RoO1xyXG5cdGlmIChpc05hTihwZXJQYWdlKSkge1xyXG5cdFx0cGVyUGFnZSA9IHVzZXJzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFnZSArIHBlclBhZ2U7IGkrKykge1xyXG5cdFx0JHVzZXJDb250YWluZXIuaW5uZXJIVE1MID0gc3RvcmUudXNlcnMubWFwKGRpc3BsYXlQcm9maWxlKS5qb2luKCcnKTtcclxuXHRcdHVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcblx0XHRcdHVzZXIuZGlzcGxheSA9IHVzZXIuaWQgPCBwZXJQYWdlO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdCRwYWdpbmF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcblx0XHRpZiAodGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dXNlcnMuZm9yRWFjaCh1c2VyID0+IHVzZXIuZGlzcGxheSA9IGZhbHNlKTtcclxuXHRcdFx0cGFnZSA9IGdldFBhZ2VMZW5ndGgodGFyZ2V0LmRhdGFzZXQucGFnZSwgdXNlckxlbmd0aCwgcGFnZSwgcGVyUGFnZSk7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gcGFnZTsgaSA8IHBhZ2UgKyBwZXJQYWdlOyBpKyspIHtcclxuXHRcdFx0XHR1c2Vyc1tpXS5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR1cGRhdGVIVE1MKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JHN0YXRpc3RpY1dyYXBwZXIuaW5uZXJIVE1MID0gZGlzcGxheVN0YXRpc3RpYygpO1xyXG59XHJcblxyXG4vLyBDYXJkcyBQZXIgUGFnZVxyXG5mdW5jdGlvbiBnZXRQYWdlTGVuZ3RoKGRhdGFQYWdlLCB1c2VyTGVuZ3RoLCBwYWdlLCBwZXJQYWdlKSB7XHJcblx0aWYgKGRhdGFQYWdlID09PSAnbmV4dCcpIHtcclxuXHRcdGlmIChwYWdlICsgKHBlclBhZ2UgKiAyKSA8PSB1c2VyTGVuZ3RoKSB7XHJcblx0XHRcdHBhZ2UgPSBwYWdlICsgcGVyUGFnZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBhZ2UgPSB1c2VyTGVuZ3RoIC0gcGVyUGFnZTtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGRhdGFQYWdlID09PSAncHJldmlvdXMnICYmIHBhZ2UgIT09IDApIHtcclxuXHRcdHBhZ2UgPSBwYWdlIC0gcGVyUGFnZVxyXG5cdH0gZWxzZSBpZiAoZGF0YVBhZ2UgPT09ICdmaXJzdCcpIHtcclxuXHRcdHBhZ2UgPSAwO1xyXG5cdH0gZWxzZSBpZiAoZGF0YVBhZ2UgPT09ICdsYXN0Jykge1xyXG5cdFx0cGFnZSA9IHVzZXJMZW5ndGggLSBwZXJQYWdlO1xyXG5cdH1cclxuXHRyZXR1cm4gcGFnZTtcclxufSIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RvcmUgPSB7fTtcbndpbmRvdy5zdG9yZSA9IHN0b3JlO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9kYXRhJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlcnMvc2VhcmNoLWZpbHRlcicpO1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9maWx0ZXJzL2dlbmRlci1maWx0ZXInKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvZmlsdGVycy9hbHBoYWJldGljYWwtZmlsdGVyJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlcnMvYWdlLWZpbHRlcicpO1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9maWx0ZXJzL2NhcmQtY291bnQtZmlsdGVyJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL3BhZ2luYXRpb24nKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvZmlsdGVyLWhlbHBlcnMnKTtcbn0pO1xuXG4iXX0=
