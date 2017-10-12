'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BILLING_TYPE = {
  DAILY: 'DAILY',
  HOURLY: 'HOURLY'
},
    DEFAULT_SELECTED_CURRENCIES = [{ value: 'INR', label: 'INR: Indian Rupee' }, { value: 'USD', label: 'USD: United States Dollar' }, { value: 'GBP', label: 'GBP: British Pound Sterling' }],
    CURRENCY_LIST = [{ value: 'AUD', label: 'AUD: Australian Dollar' }, { value: 'BGN', label: 'BGN: Bulgarian Lev' }, { value: 'BRL', label: 'BRL: Brazilian Real' }, { value: 'CAD', label: 'CAD: Canadian Dollar' }, { value: 'CHF', label: 'CHF: Swiss Franc' }, { value: 'CNY', label: 'CNY: Chinese Yuan' }, { value: 'CZK', label: 'CZK: Czech Koruna' }, { value: 'DKK', label: 'DKK: Danish Krone' }, { value: 'GBP', label: 'GBP: British Pound Sterling' }, { value: 'HKD', label: 'HKD: Hong Kong Dollar' }, { value: 'HRK', label: 'HRK: Croatian Kuna' }, { value: 'HUF', label: 'HUF: Hungarian Forint' }, { value: 'IDR', label: 'IDR: Indonesian Rupiah' }, { value: 'ILS', label: 'ILS: Israeli New Shekel' }, { value: 'INR', label: 'INR: Indian Rupee' }, { value: 'JPY', label: 'JPY: Japanese Yen' }, { value: 'KRW', label: 'KRW: South Korean Won' }, { value: 'MXN', label: 'MXN: Mexican Peso' }, { value: 'MYR', label: 'MYR: Malaysian Ringgit' }, { value: 'NOK', label: 'NOK: Norwegian Krone' }, { value: 'NZD', label: 'NZD: New Zealand Dollar' }, { value: 'PHP', label: 'PHP: Philippine Peso' }, { value: 'PLN', label: 'PLN: Polish Zloty' }, { value: 'RON', label: 'RON: Romanian Leu' }, { value: 'RUB', label: 'RUB: Russian Ruble' }, { value: 'SEK', label: 'SEK: Swedish Krona' }, { value: 'SGD', label: 'SGD: Singapore Dollar' }, { value: 'THB', label: 'THB: Thai Baht' }, { value: 'TRY', label: 'TRY: Turkish Lira' }, { value: 'USD', label: 'USD: United States Dollar' }, { value: 'ZAR', label: 'ZAR: South African Rand' }],
    CURRENCY_EXCHANGE_API = 'http://api.fixer.io/latest';

var CurrencyDropdown = function (_React$Component) {
  _inherits(CurrencyDropdown, _React$Component);

  function CurrencyDropdown(props) {
    _classCallCheck(this, CurrencyDropdown);

    var _this = _possibleConstructorReturn(this, (CurrencyDropdown.__proto__ || Object.getPrototypeOf(CurrencyDropdown)).call(this, props));

    _this.state = {
      selectedCurrencies: DEFAULT_SELECTED_CURRENCIES
    };
    _this.currencyList = CURRENCY_LIST;

    _this.addCurrency = _this.addCurrency.bind(_this);
    return _this;
  }

  _createClass(CurrencyDropdown, [{
    key: 'addCurrency',
    value: function addCurrency(selectedCurrencies) {
      this.setState({
        selectedCurrencies: selectedCurrencies
      });
      this.props.onSelectedCurrenciesChange(selectedCurrencies);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(Select, {
        name: 'form-field-name',
        value: this.state.selectedCurrencies,
        multi: true,
        options: this.currencyList,
        onChange: this.addCurrency
      });
    }
  }]);

  return CurrencyDropdown;
}(React.Component);

var CurrencyList = function (_React$Component2) {
  _inherits(CurrencyList, _React$Component2);

  function CurrencyList() {
    _classCallCheck(this, CurrencyList);

    return _possibleConstructorReturn(this, (CurrencyList.__proto__ || Object.getPrototypeOf(CurrencyList)).apply(this, arguments));
  }

  _createClass(CurrencyList, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (nextProps.currencyExchangeRate.rates) {
        fx.base = nextProps.currencyExchangeRate.base;
        fx.rates = nextProps.currencyExchangeRate.rates;

        nextProps.currencies.forEach(function (currency) {
          if (fx.rates[currency.value]) {
            _this3[currency.value].value = fx.convert(Number.parseFloat(nextProps.billingRate), {
              from: nextProps.currencyExchangeRate.base,
              to: currency.value
            }).toFixed(2);
          }
        });
      }
    }
  }, {
    key: 'onBaseCurrencyValueChange',
    value: function onBaseCurrencyValueChange(currency) {
      this.props.onBaseCurrencyValueChange(currency, this[currency].value, this.props.billingType);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        null,
        this.props.currencies.map(function (currency) {
          return React.createElement(
            'div',
            { className: 'form__group', key: currency },
            React.createElement(
              'label',
              { className: 'form__label',
                'for': currency.value + '_' + _this4.props.billingType },
              currency.label
            ),
            React.createElement('input', {
              type: 'text',
              className: 'form__control',
              id: currency.value + '_' + _this4.props.billingType,
              onChange: function onChange() {
                return _this4.onBaseCurrencyValueChange(currency.value);
              },
              ref: function ref(input) {
                _this4[currency.value] = input;
              },
              autoComplete: 'off'
            })
          );
        })
      );
    }
  }]);

  return CurrencyList;
}(React.Component);

