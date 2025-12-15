const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

let exchangeRates = {};
let currencies = [];

function fetchExchangeRates() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            exchangeRates = data.rates;
            currencies = Object.keys(exchangeRates);
            populateCurrencySelectors();
        })
        .catch(error => console.error('Error fetching exchange rates:', error));
}

function populateCurrencySelectors() {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    currencies.forEach(currency => {
        let option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        fromCurrencySelect.appendChild(option);

        option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        toCurrencySelect.appendChild(option);
    });
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount <= 0) {
        document.getElementById('result').textContent = 'Please enter a valid amount.';
        return;
    }

    if (fromCurrency === toCurrency) {
        document.getElementById('result').textContent = `You entered ${amount} ${fromCurrency}.`;
        return;
    }

    const exchangeRateFrom = exchangeRates[fromCurrency];
    const exchangeRateTo = exchangeRates[toCurrency];

    if (!exchangeRateFrom || !exchangeRateTo) {
        document.getElementById('result').textContent = 'Invalid currency selected.';
        return;
    }

    const resultAmount = (amount * exchangeRateTo) / exchangeRateFrom;
    document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${resultAmount.toFixed(2)} ${toCurrency}`;
}

fetchExchangeRates();
