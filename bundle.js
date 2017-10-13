'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BILLING_TYPE = {
  DAILY: 'DAILY',
  HOURLY: 'HOURLY'
},
    CURRENCY_LIST = [{ value: 'AUD', label: 'AUD: Australian Dollar', symbol: '$' }, { value: 'BGN', label: 'BGN: Bulgarian Lev', symbol: 'лв' }, { value: 'BRL', label: 'BRL: Brazilian Real', symbol: 'R$' }, { value: 'CAD', label: 'CAD: Canadian Dollar', symbol: '$' }, { value: 'CHF', label: 'CHF: Swiss Franc', symbol: 'CHF' }, { value: 'CNY', label: 'CNY: Chinese Yuan', symbol: '¥' }, { value: 'CZK', label: 'CZK: Czech Koruna', symbol: 'Kč' }, { value: 'DKK', label: 'DKK: Danish Krone', symbol: 'kr' }, { value: 'EUR', label: 'EUR: Euro', symbol: '€' }, { value: 'GBP', label: 'GBP: British Pound Sterling', symbol: '£', defaultSelected: true }, { value: 'HKD', label: 'HKD: Hong Kong Dollar', symbol: '$' }, { value: 'HRK', label: 'HRK: Croatian Kuna', symbol: 'kn' }, { value: 'HUF', label: 'HUF: Hungarian Forint', symbol: 'Ft' }, { value: 'IDR', label: 'IDR: Indonesian Rupiah', symbol: 'Rp' }, { value: 'ILS', label: 'ILS: Israeli New Shekel', symbol: '₪' }, { value: 'INR', label: 'INR: Indian Rupee', symbol: '₹', defaultSelected: true }, { value: 'JPY', label: 'JPY: Japanese Yen', symbol: '¥' }, { value: 'KRW', label: 'KRW: South Korean Won', symbol: '₩' }, { value: 'MXN', label: 'MXN: Mexican Peso', symbol: '$' }, { value: 'MYR', label: 'MYR: Malaysian Ringgit', symbol: 'RM' }, { value: 'NOK', label: 'NOK: Norwegian Krone', symbol: 'kr' }, { value: 'NZD', label: 'NZD: New Zealand Dollar', symbol: '$' }, { value: 'PHP', label: 'PHP: Philippine Peso', symbol: '₱' }, { value: 'PLN', label: 'PLN: Polish Zloty', symbol: 'zł' }, { value: 'RON', label: 'RON: Romanian Leu', symbol: 'lei' }, { value: 'RUB', label: 'RUB: Russian Ruble', symbol: '₽' }, { value: 'SEK', label: 'SEK: Swedish Krona', symbol: 'kr' }, { value: 'SGD', label: 'SGD: Singapore Dollar', symbol: '$' }, { value: 'THB', label: 'THB: Thai Baht', symbol: '฿' }, { value: 'TRY', label: 'TRY: Turkish Lira', symbol: '₺' }, { value: 'USD', label: 'USD: United States Dollar', symbol: '$', defaultSelected: true }, { value: 'ZAR', label: 'ZAR: South African Rand', symbol: 'R' }],
    CURRENCY_EXCHANGE_API = 'https://api.fixer.io/latest';

var CurrencyList = function (_React$Component) {
  _inherits(CurrencyList, _React$Component);

  function CurrencyList() {
    _classCallCheck(this, CurrencyList);

    return _possibleConstructorReturn(this, (CurrencyList.__proto__ || Object.getPrototypeOf(CurrencyList)).apply(this, arguments));
  }

  _createClass(CurrencyList, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (nextProps.currencyExchangeRate.rates) {
        fx.base = nextProps.currencyExchangeRate.base;
        fx.rates = nextProps.currencyExchangeRate.rates;

        nextProps.currencies.forEach(function (currency) {
          if (fx.rates[currency.value]) {
            _this2[currency.value].value = fx.convert(Number.parseFloat(nextProps.billingRate), {
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
      var _this3 = this;

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
                'for': currency.value + '_' + _this3.props.billingType },
              currency.label
            ),
            React.createElement(
              'div',
              { className: 'flex-box' },
              React.createElement(
                'span',
                { className: 'currency-symbol' },
                currency.symbol
              ),
              React.createElement('input', {
                type: 'text',
                className: 'form__control',
                id: currency.value + '_' + _this3.props.billingType,
                onChange: function onChange() {
                  return _this3.onBaseCurrencyValueChange(currency.value);
                },
                ref: function ref(input) {
                  _this3[currency.value] = input;
                },
                autoComplete: 'off'
              })
            )
          );
        })
      );
    }
  }]);

  return CurrencyList;
}(React.Component);

CurrencyList.propTypes = {
  currencies: PropTypes.array.isRequired,
  onBaseCurrencyValueChange: PropTypes.func.isRequired,
  currencyExchangeRate: PropTypes.func.isRequired,
  billingType: PropTypes.string,
  billingRate: PropTypes.number
};

var CostCalculator = function (_React$Component2) {
  _inherits(CostCalculator, _React$Component2);

  function CostCalculator(props) {
    _classCallCheck(this, CostCalculator);

    var _this4 = _possibleConstructorReturn(this, (CostCalculator.__proto__ || Object.getPrototypeOf(CostCalculator)).call(this, props));

    _this4.defaultSelectedCurrencies = CURRENCY_LIST.filter(function (currency) {
      return currency.defaultSelected;
    });
    _this4.state = {
      selectedCurrencies: _this4.defaultSelectedCurrencies,
      currencyExchangeRate: {},
      isFetchingExchangeRate: false
    };

    _this4.setBaseCurrencyValue = _this4.setBaseCurrencyValue.bind(_this4);
    _this4.updateCurrencyList = _this4.updateCurrencyList.bind(_this4);
    _this4.getExchangeRate = _this4.getExchangeRate.bind(_this4);
    return _this4;
  }

  _createClass(CostCalculator, [{
    key: 'updateCurrencyList',
    value: function updateCurrencyList(selectedCurrencies) {
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
      var _this5 = this;

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
        _this5.setState({
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
        React.createElement(Select, {
          name: 'form-field-name',
          value: this.state.selectedCurrencies,
          multi: true,
          options: CURRENCY_LIST,
          onChange: this.updateCurrencyList
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
            ),
            React.createElement(
              'button',
              { type: 'reset', value: 'Reset', className: 'form__btn form__btn--reset' },
              'Reset'
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
