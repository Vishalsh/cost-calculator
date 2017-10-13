const BILLING_TYPE = {
    DAILY: 'DAILY',
    HOURLY: 'HOURLY'
  },
  CURRENCY_LIST = [
    {value: 'AUD', label: 'AUD: Australian Dollar', symbol: '$'},
    {value: 'BGN', label: 'BGN: Bulgarian Lev', symbol: 'лв'},
    {value: 'BRL', label: 'BRL: Brazilian Real', symbol: 'R$'},
    {value: 'CAD', label: 'CAD: Canadian Dollar', symbol: '$'},
    {value: 'CHF', label: 'CHF: Swiss Franc', symbol: 'CHF'},
    {value: 'CNY', label: 'CNY: Chinese Yuan', symbol: '¥'},
    {value: 'CZK', label: 'CZK: Czech Koruna', symbol: 'Kč'},
    {value: 'DKK', label: 'DKK: Danish Krone', symbol: 'kr'},
    {value: 'EUR', label: 'EUR: Euro', symbol: '€'},
    {value: 'GBP', label: 'GBP: British Pound Sterling', symbol: '£', defaultSelected: true},
    {value: 'HKD', label: 'HKD: Hong Kong Dollar', symbol: '$'},
    {value: 'HRK', label: 'HRK: Croatian Kuna', symbol: 'kn'},
    {value: 'HUF', label: 'HUF: Hungarian Forint', symbol: 'Ft'},
    {value: 'IDR', label: 'IDR: Indonesian Rupiah', symbol: 'Rp'},
    {value: 'ILS', label: 'ILS: Israeli New Shekel', symbol: '₪'},
    {value: 'INR', label: 'INR: Indian Rupee', symbol: '₹', defaultSelected: true},
    {value: 'JPY', label: 'JPY: Japanese Yen', symbol: '¥'},
    {value: 'KRW', label: 'KRW: South Korean Won', symbol: '₩'},
    {value: 'MXN', label: 'MXN: Mexican Peso', symbol: '$'},
    {value: 'MYR', label: 'MYR: Malaysian Ringgit', symbol: 'RM'},
    {value: 'NOK', label: 'NOK: Norwegian Krone', symbol: 'kr'},
    {value: 'NZD', label: 'NZD: New Zealand Dollar', symbol: '$'},
    {value: 'PHP', label: 'PHP: Philippine Peso', symbol: '₱'},
    {value: 'PLN', label: 'PLN: Polish Zloty', symbol: 'zł'},
    {value: 'RON', label: 'RON: Romanian Leu', symbol: 'lei'},
    {value: 'RUB', label: 'RUB: Russian Ruble', symbol: '₽'},
    {value: 'SEK', label: 'SEK: Swedish Krona', symbol: 'kr'},
    {value: 'SGD', label: 'SGD: Singapore Dollar', symbol: '$'},
    {value: 'THB', label: 'THB: Thai Baht', symbol: '฿'},
    {value: 'TRY', label: 'TRY: Turkish Lira', symbol: '₺'},
    {value: 'USD', label: 'USD: United States Dollar', symbol: '$', defaultSelected: true},
    {value: 'ZAR', label: 'ZAR: South African Rand', symbol: 'R'},
  ],
  CURRENCY_EXCHANGE_API = 'https://api.fixer.io/latest';

class CurrencyList extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.currencyExchangeRate.rates) {
      fx.base = nextProps.currencyExchangeRate.base;
      fx.rates = nextProps.currencyExchangeRate.rates;

      nextProps.currencies.forEach((currency) => {
        if (fx.rates[currency.value] || fx.base === currency.value) {
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
                <div className="flex-box">
                  <span className="currency-symbol">{currency.symbol}</span>
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
              </div>
            )
          })
        }
      </div>
    )
  }
}

CurrencyList.propTypes = {
  currencies: PropTypes.array.isRequired,
  onBaseCurrencyValueChange: PropTypes.func.isRequired,
  currencyExchangeRate: PropTypes.func.isRequired,
  billingType: PropTypes.string,
  billingRate: PropTypes.number
};

class CostCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.defaultSelectedCurrencies = CURRENCY_LIST.filter(currency => currency.defaultSelected);
    this.state = {
      selectedCurrencies: this.defaultSelectedCurrencies,
      currencyExchangeRate: {},
      isFetchingExchangeRate: false,
    };

    this.setBaseCurrencyValue = this.setBaseCurrencyValue.bind(this);
    this.updateCurrencyList = this.updateCurrencyList.bind(this);
    this.getExchangeRate = this.getExchangeRate.bind(this);
  }

  updateCurrencyList(selectedCurrencies) {
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
        <Select
          name="form-field-name"
          value={this.state.selectedCurrencies}
          multi={true}
          options={CURRENCY_LIST}
          onChange={this.updateCurrencyList}
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

                <button type="reset" value="Reset" className="form__btn form__btn--reset">
                  Reset
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