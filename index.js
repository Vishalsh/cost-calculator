const billingType = {
  DAILY: 'daily',
  HOURLY: 'hourly'
};

class CurrencyDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyOptions: [],
      isLoading: true,
      selectedCurrencies: []
    };

    this.addCurrency = this.addCurrency.bind(this);
  }

  componentDidMount() {
    fetch('https://openexchangerates.org/api/currencies.json')
      .then(result => {
        return result.json();
      })
      .then(data => {
        let currencyOptions = Object.keys(data).map((currencyLabel) => {
          return {
            value: currencyLabel,
            label: `${currencyLabel}: ${data[currencyLabel]}`
          }
        });

        this.setState({
          currencyOptions,
          isLoading: false
        })
      });
  }

  addCurrency(selectedCurrency) {
    this.props.onCurrencySelect(selectedCurrency);
  }

  render() {
    return (
      <Select
        name="form-field-name"
        value={this.state.selectedCurrencies}
        joinValues={true}
        options={this.state.currencyOptions}
        isLoading={this.state.isLoading}
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
        this[currency.value].value = fx.convert(Number.parseFloat(nextProps.billingAmount), {
          from: nextProps.currencyExchangeRate.base,
          to: currency.value
        }).toFixed(2)
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
                       for={`${currency.value}_${this.props.billingType}`}>{currency.value} - {currency.label}</label>
                <input
                  type="text"
                  className="form__control"
                  id={`${currency.value}_${this.props.billingType}`}
                  onChange={() => this.onBaseCurrencyValueChange(currency.value)}
                  ref={(input) => {
                    this[currency.value] = input;
                  }}
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
      selectedCurrencies: [
        {value: 'INR', label: 'Indian Rupee'},
        {value: 'USD', label: 'United States Dollar'},
        {value: 'GBP', label: 'British Pound Sterling'}
      ],
      currencyExchangeRate: {},
      isFetchingExchangeRate: false
    };

    this.onCurrencySelect = this.onCurrencySelect.bind(this);
    this.setBaseCurrencyValue = this.setBaseCurrencyValue.bind(this);
    this.getExchangeValue = this.getExchangeValue.bind(this);
  }

  onCurrencySelect(selectedCurrency) {
    this.setState({
      selectedCurrencies: [...this.state.selectedCurrencies, selectedCurrency]
    });
  }

  setBaseCurrencyValue(baseCurrency, value, billingType) {
    this.baseCurrency = baseCurrency;
    this.baseCurrencyValue = Number.parseFloat(value);
    this.billingType = billingType;
  }

  getExchangeValue(e) {
    e.preventDefault();

    this.setState({
      isFetchingExchangeRate: true
    });

    const selectedCurrencies = this.state.selectedCurrencies.map(currency => currency.value).join(',');

    fetch(`http://api.fixer.io/latest?base=${this.baseCurrency}&symbols=${selectedCurrencies}`)
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
        {/*<CurrencyDropdown onCurrencySelect={this.onCurrencySelect}/>*/}

        <form className="form" onSubmit={this.getExchangeValue}>
          <div className="flex-box">
            <div className="flex-box__item">
              <h2>Daily Billing rate</h2>
              <CurrencyList currencies={this.state.selectedCurrencies}
                            onBaseCurrencyValueChange={this.setBaseCurrencyValue}
                            currencyExchangeRate={this.state.currencyExchangeRate}
                            billingType={billingType.DAILY}
                            billingAmount={this.billingType === billingType.DAILY ? this.baseCurrencyValue : this.baseCurrencyValue * 8}
              />
            </div>

            <div className="flex-box__item">
              <h2>Hourly Billing rate</h2>
              <CurrencyList currencies={this.state.selectedCurrencies}
                            onBaseCurrencyValueChange={this.setBaseCurrencyValue}
                            currencyExchangeRate={this.state.currencyExchangeRate}
                            billingType={billingType.HOURLY}
                            billingAmount={this.billingType === billingType.HOURLY ? this.baseCurrencyValue : this.baseCurrencyValue / 8}
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
      </div>
    )
  }
}

ReactDOM.render(
  <CostCalculator/>,
  document.getElementById('index')
);