const BILLING_TYPE = {
    DAILY: 'DAILY',
    HOURLY: 'HOURLY'
  },
  DEFAULT_SELECTED_CURRENCIES = [
    {value: 'INR', label: 'INR: Indian Rupee'},
    {value: 'USD', label: 'USD: United States Dollar'},
    {value: 'GBP', label: 'GBP: British Pound Sterling'}
  ],
  CURRENCY_LIST = [
    {value: 'AUD', label: 'AUD: Australian Dollar'},
    {value: 'BGN', label: 'BGN: Bulgarian Lev'},
    {value: 'BRL', label: 'BRL: Brazilian Real'},
    {value: 'CAD', label: 'CAD: Canadian Dollar'},
    {value: 'CHF', label: 'CHF: Swiss Franc'},
    {value: 'CNY', label: 'CNY: Chinese Yuan'},
    {value: 'CZK', label: 'CZK: Czech Koruna'},
    {value: 'DKK', label: 'DKK: Danish Krone'},
    {value: 'GBP', label: 'GBP: British Pound Sterling'},
    {value: 'HKD', label: 'HKD: Hong Kong Dollar'},
    {value: 'HRK', label: 'HRK: Croatian Kuna'},
    {value: 'HUF', label: 'HUF: Hungarian Forint'},
    {value: 'IDR', label: 'IDR: Indonesian Rupiah'},
    {value: 'ILS', label: 'ILS: Israeli New Shekel'},
    {value: 'INR', label: 'INR: Indian Rupee'},
    {value: 'JPY', label: 'JPY: Japanese Yen'},
    {value: 'KRW', label: 'KRW: South Korean Won'},
    {value: 'MXN', label: 'MXN: Mexican Peso'},
    {value: 'MYR', label: 'MYR: Malaysian Ringgit'},
    {value: 'NOK', label: 'NOK: Norwegian Krone'},
    {value: 'NZD', label: 'NZD: New Zealand Dollar'},
    {value: 'PHP', label: 'PHP: Philippine Peso'},
    {value: 'PLN', label: 'PLN: Polish Zloty'},
    {value: 'RON', label: 'RON: Romanian Leu'},
    {value: 'RUB', label: 'RUB: Russian Ruble'},
    {value: 'SEK', label: 'SEK: Swedish Krona'},
    {value: 'SGD', label: 'SGD: Singapore Dollar'},
    {value: 'THB', label: 'THB: Thai Baht'},
    {value: 'TRY', label: 'TRY: Turkish Lira'},
    {value: 'USD', label: 'USD: United States Dollar'},
    {value: 'ZAR', label: 'ZAR: South African Rand'},
  ],
  CURRENCY_EXCHANGE_API = 'http://api.fixer.io/latest';

class CurrencyDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCurrencies: DEFAULT_SELECTED_CURRENCIES
    };
    this.currencyList = CURRENCY_LIST;

    this.addCurrency = this.addCurrency.bind(this);
  }

  addCurrency(selectedCurrencies) {
    this.setState({
      selectedCurrencies
    });
    this.props.onSelectedCurrenciesChange(selectedCurrencies);
  }

  render() {
    return (
      <Select
        name="form-field-name"
        value={this.state.selectedCurrencies}
        multi={true}
        options={this.currencyList}
        onChange={this.addCurrency}
      />
    )
  }
}

class CurrencyList extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.currencyExchangeRate.rates) {
      fx.base = nextProps.currencyExchangeRate.base;
      fx.rates = nextProps.currencyExchangeRate.rates;

