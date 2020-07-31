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
  var target;

  if (isNaN(perPage)) {
    perPage = userLength;
  }

  for (var i = 0; i < page + perPage; i++) {
    _data.$userContainer.innerHTML = store.users.map(_htmlTemplate.displayProfile).join('');
    users.forEach(function (user) {
      user.display = user.id < perPage;
    });
  }

  $pagination.addEventListener('click', function (event) {
    target = event.target;

    if (target !== undefined) {
      if (target.dataset.page === 'next') {
        if (page + perPage * 2 <= users.length) {
          page = page + perPage;
        } else {
          page = users.length - perPage;
        }
      } else if (target.dataset.page === 'previous' && page !== 0) {
        page = page - perPage;
      } else if (target.dataset.page === 'first') {
        page = 0;
      } else if (target.dataset.page === 'last') {
        page = userLength - perPage;
      }

      users.forEach(function (user) {
        user.display = false;
      });

      for (var _i = page; _i < page + perPage; _i++) {
        users[_i].display = true;
      }

      (0, _filterHelpers.updateHTML)();
    }
  });
  _data.$statisticWrapper.innerHTML = (0, _htmlTemplate.displayStatistic)();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2RhdGEuanMiLCJqcy9jb21wb25lbnRzL2ZpbHRlci1oZWxwZXJzLmpzIiwianMvY29tcG9uZW50cy9maWx0ZXJzL2FnZS1maWx0ZXIuanMiLCJqcy9jb21wb25lbnRzL2ZpbHRlcnMvYWxwaGFiZXRpY2FsLWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9jYXJkLWNvdW50LWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9nZW5kZXItZmlsdGVyLmpzIiwianMvY29tcG9uZW50cy9maWx0ZXJzL25hdGlvbmFsaXR5LWZpbHRlci5qcyIsImpzL2NvbXBvbmVudHMvZmlsdGVycy9zZWFyY2gtZmlsdGVyLmpzIiwianMvY29tcG9uZW50cy9oZWxwZXIuanMiLCJqcy9jb21wb25lbnRzL2h0bWwtdGVtcGxhdGUuanMiLCJqcy9jb21wb25lbnRzL3BhZ2luYXRpb24uanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUdBLElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixDQUF2QjtBQUNBLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQWhCO0FBQ08sSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIscUJBQXZCLENBQXZCOztBQUNBLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBMUI7O0FBQ1AsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCLENBQXJCLEMsQ0FFQTs7QUFDQSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsWUFBWTtBQUNwRDtBQUNBLE1BQU0sYUFBYSxHQUFHLElB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TyxtQkFBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTyxvQ0FBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTyxvQ0FBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTywwQ0FBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTyxpQ0FBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTyx3Q0FBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTyw2QkFBUDtBQUFBO0FBQ0E7QUFBQSwyQ0FBTyx5QkFBUDtBQUFBO0FBQ0EsQ0FURCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7Z2V0TmF0aW9uYWxpdHksIHNlbmRSZXF1ZXN0fSBmcm9tICcuL2hlbHBlcic7XG5pbXBvcnQge25hdGlvbkZpbHRlcn0gZnJvbSBcIi4vZmlsdGVycy9uYXRpb25hbGl0eS1maWx0ZXJcIjtcbmltcG9ydCB7JHBhZ2luYXRpb24sIHBhZ2luYXRpb259IGZyb20gXCIuL3BhZ2luYXRpb25cIjtcbmltcG9ydCB7c29ydEJ5R2VuZGVyfSBmcm9tIFwiLi9maWx0ZXJzL2dlbmRlci1maWx0ZXJcIjtcblxuXG5jb25zdCAkZG93bmxvYWRVc2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1sb2FkLXVzZXJzJyk7XG5jb25zdCAkbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWxvYWRlcicpO1xuZXhwb3J0IGNvbnN0ICR1c2VyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXVzZXJzLWNvbnRhaW5lcicpO1xuZXhwb3J0IGNvbnN0ICRzdGF0aXN0aWNXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXN0YXRpc3RpYycpO1xuY29uc3QgJGZpbHRlcnNXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWZpbHRlcnMtd3JhcCcpO1xuXG4vLyBHZXQgVXNlcnMgQW5kIEVudGVyIGluIEJyb3dzZXJcbiRkb3dubG9hZFVzZXJzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHQvL0dlbmVyYXRlIFVzZXJzIENvdW50XG5cdGNvbnN0IHVzZXJzTGlzdFNpemUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpO1xuXHQvL0NsZWFyIFZhbHVlc1xuXHQkdXNlckNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblx0JHN0YXRpc3RpY1dyYXBwZXIuaW5uZXJIVE1MID0gJyc7XG5cdC8vQWN0aXZhdGUgUHJlbG9hZGVyXG5cdCRsb2FkZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdC8vIFJlcXVlc3QgQW5kIEVudGVyIFVzZXJzIHdpdGggRGF0YSBhbmQgU3RhdGlzdGljXG5cdHRyeSB7XG5cdFx0c2VuZFJlcXVlc3QoYGh0dHBzOi8vcmFuZG9tdXNlci5tZS9hcGkvP3Jlc3VsdHM9JHt1c2Vyc0xpc3RTaXplfWApXG5cdFx0XHQudGhlbigoe3Jlc3VsdHN9KSA9PiB7XG5cdFx0XHRcdHN0b3JlLnVzZXJzID0gcmVzdWx0cy5tYXAoKHVzZXIsIGkpID0+ICh7Li4udXNlciwgZGlzcGxheTogdHJ1ZSwgaWQ6IGl9KSk7XG5cdFx0XHRcdCRsb2FkZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdCRmaWx0ZXJzV3JhcC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2luYXRpb24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdGdldE5hdGlvbmFsaXR5KCk7XG5cdFx0XHRcdG5hdGlvbkZpbHRlcigpO1xuXHRcdFx0XHRzb3J0QnlHZW5kZXIoKTtcblx0XHRcdFx0cGFnaW5hdGlvbigpO1xuXHRcdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0JGxvYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRhbGVydC5lcnJvcign0J/QvtC/0YDQvtCx0YPQudGC0LUg0L7RgtC/0YDQsNCy0LjRgtGMINC30LDQv9GA0L7RgSDQv9C+0LLRgtC+0YDQvdC+Jyk7XG5cdH1cbn0pO1xuXG5cbiIsIi8vIEZpbHRlciBCeSBOYW1lLEVtYWlsLFBob25lXG5pbXBvcnQge2Rpc3BsYXlQcm9maWxlLCBkaXNwbGF5U3RhdGlzdGljfSBmcm9tIFwiLi9odG1sLXRlbXBsYXRlXCI7XG5pbXBvcnQgeyRzdGF0aXN0aWNXcmFwcGVyLCAkdXNlckNvbnRhaW5lcn0gZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7cGFnaW5hdGlvbn0gZnJvbSBcIi4vcGFnaW5hdGlvblwiO1xuaW1wb3J0ICB7aW5wdXR9IGZyb20gXCIuL2ZpbHRlcnMvc2VhcmNoLWZpbHRlclwiXG5pbXBvcnQgeyRhZ2VTZWxlY3R9IGZyb20gXCIuL2ZpbHRlcnMvYWdlLWZpbHRlclwiO1xuaW1wb3J0IHskbmF0aW9uU2VsZWN0fSBmcm9tIFwiLi9maWx0ZXJzL25hdGlvbmFsaXR5LWZpbHRlclwiO1xuaW1wb3J0IHskY2FyZEZpbHRlciwgY2FyZENvdW50VmFsfSBmcm9tIFwiLi9maWx0ZXJzL2NhcmQtY291bnQtZmlsdGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVIVE1MKCkge1xuXHQkdXNlckNvbnRhaW5lci5pbm5lckhUTUwgPSBzdG9yZS51c2Vycy5tYXAoZGlzcGxheVByb2ZpbGUpLmpvaW4oJycpO1xuXHQkc3RhdGlzdGljV3JhcHBlci5pbm5lckhUTUwgPSBkaXNwbGF5U3RhdGlzdGljKCk7XG59XG5cbi8vIENvbXBhcmUgbmFtZSB3aXRob3V0IHJlcGVhdFxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBhcmVOYW1lKGEsIGIpIHtcblx0aWYgKGEubmFtZS5maXJzdCA8IGIubmFtZS5maXJzdCkge1xuXHRcdHJldHVybiAtMTtcblx0fSBlbHNlIGlmIChhLm5hbWUuZmlyc3QgPiBiLm5hbWUuZmlyc3QpIHtcblx0XHRyZXR1cm4gMTtcblx0fVxuXHRyZXR1cm4gMDtcbn1cblxuLy9SZXNldCBCdXR0b25cblxuY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmVzZXQtZmlsdGVycycpO1xuY29uc3QgJGRlZmF1bHRSYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaG93LWFsbCcpO1xucmVzZXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uICgpIHtcblx0JGRlZmF1bHRSYWRpby5jaGVja2VkID0gdHJ1ZTtcblx0aW5wdXQudmFsdWUgPSAnJztcblx0JGFnZVNlbGVjdC52YWx1ZSA9ICdBbnkgQWdlJztcblx0JG5hdGlvblNlbGVjdC52YWx1ZSA9ICdBbGwgTmF0aW9uYWxpdGllcyc7XG5cdCRjYXJkRmlsdGVyLnZhbHVlID0gJzUnO1xuXHRsZXQgcmVzZXRDYXJkcyA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XG5cdCRjYXJkRmlsdGVyLmRpc3BhdGNoRXZlbnQocmVzZXRDYXJkcyk7XG59KTsiLCIvLyBBZ2UgU29ydFxyXG5pbXBvcnQge3VwZGF0ZUhUTUx9IGZyb20gXCIuLi9maWx0ZXItaGVscGVyc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0ICRhZ2VTZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYWdlLWZpbHRlcicpO1xyXG5jb25zdCBzZWxlY3REYXRhID0ge1xyXG5cdHZPbmU6ICd1bmRlci0zNScsXHJcblx0dlR3bzogJ2Zyb20tMzUtdG8tNDAnLFxyXG5cdHZUaHJlZTogJ2Zyb20tNDAtNDUnLFxyXG5cdHZGb3VyOiAnb3Zlci00NScsXHJcblx0dkZpdmU6ICdhbnknLFxyXG59O1xyXG5pZiAoJGFnZVNlbGVjdCkge1xyXG5cdCRhZ2VTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGFjdGl2ZVNlbGVjdCA9IHRoaXMucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKS5kYXRhc2V0LmFnZTtcclxuXHRcdGNvbnN0IFVTRVJTID0gc3RvcmUudXNlcnM7XHJcblx0XHRVU0VSUy5mb3JFYWNoKHVzZXIgPT4ge1xyXG5cdFx0XHR1c2VyLmRpc3BsYXkgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHVzZXIuZG9iLmFnZSA8IDM1ICYmIGFjdGl2ZVNlbGVjdCA9PT0gc2VsZWN0RGF0YS52T25lKSB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIGlmICgodXNlci5kb2IuYWdlID49IDM1ICYmIHVzZXIuZG9iLmFnZSA8PSA0MCkgJiYgYWN0aXZlU2VsZWN0ID09PSBzZWxlY3REYXRhLnZUd28pIHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCh1c2VyLmRvYi5hZ2UgPj0gNDAgJiYgdXNlci5kb2IuYWdlIDw9IDQ1KSAmJiBhY3RpdmVTZWxlY3QgPT09IHNlbGVjdERhdGEudlRocmVlKSB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIGlmICh1c2VyLmRvYi5hZ2UgPiA0NSAmJiBhY3RpdmVTZWxlY3QgPT09IHNlbGVjdERhdGEudkZvdXIpIHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGFjdGl2ZVNlbGVjdCA9PT0gc2VsZWN0RGF0YS52Rml2ZSkge1xyXG5cdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dXBkYXRlSFRNTCgpO1xyXG5cdH0pO1xyXG59IiwiLy8gQWxwaGFiZXRpY2FsIFNvcnRcclxuaW1wb3J0IHt1cGRhdGVIVE1MLGNvbXBhcmVOYW1lfSBmcm9tIFwiLi4vZmlsdGVyLWhlbHBlcnNcIjtcclxuXHJcbmNvbnN0ICRuYW1lU29ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1uYW1lLXNvcnQnKTtcclxuaWYgKCRuYW1lU29ydCkge1xyXG5cdCRuYW1lU29ydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNvcnRCeU5hbWUpO1xyXG59XHJcblxyXG4vLyBBbHBoYWJldGljYWwgU29ydCBIZWxwZXJcclxuZnVuY3Rpb24gc29ydEJ5TmFtZSgpIHtcclxuXHRzdG9yZS51c2Vycy5zb3J0KGNvbXBhcmVOYW1lKTtcclxuXHR1cGRhdGVIVE1MKCk7XHJcbn0iLCJpbXBvcnQge3BhZ2luYXRpb259IGZyb20gXCIuLi9wYWdpbmF0aW9uXCI7XHJcblxyXG4vLyBGaWx0ZXIgQ2FyZHMgQ291bnQgUGVyIFBhZ2VcclxuZXhwb3J0IGxldCBjYXJkQ291bnRWYWwgPSA1O1xyXG5leHBvcnQgY29uc3QgJGNhcmRGaWx0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY2FyZC1jb3VudCcpO1xyXG5cclxuJGNhcmRGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdGNhcmRDb3VudFZhbCA9ICRjYXJkRmlsdGVyLnZhbHVlO1xyXG5cdHBhZ2luYXRpb24oKTtcclxufSk7IiwiLy8gR2VuZGVyIEZpbHRlciBIZWxwZXJcclxuaW1wb3J0IHt1cGRhdGVIVE1MfSBmcm9tIFwiLi4vZmlsdGVyLWhlbHBlcnNcIjtcclxuXHJcbmZ1bmN0aW9uIGdlbmRlckZpbHRlcih1c2VycywgbWFsZSwgZmVtYWxlLCBhbGwpIHtcclxuXHR1c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xyXG5cdFx0dXNlci5kaXNwbGF5ID0gZmFsc2U7XHJcblx0XHRpZiAodXNlci5nZW5kZXIgPT09IGZlbWFsZSkge1xyXG5cdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmICh1c2VyLmdlbmRlciA9PT0gbWFsZSkge1xyXG5cdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmIChhbGwpIHtcclxuXHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHR1cGRhdGVIVE1MKCk7XHJcbn1cclxuXHJcbi8vIEdlbmRlciBGaWx0ZXJcclxuY29uc3QgJHJhZGlvRmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXJhZGlvLWZpbHRlcicpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRCeUdlbmRlcigpIHtcclxuXHRjb25zdCBVU0VSUyA9IHN0b3JlLnVzZXJzO1xyXG5cdGxldCBtYWxlLCBmZW1hbGUsIGFsbDtcclxuXHRpZiAoJHJhZGlvRmlsdGVyKSB7XHJcblx0XHQkcmFkaW9GaWx0ZXIuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGZlbWFsZSA9ICcnO1xyXG5cdFx0XHRcdG1hbGUgPSAnJztcclxuXHRcdFx0XHRhbGwgPSAnJztcclxuXHRcdFx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcblx0XHRcdFx0Y29uc3QgZGF0YUdlbmRlclR5cGUgPSB0YXJnZXQuZGF0YXNldC5nZW5kZXI7XHJcblx0XHRcdFx0aWYgKHRhcmdldC5jaGVja2VkICYmIGRhdGFHZW5kZXJUeXBlID09PSAnbWFsZScpIHtcclxuXHRcdFx0XHRcdG1hbGUgPSAnbWFsZSc7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0YXJnZXQuY2hlY2tlZCAmJiBkYXRhR2VuZGVyVHlwZSA9PT0gJ2ZlbWFsZScpIHtcclxuXHRcdFx0XHRcdGZlbWFsZSA9ICdmZW1hbGUnO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmNoZWNrZWQgJiYgZGF0YUdlbmRlclR5cGUgPT09ICdhbGwnKSB7XHJcblx0XHRcdFx0XHRhbGwgPSAnYWxsJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Z2VuZGVyRmlsdGVyKFVTRVJTLCBtYWxlLCBmZW1hbGUsIGFsbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiLy9OYXRpb25hbGl0eSBTb3J0XHJcbmltcG9ydCB7Z2V0TmF0aW9uYWxpdHl9IGZyb20gXCIuLi9oZWxwZXJcIjtcclxuaW1wb3J0IHt1cGRhdGVIVE1MfSBmcm9tIFwiLi4vZmlsdGVyLWhlbHBlcnNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCAkbmF0aW9uU2VsZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW5hdGlvbmFsaXR5LWZpbHRlcicpO1xyXG5leHBvcnQgY29uc3QgbmF0aW9uRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG5cdGNvbnN0IFVTRVJTID0gc3RvcmUudXNlcnM7XHJcblx0Y29uc3QgbmF0aW9uYWxpdHkgPSBnZXROYXRpb25hbGl0eSgpO1xyXG5cdGlmICgkbmF0aW9uU2VsZWN0KSB7XHJcblx0XHRjb25zdCB1bmlxdWVOYXQgPSBuYXRpb25hbGl0eS5maWx0ZXIoKGl0ZW0sIGluZGV4KSA9PiBuYXRpb25hbGl0eS5pbmRleE9mKGl0ZW0pID09PSBpbmRleCk7XHJcblx0XHR1bmlxdWVOYXQuZm9yRWFjaChpdGVtID0+ICRuYXRpb25TZWxlY3QuaW5uZXJIVE1MICs9IGA8b3B0aW9uICB2YWx1ZT1cIiR7aXRlbX1cIj4gJHtpdGVtfTwvb3B0aW9uPmApO1xyXG5cdFx0JG5hdGlvblNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGxldCBhY3RpdmVTZWxlY3QgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykudmFsdWU7XHJcblx0XHRcdFVTRVJTLmZvckVhY2godXNlciA9PiB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHVzZXIubmF0ID09PSBhY3RpdmVTZWxlY3QpIHtcclxuXHRcdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChhY3RpdmVTZWxlY3QgPT09ICdhbGwnKSB7XHJcblx0XHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHVwZGF0ZUhUTUwoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufTsiLCJpbXBvcnQgeyRzdGF0aXN0aWNXcmFwcGVyfSBmcm9tIFwiLi4vZGF0YVwiO1xyXG5pbXBvcnQge3VwZGF0ZUhUTUx9IGZyb20gXCIuLi9maWx0ZXItaGVscGVyc1wiO1xyXG5pbXBvcnQgeyRjYXJkRmlsdGVyfSBmcm9tIFwiLi9jYXJkLWNvdW50LWZpbHRlclwiO1xyXG5cclxuLy8gU2VhcmNoIEZpbHRlclxyXG5leHBvcnQgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtaW5wdXQtZmlsdGVyJyk7XHJcbmlmIChpbnB1dCkge1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0JHN0YXRpc3RpY1dyYXBwZXIuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRjb25zdCBmaWx0ZXIgPSBpbnB1dC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0bGV0ICRjaGVja01hbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2hvdy1tYWxlJyk7XHJcblx0XHRsZXQgJGNoZWNrRmVNYWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3ctZmVtYWxlJyk7XHJcblx0XHRsZXQgJGNoZWNrRmVBbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2hvdy1hbGwnKTtcclxuXHJcblx0XHRzdG9yZS51c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xyXG5cdFx0XHRjb25zdCBwaG9uZSA9IHVzZXIucGhvbmU7XHJcblx0XHRcdGNvbnN0IGVtYWlsID0gdXNlci5lbWFpbDtcclxuXHRcdFx0Y29uc3QgbmFtZSA9IHVzZXIubmFtZS5maXJzdC50b0xvd2VyQ2FzZSgpICsgJyAnICsgdXNlci5uYW1lLmxhc3QudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0aWYgKHBob25lLmluZGV4T2YoZmlsdGVyKSA+IC0xIHx8IGVtYWlsLmluZGV4T2YoZmlsdGVyKSA+IC0xIHx8IG5hbWUuaW5kZXhPZihmaWx0ZXIpID4gLTEpIHtcclxuXHRcdFx0XHRpZiAoJGNoZWNrTWFsZS5jaGVja2VkICYmIHVzZXIuZ2VuZGVyICE9PSAnZmVtYWxlJykge1xyXG5cdFx0XHRcdFx0dXNlci5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKCRjaGVja0ZlTWFsZS5jaGVja2VkICYmIHVzZXIuZ2VuZGVyICE9PSAnbWFsZScpIHtcclxuXHRcdFx0XHRcdHVzZXIuZGlzcGxheSA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIGlmICgkY2hlY2tGZUFsbC5jaGVja2VkKSB7XHJcblx0XHRcdFx0XHR1c2VyLmRpc3BsYXkgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1c2VyLmRpc3BsYXkgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR1cGRhdGVIVE1MKCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gc2VuZFJlcXVlc3QodXJsKSB7XG5cdHJldHVybiBmZXRjaCh1cmwpXG5cdFx0LnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmF0aW9uYWxpdHkoKSB7XG5cdGxldCBhcnIgPSBbXTtcblx0Y29uc3QgVVNFUlMgPSBzdG9yZS51c2Vycztcblx0VVNFUlMuZm9yRWFjaCh1c2VyID0+IHtcblx0XHRpZiAodXNlci5kaXNwbGF5ID09PSB0cnVlKSB7XG5cdFx0XHRhcnIucHVzaCh1c2VyLm5hdCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFVc2VyKCkge1xuXHRjb25zdCBVU0VSUyA9IHN0b3JlLnVzZXJzO1xuXHRsZXQgbW9zdDtcblx0bGV0IG1hbGUgPSAwLCBmZW1hbGUgPSAwLCBhbGxVc2VycyA9IDA7XG5cdGNvbnN0IG1hdGNoUmVzdWx0ID0ge30sIG5hdGlvbmFsaXR5ID0gZ2V0TmF0aW9uYWxpdHkoKSwgbWF0Y2ggPSBbXTtcblxuXHRVU0VSUy5mb3JFYWNoKHVzZXIgPT4ge1xuXHRcdGlmICh1c2VyLmRpc3BsYXkpIHtcblx0XHRcdGFsbFVzZXJzICs9IDE7XG5cdFx0fVxuXHRcdGlmICh1c2VyLmRpc3BsYXkgJiYgdXNlci5nZW5kZXIgPT09ICdtYWxlJykge1xuXHRcdFx0bWFsZSArPSAxO1xuXHRcdH0gZWxzZSBpZiAodXNlci5kaXNwbGF5ICYmIHVzZXIuZ2VuZGVyID09PSAnZmVtYWxlJykge1xuXHRcdFx0ZmVtYWxlICs9IDE7XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAoZmVtYWxlID4gbWFsZSkge1xuXHRcdG1vc3QgPSAn0JbQtdC90YnQuNC9INCR0L7Qu9GM0YjQtSc7XG5cdH0gZWxzZSBpZiAobWFsZSA+IGZlbWFsZSkge1xuXHRcdG1vc3QgPSAn0JzRg9C20YfQuNC9INCR0L7Qu9GM0YjQtSc7XG5cdH0gZWxzZSBpZiAobWFsZSA9PT0gZmVtYWxlKSB7XG5cdFx0bW9zdCA9ICfQnNGD0LbRh9C40L0g0Lgg0JbQtdC90YnQuNC9INCe0LTQuNC90LDQutC+0LLQvtC1INCa0L7Qu9C40YfQtdGB0YLQstC+Jztcblx0fSBlbHNlIGlmIChtYWxlID09PSAwICYmIGZlbWFsZSkge1xuXHRcdG1vc3QgPSAn0JzRg9C20YfQuNC9INC4INCW0LXQvdGJ0LjQvSDQsiDQutCw0YLQsNC70L7Qs9C1INC90LXRgidcblx0fVxuXG5cdG5hdGlvbmFsaXR5LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRtYXRjaFJlc3VsdFtpdGVtXSA9IG1hdGNoUmVzdWx0W2l0ZW1dICsgMSB8fCAxO1xuXHR9KTtcblxuXHRmb3IgKGxldCBrZXkgaW4gbWF0Y2hSZXN1bHQpIHtcblx0XHRpZiAobWF0Y2hSZXN1bHRba2V5XSA+IDEpIHtcblx0XHRcdG1hdGNoLnB1c2goYDxsaT7QndCw0YbQuNC+0L3QsNC70YzQvdC+0YHRgtGMOiAke2tleX0g0L/QvtCy0YLQvtGA0Y/QtdGC0YHRjyAke21hdGNoUmVzdWx0W2tleV19INGA0LDQtyjQsCk8L2xpPmApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bWFsZSwgZmVtYWxlLCBhbGxVc2VycywgbmF0aW9uYWxpdHksIG1hdGNoLCBtb3N0XG5cdH1cbn1cblxuIiwiLy8gVXNlciBQcm9maWxlIENhcmRcbmltcG9ydCB7Z2V0RGF0YVVzZXJ9IGZyb20gJy4vaGVscGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlQcm9maWxlKGl0ZW0pIHtcblx0Y29uc3QgY2FyZCA9IGBcblx0PGRpdiBjbGFzcz1cImNvbC1sZy00IGNvbC1tZC02IGNvbC0xMlwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInByb2ZpbGVcIiA+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIke2l0ZW0ucGljdHVyZS5sYXJnZX1cIiBhbHQ9XCJwaWN0dXJlXCI+XG5cdFx0XHRcdFx0PHNwYW4gY2xhc3M9J2dlbmRlcic+JHtpdGVtLmdlbmRlcn08L3NwYW4+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2ZpbGVfX25hbWUganMtcHJvZmlsZS1uYW1lXCI+XG5cdFx0XHRcdFx0XHRcdCR7aXRlbS5uYW1lLmZpcnN0fSAke2l0ZW0ubmFtZS5sYXN0fSBcblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJwcm9maWxlX19pbmZvLWxpc3RcIj5cblx0XHRcdFx0XHRcdDxsaT5cblx0XHRcdFx0XHRcdFx0PHNwYW4+UGhvbmU6PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwidGVsOiNcIiB0aXRsZT1cIkNhbGxcIj5cblx0XHRcdFx0XHRcdFx0XHRcdCR7aXRlbS5waG9uZX1cblx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdDxsaT5cblx0XHRcdFx0XHRcdFx0PHNwYW4+RS1tYWlsOjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIm1haWx0bzojXCIgdGl0bGU9XCJFLW1haWxcIj5cblx0XHRcdFx0XHRcdFx0XHQke2l0ZW0uZW1haWx9XG5cdFx0XHRcdFx0XHRcdDwvYT5cblx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPkFkcmVzczo8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPlxuXHRcdFx0XHRcdFx0XHRcdCR7aXRlbS5sb2NhdGlvbi5jaXR5fSxcblx0XHRcdFx0XHRcdFx0XHQke2l0ZW0ubG9jYXRpb24uY291bnRyeX0sXG5cdFx0XHRcdFx0XHRcdFx0JHtpdGVtLmxvY2F0aW9uLnN0cmVldC5uYW1lfSAtICR7aXRlbS5sb2NhdGlvbi5zdHJlZXQubnVtYmVyfVxuXHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj5CaXJ0aCBkYXRlOjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PHNwYW4+JHtpdGVtLmRvYi5kYXRlfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPlJlZ2lzdGVyIGRhdGU6PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj4ke2l0ZW0ucmVnaXN0ZXJlZC5kYXRlfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0PC91bD5cblx0XHRcdDwvZGl2PlxuXHQ8L2Rpdj5cbmA7XG5cdHJldHVybiBpdGVtLmRpc3BsYXkgPyBjYXJkIDogJyc7XG59XG5cbi8vIER5bmFtaWMgVXNlcnMgU3RhdGlzdGljXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheVN0YXRpc3RpYygpIHtcblx0Y29uc3Qge21hbGUsIGZlbWFsZSwgYWxsVXNlcnMsIG1hdGNoLCBtb3N0fSA9IGdldERhdGFVc2VyKCk7XG5cblx0cmV0dXJuIGBcblx0XHQ8dWwgY2xhc3M9XCJzdGF0aXN0aWMtbGlzdFwiPlxuXHRcdFx0PGxpPtCf0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC5OiAke2FsbFVzZXJzfTwvbGk+XG5cdFx0XHQ8bGk+0JzRg9C20YfQuNC9OiAke21hbGV9PC9saT5cblx0XHRcdDxsaT7QltC10L3RidC40L0gJHtmZW1hbGV9PC9saT5cblx0XHRcdDxsaT4ke21vc3R9PC9saT5cblx0XHRcdCR7bWF0Y2gubGVuZ3RoID8gbWF0Y2guam9pbignJykgOiAnJ31cblx0XHQ8L3VsPlxuXHRgO1xufVxuXG5cbiIsIi8vUGFnaW5hdGlvblxyXG5pbXBvcnQge3VwZGF0ZUhUTUx9IGZyb20gXCIuL2ZpbHRlci1oZWxwZXJzXCI7XHJcbmltcG9ydCB7JHN0YXRpc3RpY1dyYXBwZXIsICR1c2VyQ29udGFpbmVyfSBmcm9tIFwiLi9kYXRhXCI7XHJcbmltcG9ydCB7ZGlzcGxheVByb2ZpbGUsIGRpc3BsYXlTdGF0aXN0aWN9IGZyb20gXCIuL2h0bWwtdGVtcGxhdGVcIjtcclxuaW1wb3J0IHtjYXJkQ291bnRWYWx9IGZyb20gXCIuL2ZpbHRlcnMvY2FyZC1jb3VudC1maWx0ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCAkcGFnaW5hdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wYWdpbmF0aW9uJyk7XHJcbmxldCBwYWdlID0gMDtcclxuXHJcblxyXG4vL1BhZ2luYXRpb25cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZ2luYXRpb24oKSB7XHJcblx0bGV0IHBlclBhZ2UgPSBOdW1iZXIoY2FyZENvdW50VmFsKTtcclxuXHRjb25zdCB7dXNlcnN9ID0gc3RvcmU7XHJcblx0Y29uc3QgdXNlckxlbmd0aCA9IHVzZXJzLmxlbmd0aDtcclxuXHRsZXQgdGFyZ2V0XHJcblx0aWYgKGlzTmFOKHBlclBhZ2UpKSB7XHJcblx0XHRwZXJQYWdlID0gdXNlckxlbmd0aDsgXHJcblx0fVxyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2UgKyBwZXJQYWdlOyBpKyspIHtcclxuXHRcdCR1c2VyQ29udGFpbmVyLmlubmVySFRNTCA9IHN0b3JlLnVzZXJzLm1hcChkaXNwbGF5UHJvZmlsZSkuam9pbignJyk7XHJcblx0XHR1c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xyXG5cdFx0XHR1c2VyLmRpc3BsYXkgPSB1c2VyLmlkIDwgcGVyUGFnZTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHQkcGFnaW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0dGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cdFx0aWYgKHRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGlmICh0YXJnZXQuZGF0YXNldC5wYWdlID09PSAnbmV4dCcpIHtcclxuXHRcdFx0XHRpZiAocGFnZSArIChwZXJQYWdlICogMikgPD0gdXNlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRwYWdlID0gcGFnZSArIHBlclBhZ2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHBhZ2UgPSB1c2Vycy5sZW5ndGggLSBwZXJQYWdlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmICh0YXJnZXQuZGF0YXNldC5wYWdlID09PSAncHJldmlvdXMnICYmIHBhZ2UgIT09IDApIHtcclxuXHRcdFx0XHRwYWdlID0gcGFnZSAtIHBlclBhZ2VcclxuXHRcdFx0fSBlbHNlIGlmICh0YXJnZXQuZGF0YXNldC5wYWdlID09PSAnZmlyc3QnKSB7XHJcblx0XHRcdFx0cGFnZSA9IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmRhdGFzZXQucGFnZSA9PT0gJ2xhc3QnKSB7XHJcblx0XHRcdFx0cGFnZSA9IHVzZXJMZW5ndGggLSBwZXJQYWdlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcblx0XHRcdFx0dXNlci5kaXNwbGF5ID0gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gcGFnZTsgaSA8IHBhZ2UgKyBwZXJQYWdlOyBpKyspIHtcclxuXHRcdFx0XHR1c2Vyc1tpXS5kaXNwbGF5ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR1cGRhdGVIVE1MKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JHN0YXRpc3RpY1dyYXBwZXIuaW5uZXJIVE1MID0gZGlzcGxheVN0YXRpc3RpYygpO1xyXG59XHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzdG9yZSA9IHt9O1xud2luZG93LnN0b3JlID0gc3RvcmU7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2RhdGEnKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvZmlsdGVycy9zZWFyY2gtZmlsdGVyJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlcnMvZ2VuZGVyLWZpbHRlcicpO1xuXHRpbXBvcnQoJy4vY29tcG9uZW50cy9maWx0ZXJzL2FscGhhYmV0aWNhbC1maWx0ZXInKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvZmlsdGVycy9hZ2UtZmlsdGVyJyk7XG5cdGltcG9ydCgnLi9jb21wb25lbnRzL2ZpbHRlcnMvY2FyZC1jb3VudC1maWx0ZXInKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvZmlsdGVyLWhlbHBlcnMnKTtcblx0aW1wb3J0KCcuL2NvbXBvbmVudHMvcGFnaW5hdGlvbicpO1xufSk7XG5cbiJdfQ==
