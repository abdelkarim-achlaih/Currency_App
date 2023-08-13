let from = document.querySelector(".converter .settings .from select");
let to = document.querySelector(".converter .settings .to select");
let rateFrom = document.querySelector(".converter .rate .from");
let rateTo = document.querySelector(".converter .rate .to");
let input = document.querySelector(".converter input");
let btn = document.querySelector(".converter .exchange");
let result = document.querySelector(".converter .result");
let switcher = document.querySelector(".converter .settings .symbol");

async function createOptions() {
	let data = await fetch(
		"https://api.currencyfreaks.com/v2.0/rates/latest?apikey=7cc0980b4f584b92b78cc967926526a9"
	);
	let allData = await data.json();
	let ratesObject = allData.rates;

	let codes = Object.keys(ratesObject);
	codes.sort();

	for (let i = 0; i < codes.length; i++) {
		let option = document.createElement("option");
		option.value = codes[i];
		option.innerHTML = codes[i];
		let toOption = option.cloneNode(true);
		from.append(option);
		to.append(toOption);
	}

	//Initialising

	from.value = "USD";
	to.value = "MAD";
	rateFrom.firstElementChild.innerHTML = Math.round(ratesObject["USD"]);
	rateFrom.lastElementChild.innerHTML = "USD";
	rateTo.firstElementChild.innerHTML =
		Math.round(ratesObject["MAD"] * 10000) / 10000;
	rateTo.lastElementChild.innerHTML = "MAD";

	//Change on events

	from.addEventListener("change", function (e) {
		rateFrom.lastElementChild.innerHTML = e.target.value;
		rateTo.firstElementChild.innerHTML =
			Math.round(
				(ratesObject[to.value] / ratesObject[e.target.value]) * 10000
			) / 10000;
	});
	to.addEventListener("change", function (e) {
		rateTo.firstElementChild.innerHTML =
			Math.round(
				(ratesObject[e.target.value] / ratesObject[from.value]) * 10000
			) / 10000;
		rateTo.lastElementChild.innerHTML = e.target.value;
	});
}

createOptions();

btn.onclick = function () {
	result.innerHTML = input.value * rateTo.firstElementChild.innerHTML;
};

switcher.onclick = function () {
	//Switch Settings
	let tmp = from.parentNode.parentNode.dataset.tmp;
	if (tmp === "false") {
		from.parentNode.style.order = 3;
		to.parentNode.style.order = 1;
		from.parentNode.parentNode.dataset.tmp = "true";
	} else {
		from.parentNode.style.order = 1;
		to.parentNode.style.order = 3;
		from.parentNode.parentNode.dataset.tmp = "false";
	}

	//Switch Rate
};
