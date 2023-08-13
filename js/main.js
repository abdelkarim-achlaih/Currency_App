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
	// Fetch Data From API

	let data = await fetch(
		"https://api.currencyfreaks.com/v2.0/rates/latest?apikey=7cc0980b4f584b92b78cc967926526a9"
	);
	let allData = await data.json();
	let ratesObject = allData.rates;

	let codes = Object.keys(ratesObject);
	codes.sort();

	// Create Options;
	removeLoader();
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

	//Initialising Rates Simulation

	rateFrom.firstElementChild.innerHTML = Math.round(ratesObject[codeFrom]);
	rateFrom.lastElementChild.innerHTML = codeFrom;

	let rate = Math.round(ratesObject[codeTo] * 10000) / 10000;

	rateTo.firstElementChild.innerHTML = rate;
	rateTo.lastElementChild.innerHTML = codeTo;

	//Initialising Settings Final rate

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

	return ratesObject;
}

function loader() {
	let ele = document.createElement("div");
	ele.classList.add("lds-ring");
	for (let i = 0; i < 3; i++) {
		let div = document.createElement("div");
		ele.appendChild(div);
	}
	let tmp = [];
	for (let i = 0; i < 4; i++) {
		tmp[i] = ele.cloneNode(true);
	}

	settingsFrom.prepend(tmp[0]);
	settingsTo.prepend(tmp[1]);
	rateFrom.prepend(tmp[2]);
	rateTo.prepend(tmp[3]);
}
function removeLoader() {
	settingsFrom.firstElementChild.remove();
	settingsTo.firstElementChild.remove();
	rateFrom.firstElementChild.remove();
	rateTo.firstElementChild.remove();
}

loader();

let ratesObject = await createOptions();

btn.onclick = function () {
	result.innerHTML = input.value * settings.dataset.rate;
};

switcher.onclick = function () {
	//Switch Settings

	//Switch Settings Animation

	animate(switcher, "rotate", 700);
	animate(settingsFrom, "animate-right", 700);
	animate(settingsTo, "animate-left", 700);

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

	// Switch Rates Simulation

	//Switch Settings Animation

	animate(rateFrom, "animate-right", 700);
	animate(rateTo, "animate-left", 700);

	//Switch Settings Logic

	let tmpo = rateFrom.lastElementChild.innerHTML;
	rateFrom.lastElementChild.innerHTML = rateTo.lastElementChild.innerHTML;
	rateTo.lastElementChild.innerHTML = tmpo;

	rateTo.firstElementChild.innerHTML = calculateRate(ratesObject);

	settings.dataset.rate = calculateRate(ratesObject);
};

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

function animate(node, className, time) {
	node.classList.add(className);
	setTimeout(() => {
		node.classList.remove(className);
	}, time);
}
