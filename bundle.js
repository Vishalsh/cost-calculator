'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var billingType = {
  DAILY: 'daily',
  HOURLY: 'hourly'
};

var CurrencyDropdown = function (_React$Component) {
  _inherits(CurrencyDropdown, _React$Component);

  function CurrencyDropdown(props) {
    _classCallCheck(this, CurrencyDropdown);

    var _this = _possibleConstructorReturn(this, (CurrencyDropdown.__proto__ || Object.getPrototypeOf(CurrencyDropdown)).call(this, props));

    _this.state = {
      currencyOptions: [],
      isLoading: true,
      selectedCurrencies: []
    };

    _this.addCurrency = _this.addCurrency.bind(_this);
    return _this;
  }

  _createClass(CurrencyDropdown, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      fetch('https://openexchangerates.org/api/currencies.json').then(function (result) {
        return result.json();
      }).then(function (data) {
        var currencyOptions = Object.keys(data).map(function (currencyLabel) {
          return {
            value: currencyLabel,
            label: currencyLabel + ': ' + data[currencyLabel]
          };
        });

        _this2.setState({
          currencyOptions: currencyOptions,
          isLoading: false
        });
      });
    }
  }, {
    key: 'addCurrency',
    value: function addCurrency(selectedCurrency) {
      this.props.onCurrencySelect(selectedCurrency);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(Select, {
        name: 'form-field-name',
        value: this.state.selectedCurrencies,
        joinValues: true,
        options: this.state.currencyOptions,
        isLoading: this.state.isLoading,
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
      var _this4 = this;

      if (nextProps.currencyExchangeRate.rates) {
        fx.base = nextProps.currencyExchangeRate.base;
        fx.rates = nextProps.currencyExchangeRate.rates;

        nextProps.currencies.forEach(function (currency) {
          _this4[currency.value].value = fx.convert(Number.parseFloat(nextProps.billingAmount), {
            from: nextProps.currencyExchangeRate.base,
            to: currency.value
          }).toFixed(2);
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
      var _this5 = this;

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
                'for': currency.value + '_' + _this5.props.billingType },
              currency.value,
              ' - ',
              currency.label
            ),
            React.createElement('input', {
              type: 'text',
              className: 'form__control',
              id: currency.value + '_' + _this5.props.billingType,
              onChange: function onChange() {
                return _this5.onBaseCurrencyValueChange(currency.value);
              },
              ref: function ref(input) {
                _this5[currency.value] = input;
              }
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

    var _this6 = _possibleConstructorReturn(this, (CostCalculator.__proto__ || Object.getPrototypeOf(CostCalculator)).call(this, props));

    _this6.state = {
      selectedCurrencies: [{ value: 'INR', label: 'Indian Rupee' }, { value: 'USD', label: 'United States Dollar' }, { value: 'GBP', label: 'British Pound Sterling' }],
      currencyExchangeRate: {},
      isFetchingExchangeRate: false
    };

    _this6.onCurrencySelect = _this6.onCurrencySelect.bind(_this6);
    _this6.setBaseCurrencyValue = _this6.setBaseCurrencyValue.bind(_this6);
    _this6.getExchangeValue = _this6.getExchangeValue.bind(_this6);
    return _this6;
  }

  _createClass(CostCalculator, [{
    key: 'onCurrencySelect',
    value: function onCurrencySelect(selectedCurrency) {
      this.setState({
        selectedCurrencies: [].concat(_toConsumableArray(this.state.selectedCurrencies), [selectedCurrency])
      });
    }
  }, {
    key: 'setBaseCurrencyValue',
    value: function setBaseCurrencyValue(baseCurrency, value, billingType) {
      this.baseCurrency = baseCurrency;
      this.baseCurrencyValue = Number.parseFloat(value);
      this.billingType = billingType;
    }
  }, {
    key: 'getExchangeValue',
    value: function getExchangeValue(e) {
      var _this7 = this;

      e.preventDefault();

      this.setState({
        isFetchingExchangeRate: true
      });

      var selectedCurrencies = this.state.selectedCurrencies.map(function (currency) {
        return currency.value;
      }).join(',');

      fetch('http://api.fixer.io/latest?base=' + this.baseCurrency + '&symbols=' + selectedCurrencies).then(function (result) {
        return result.json();
      }).then(function (data) {
        _this7.setState({
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
        React.createElement(
          'form',
          { className: 'form', onSubmit: this.getExchangeValue },
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
                billingType: billingType.DAILY,
                billingAmount: this.billingType === billingType.DAILY ? this.baseCurrencyValue : this.baseCurrencyValue * 8
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
                billingType: billingType.HOURLY,
                billingAmount: this.billingType === billingType.HOURLY ? this.baseCurrencyValue : this.baseCurrencyValue / 8
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
        )
      );
    }
  }]);

  return CostCalculator;
}(React.Component);

ReactDOM.render(React.createElement(CostCalculator, null), document.getElementById('index'));
