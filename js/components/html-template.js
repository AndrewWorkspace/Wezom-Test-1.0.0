// User Profile Card
import {getDataUser} from './helper';

export function displayProfile(item) {
	const card = `
	<div class="col-lg-4 col-md-6 col-12">
			<div class="profile" >
					<img src="${item.picture.large}" alt="picture">
					<span class='gender'>${item.gender}</span>
					<div class="profile__name js-profile-name">
							${item.name.first} ${item.name.last} 
					</div>
					<ul class="profile__info-list">
						<li>
							<span>Phone:</span>
							<a href="tel:#" title="Call">
									${item.phone}
							</a>
						</li>
						<li>
							<span>E-mail:</span>
							<a href="mailto:#" title="E-mail">
								${item.email}
							</a>
						</li>
						<li>
							<span>Adress:</span>
							<span>
								${item.location.city},
								${item.location.country},
								${item.location.street.name} - ${item.location.street.number}
							</span>
						</li>
						<li>
							<span>Birth date:</span>
							<span>${item.dob.date}</span>
						</li>
						<li>
							<span>Register date:</span>
							<span>${item.registered.date}</span>
						</li>
					</ul>
			</div>
	</div>
`;
	return item.display ? card : '';
}

// Dynamic Users Statistic
export function displayStatistic() {
	const {male, female, allUsers, match, most} = getDataUser();

	return `
		<ul class="statistic-list">
			<li>Пользователей: ${allUsers}</li>
			<li>Мужчин: ${male}</li>
			<li>Женщин ${female}</li>
			<li>${most}</li>
			${match.length ? match.join('') : ''}
		</ul>
	`;
}


