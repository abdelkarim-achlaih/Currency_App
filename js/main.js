import { country_list } from "../js/countries.js";
let input = document.querySelector(".converter input");
let settings = document.querySelector(".converter .settings");
let settingsFrom = document.querySelector(".converter .settings .from .drop");
let settingsTo = document.querySelector(".converter .settings .to .drop");
let switcher = document.querySelector(".converter .settings .symbol");
let rateFrom = document.querySelector(".converter .rate .from");
let rateTo = document.querySelector(".converter .rate .to");
let btn = document.querySelector(".converter .exchange");
let result = document.querySelector(".converter .result");

async function createOptions() {
	let data = await fetch("/js/data.json");
	let allData = await data.json();
	let ratesObject = allData.rates;

	let codes = Object.keys(ratesObject);
	codes.sort();

	for (let i = 0; i < codes.length; i++) {
		let option = document.createElement("option");
		option.value = codes[i];
		option.innerHTML = codes[i];
		let toOption = option.cloneNode(true);
		settingsFrom.lastElementChild.append(option);
		settingsTo.lastElementChild.append(toOption);
	}

	//Initialising Settings

	let codeFrom = "USD";
	let codeTo = "MAD";

	settingsFrom.firstElementChild.src = getImgLink(codeFrom, country_list);
	settingsFrom.lastElementChild.value = codeFrom;
	settingsTo.firstElementChild.src = getImgLink(codeTo, country_list);
	settingsTo.lastElementChild.value = codeTo;

	// settingsFrom.dataset.pos = "left";
	// settingsTo.dataset.pos = "right";

	//Initialising Rates

	rateFrom.firstElementChild.innerHTML = Math.round(ratesObject[codeFrom]);
	rateFrom.lastElementChild.innerHTML = codeFrom;

	let rate = Math.round(ratesObject[codeTo] * 10000) / 10000;

	rateTo.firstElementChild.innerHTML = rate;
	rateTo.lastElementChild.innerHTML = codeTo;

	//Initialising Settings rate

	settings.dataset.rate = calculateRate(ratesObject);

	//Change Rates simulation based on the change in settings

	settingsFrom.lastElementChild.addEventListener("change", function (e) {
		rateTo.firstElementChild.innerHTML = calculateRate(ratesObject);
		rateFrom.lastElementChild.innerHTML = e.target.value;
		settingsFrom.firstElementChild.src = getImgLink(
			e.target.value,
			country_list
		);
		settings.dataset.rate = calculateRate(ratesObject);
	});

	settingsTo.lastElementChild.addEventListener("change", function (e) {
		rateTo.firstElementChild.innerHTML = calculateRate(ratesObject);
		rateTo.lastElementChild.innerHTML = e.target.value;
		settingsTo.firstElementChild.src = getImgLink(e.target.value, country_list);
		settings.dataset.rate = calculateRate(ratesObject);
	});
}

createOptions();

function calculateRate(ratesObject) {
	let down =
		ratesObject[
			document.querySelector(
				".converter .settings div:first-child .drop select"
			).value
		];
	let up =
		ratesObject[
			document.querySelector(".converter .settings div:last-child .drop select")
				.value
		];
	return Math.round((up / down) * 10000) / 10000;
}

function getImgLink(code, country_list) {
	return `https://flagsapi.com/${country_list[code]}/flat/32.png`;
}

btn.onclick = function () {
	result.innerHTML = input.value * settings.dataset.rate;
};

switcher.onclick = function () {
	//Switch Settings

	//Switch Settings Animation

	settingsFrom.classList.add("animate-right");
	setTimeout(() => {
		settingsFrom.classList.remove("animate-right");
	}, 700);
	settingsTo.classList.add("animate-left");
	setTimeout(() => {
		settingsTo.classList.remove("animate-left");
	}, 700);

	//Switch Settings Logic

	let tmp = settingsFrom.lastElementChild.value;
	settingsFrom.lastElementChild.value = settingsTo.lastElementChild.value;
	settingsTo.lastElementChild.value = tmp;
	settingsFrom.firstElementChild.src = getImgLink(
		settingsFrom.lastElementChild.value,
		country_list
	);
	settingsTo.firstElementChild.src = getImgLink(
		settingsTo.lastElementChild.value,
		country_list
	);

	//Switch Rate

	// let tmp2 = rateFrom.parentNode.dataset.tmp;
	// if (tmp2 === "false") {
	// 	rateFrom.style.order = 3;
	// 	rateTo.style.order = 1;
	// 	rateFrom.parentNode.dataset.tmp = "true";
	// } else {
	// 	rateFrom.style.order = 1;
	// 	rateTo.style.order = 3;
	// 	rateFrom.parentNode.dataset.tmp = "false";
	// }

	// if (rateFrom.firstElementChild.innerHTML !== 1) {
	// 	rateFrom.firstElementChild.innerHTML =
	// 		Math.round((1 / rateTo.firstElementChild.innerHTML) * 10000) / 10000;
	// 	rateTo.firstElementChild.innerHTML = 1;

	// 	switcher.dataset.x = rateFrom.firstElementChild.innerHTML;
	// }
};
function switchRates() {}
