import "./App.css";

import React, { useReducer, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import axios from "axios";

const SUPPORTED_CURRENCIES = [
  "AED",
  "ARS",
  "AUD",
  "BGN",
  "BRL",
  "BSD",
  "CAD",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CZK",
  "DKK",
  "DOP",
  "EGP",
  "EUR",
  "FJD",
  "GBP",
  "GTQ",
  "HKD",
  "HRK",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "KZT",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PAB",
  "PEN",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "RON",
  "RUB",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "TWD",
  "UAH",
  "USD",
  "UYU",
  "ZAR"
];

const App = () => {
  const [
    { currencyOneValue, currencyTwoValue, currencyOne, currencyTwo, laoding },
    dispatch
  ] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "CHANGE_currencyOne": {
          return {
            ...state,
            currencyOne: action.value
          };
        }
        case "CHANGE_currencyTwo": {
          return {
            ...state,
            currencyTwo: action.value
          };
        }
        case "FETCHING_RATES": {
          return {
            ...state,
            laoding: true
          };
        }
        case "SET_RATES": {
          const { currencyTwo, currencyOneValue } = state;
          return {
            ...state,
            laoding: false,
            rates: action.rates,
            currencyTwoValue: round(
              currencyOneValue * (action.rates[currencyTwo] || 1)
            )
          };
        }
        case "SET_currencyOneValue": {
          const { rates, currencyTwo } = state;
          return {
            ...state,
            currencyOneValue: action.value,
            currencyTwoValue: round(action.value * (rates[currencyTwo] || 1))
          };
        }
        case "SET_currencyTwoValue": {
          const { rates, currencyTwo } = state;
          return {
            ...state,
            currencyOneValue: round(action.value / (rates[currencyTwo] || 1)),
            currencyTwoValue: action.value
          };
        }
        case "SWAP": {
          const {
            currencyTwo,
            currencyOne,
            currencyOneValue,
            currencyTwoValue
          } = state;
          return {
            ...state,
            currencyOneValue: currencyTwoValue,
            currencyTwoValue: currencyOneValue,
            currencyTwo: currencyOne,
            currencyOne: currencyTwo
          };
        }
        default: {
          throw Error("Unkown action type");
        }
      }
    },
    {
      currencyOneValue: 1,
      currencyTwoValue: 1,
      currencyOne: SUPPORTED_CURRENCIES[2],
      currencyTwo: SUPPORTED_CURRENCIES[48],
      laoding: true,
      rates: {}
    }
  );

  /**
   * featch rates
   */
  useEffect(() => {
    dispatch({ type: "FETCHING_RATES" });
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`)
      .then((res) => res.data)
      .then(
        ({ rates }) => {
          if (rates) {
            dispatch({
              type: "SET_RATES",
              rates
            });
          } else {
            alert("Error: try Another currency!");
            dispatch({
              type: "SET_RATES",
              rates: {}
            });
          }
        },
        () => {
          alert("Error: try Another currency!");
          dispatch({
            type: "SET_RATES",
            rates: {}
          });
        }
      );
  }, [currencyOne]);

  return (
    <div className="App">
      <h1 className="title">Exchange Rate Calculator</h1>

      <div
        className="container"
        style={laoding ? { opacity: 0.5, pointerEvents: "none" } : null}
      >
        <select
          className="currency-select"
          value={currencyOne}
          onChange={(e) => {
            dispatch({
              type: "CHANGE_currencyOne",
              value: e.target.value
            });
          }}
        >
          {SUPPORTED_CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <input
          className="currency-input"
          type="number"
          value={currencyOneValue}
          onChange={(e) => {
            dispatch({
              type: "SET_currencyOneValue",
              value: e.target.value
            });
          }}
        />

        <button
          className="swap-button"
          onClick={() => {
            dispatch({
              type: "SWAP"
            });
          }}
        >
          <FaExchangeAlt />
        </button>

        <input
          className="currency-input"
          type="number"
          value={currencyTwoValue}
          onChange={(e) => {
            dispatch({
              type: "SET_currencyTwoValue",
              value: e.target.value
            });
          }}
        />
        <select
          className="currency-select"
          value={currencyTwo}
          onChange={(e) => {
            dispatch({
              type: "CHANGE_currencyTwo",
              value: e.target.value
            });
          }}
        >
          {SUPPORTED_CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

function round(x) {
  return Math.round(x * 1000) / 1000;
}

export default App;