      nextProps.currencies.forEach((currency) => {
        if (fx.rates[currency.value]) {
          this[currency.value].value = fx.convert(Number.parseFloat(nextProps.billingRate), {
            from: nextProps.currencyExchangeRate.base,
            to: currency.value
          }).toFixed(2);
        }
      })
    }
  }

  onBaseCurrencyValueChange(currency) {
    this.props.onBaseCurrencyValueChange(currency, this[currency].value, this.props.billingType);
  }

  render() {
    return (
      <div>
        {
          this.props.currencies.map((currency) => {
            return (
              <div className="form__group" key={currency}>
                <label className="form__label"
                       for={`${currency.value}_${this.props.billingType}`}>{currency.label}</label>
                <input
                  type="text"
                  className="form__control"
                  id={`${currency.value}_${this.props.billingType}`}
                  onChange={() => this.onBaseCurrencyValueChange(currency.value)}
                  ref={(input) => {
                    this[currency.value] = input;
                  }}
                  autoComplete="off"
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

class CostCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCurrencies: DEFAULT_SELECTED_CURRENCIES,
      currencyExchangeRate: {},
      isFetchingExchangeRate: false,
    };

    this.onSelectedCurrenciesChange = this.onSelectedCurrenciesChange.bind(this);
    this.setBaseCurrencyValue = this.setBaseCurrencyValue.bind(this);
    this.getExchangeRate = this.getExchangeRate.bind(this);
  }

  onSelectedCurrenciesChange(selectedCurrencies) {
    this.setState({
      selectedCurrencies
    });
  }

  setBaseCurrencyValue(baseCurrency, baseCurrencyValue, billingType) {
    this.baseCurrency = baseCurrency;
    this.baseCurrencyValue = baseCurrencyValue;
    this.billingType = billingType;
  }

  getExchangeRate(e) {
    e.preventDefault();

    if (!this.baseCurrencyValue) {
      return;
    }

    this.setState({
      isFetchingExchangeRate: true
    });

    const selectedCurrencies = this.state.selectedCurrencies.map(currency => currency.value).join(',');

    fetch(`${CURRENCY_EXCHANGE_API}?base=${this.baseCurrency}&symbols=${selectedCurrencies}`)
      .then(result => {
        return result.json();
      })
      .then(data => {
        this.setState({
          currencyExchangeRate: data,
          isFetchingExchangeRate: false
        });
      })
  };

  render() {
    return (
      <div className="content-container">
        <CurrencyDropdown
          onSelectedCurrenciesChange={this.onSelectedCurrenciesChange}
        />

        {
          this.state.selectedCurrencies.length ?
            <form className="form" onSubmit={this.getExchangeRate}>
              <div className="flex-box">
                <div className="flex-box__item">
                  <h2>Daily Billing rate</h2>
                  <CurrencyList currencies={this.state.selectedCurrencies}
                                onBaseCurrencyValueChange={this.setBaseCurrencyValue}
                                currencyExchangeRate={this.state.currencyExchangeRate}
                                billingType={BILLING_TYPE.DAILY}
                                billingRate={this.billingType === BILLING_TYPE.DAILY ? this.baseCurrencyValue : this.baseCurrencyValue * 8}
                  />
                </div>

                <div className="flex-box__item">
                  <h2>Hourly Billing rate</h2>
                  <CurrencyList currencies={this.state.selectedCurrencies}
                                onBaseCurrencyValueChange={this.setBaseCurrencyValue}
                                currencyExchangeRate={this.state.currencyExchangeRate}
                                billingType={BILLING_TYPE.HOURLY}
                                billingRate={this.billingType === BILLING_TYPE.HOURLY ? this.baseCurrencyValue : this.baseCurrencyValue / 8}
                  />
                </div>
              </div>

              <div className="form__group text-center">
                <button type="submit" className="form__btn">
                  Get Value
                </button>
              </div>

              <div className={`loading-overlay ${this.state.isFetchingExchangeRate ? 'show' : ''}`}>
                <strong className="loading-overlay__content">Fetching Latest Exchange Rate...</strong>
              </div>
            </form>
            :
            <h2>Select currencies for exchange rate</h2>
        }
      </div>
    )
  }
}

ReactDOM.render(
  <CostCalculator/>,
  document.getElementById('index')
);