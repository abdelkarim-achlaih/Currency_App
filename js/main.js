import { country_list } from "../js/countries.js";

let input = document.querySelector(".converter input");
let settings = document.querySelector(".converter .settings");
let settingsFrom = document.querySelector(".converter .settings .from .drop");
let settingsTo = document.querySelector(".converter .settings .to .drop");
let switcher = document.querySelector(".converter .settings .symbol");
let rateFrom = document.querySelector(".converter .rate .from");
let rateTo = document.querySelector(".converter .rate .to");
let outlineFrom = document.querySelector(".outline .from");
let outlineTo = document.querySelector(".outline .to");
let btn = document.querySelector(".converter .exchange");
let result = document.querySelector(".converter .result");
let elements = [
	settingsFrom,
	settingsTo,
	rateFrom,
	rateTo,
	outlineFrom,
	outlineTo,
];
async function createOptions() {
	// Fetch Data From API

	let url =
		"https://api.currencyfreaks.com/v2.0/rates/latest?apikey=7cc0980b4f584b92b78cc967926526a9";
	// let url = "../js/data.json";
	let data = await fetch(url);
	let allData = await data.json();
	let ratesObject = allData.rates;

	let codes = Object.keys(ratesObject);
	codes.sort();

	removeLoader();

	// Create Options;

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

	//Initialising Outline Simulation

	outlineFrom.firstElementChild.innerHTML = Math.round(ratesObject[codeFrom]);
	outlineFrom.lastElementChild.innerHTML = codeFrom;

	outlineTo.firstElementChild.innerHTML = rate;
	outlineTo.lastElementChild.innerHTML = codeTo;

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
	for (let i = 0; i < 6; i++) {
		tmp[i] = ele.cloneNode(true);
	}
	let x = 0;
	elements.forEach((ele) => {
		ele.prepend(tmp[x]);
		x++;
	});
}

function removeLoader() {
	let x = 0;
	elements.forEach((ele) => {
		ele.firstElementChild.remove();
		x++;
	});
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

let instructionsSection = document.querySelector(".instructions");
let instructions = document.querySelectorAll(".instructions .instruction");
let featSection = document.querySelector(".features");
let features = document.querySelectorAll(".features .feature");

let showed = false;
let showed2 = false;

window.onscroll = (_) => {
	if (window.scrollY > instructionsSection.offsetTop && !showed) {
		let time = 0;
		instructions.forEach((instruction) => {
			setTimeout(() => {
				instruction.classList.add("animate");
			}, time);
			time += 700;
		});
		showed = true;
	}
	if (window.scrollY > featSection.offsetTop - 500 && !showed2) {
		featSection.classList.add("animate");
		let time = 700;
		features.forEach((feature) => {
			setTimeout(() => {
				feature.classList.add("animate");
			}, time);
			time += 700;
		});
		showed2 = true;
	}
};