var CostCalculator = function (_React$Component3) {
  _inherits(CostCalculator, _React$Component3);

  function CostCalculator(props) {
    _classCallCheck(this, CostCalculator);

    var _this5 = _possibleConstructorReturn(this, (CostCalculator.__proto__ || Object.getPrototypeOf(CostCalculator)).call(this, props));

    _this5.state = {
      selectedCurrencies: DEFAULT_SELECTED_CURRENCIES,
      currencyExchangeRate: {},
      isFetchingExchangeRate: false
    };

    _this5.onSelectedCurrenciesChange = _this5.onSelectedCurrenciesChange.bind(_this5);
    _this5.setBaseCurrencyValue = _this5.setBaseCurrencyValue.bind(_this5);
    _this5.getExchangeRate = _this5.getExchangeRate.bind(_this5);
    return _this5;
  }

  _createClass(CostCalculator, [{
    key: 'onSelectedCurrenciesChange',
    value: function onSelectedCurrenciesChange(selectedCurrencies) {
      this.setState({
        selectedCurrencies: selectedCurrencies
      });
    }
  }, {
    key: 'setBaseCurrencyValue',
    value: function setBaseCurrencyValue(baseCurrency, baseCurrencyValue, billingType) {
      this.baseCurrency = baseCurrency;
      this.baseCurrencyValue = baseCurrencyValue;
      this.billingType = billingType;
    }
  }, {
    key: 'getExchangeRate',
    value: function getExchangeRate(e) {
      var _this6 = this;

      e.preventDefault();

      if (!this.baseCurrencyValue) {
        return;
      }

      this.setState({
        isFetchingExchangeRate: true
      });

      var selectedCurrencies = this.state.selectedCurrencies.map(function (currency) {
        return currency.value;
      }).join(',');

      fetch(CURRENCY_EXCHANGE_API + '?base=' + this.baseCurrency + '&symbols=' + selectedCurrencies).then(function (result) {
        return result.json();
      }).then(function (data) {
        _this6.setState({
          currencyExchangeRate: data,
          isFetchingExchangeRate: false
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'content-container' },
        React.createElement(CurrencyDropdown, {
          onSelectedCurrenciesChange: this.onSelectedCurrenciesChange
        }),
        this.state.selectedCurrencies.length ? React.createElement(
          'form',
          { className: 'form', onSubmit: this.getExchangeRate },
          React.createElement(
            'div',
            { className: 'flex-box' },
            React.createElement(
              'div',
              { className: 'flex-box__item' },
              React.createElement(
                'h2',
                null,
                'Daily Billing rate'
              ),
              React.createElement(CurrencyList, { currencies: this.state.selectedCurrencies,
                onBaseCurrencyValueChange: this.setBaseCurrencyValue,
                currencyExchangeRate: this.state.currencyExchangeRate,
                billingType: BILLING_TYPE.DAILY,
                billingRate: this.billingType === BILLING_TYPE.DAILY ? this.baseCurrencyValue : this.baseCurrencyValue * 8
              })
            ),
            React.createElement(
              'div',
              { className: 'flex-box__item' },
              React.createElement(
                'h2',
                null,
                'Hourly Billing rate'
              ),
              React.createElement(CurrencyList, { currencies: this.state.selectedCurrencies,
                onBaseCurrencyValueChange: this.setBaseCurrencyValue,
                currencyExchangeRate: this.state.currencyExchangeRate,
                billingType: BILLING_TYPE.HOURLY,
                billingRate: this.billingType === BILLING_TYPE.HOURLY ? this.baseCurrencyValue : this.baseCurrencyValue / 8
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'form__group text-center' },
            React.createElement(
              'button',
              { type: 'submit', className: 'form__btn' },
              'Get Value'
            )
          ),
          React.createElement(
            'div',
            { className: 'loading-overlay ' + (this.state.isFetchingExchangeRate ? 'show' : '') },
            React.createElement(
              'strong',
              { className: 'loading-overlay__content' },
              'Fetching Latest Exchange Rate...'
            )
          )
        ) : React.createElement(
          'h2',
          null,
          'Select currencies for exchange rate'
        )
      );
    }
  }]);

  return CostCalculator;
}(React.Component);

ReactDOM.render(React.createElement(CostCalculator, null), document.getElementById('index'));
