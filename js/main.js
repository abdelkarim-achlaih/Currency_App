let response = fetch(
	"https://api.currencyfreaks.com/v2.0/rates/latest?apikey=7cc0980b4f584b92b78cc967926526a9"
)
	.then((res) => {
		return res.json();
	})
	.then((res) => console.log(res.rates.MAD));
