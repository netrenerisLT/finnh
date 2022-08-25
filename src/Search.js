import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage.js";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

/* ====================== Transforms data to custom object from API ====================== */
function transformData(stocks) {
  return stocks.c.map((item, index) => ({
    close: Number(item).toFixed(2),
    open: Number(stocks.o[index]).toFixed(2),
    timestamp: new Date(stocks.t[index] * 1000).toLocaleDateString("lt-LT"),
  }));
}

function Search() {
  const [companyInfo, setCompanyInfo] = useState();
  let [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [wrongInput, setWrongInput] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [stockPrice, setStockPrice] = useState();
  const regex = /^[a-zA-Z\s]*$/;
  const from = new Date(dateFrom).valueOf() / 1000;
  const to = new Date(dateTo).valueOf() / 1000;
  const API_TOKEN = "cbvic9qad3ibve99i6ig";
  searchInput = searchInput.toLocaleUpperCase();
  const API_COMPANY = searchInput;
  const API_URL = `https://finnhub.io/api/v1/stock/profile2?symbol=${API_COMPANY}&token=${API_TOKEN}`;
  const API_STOCK_URL = `https://finnhub.io/api/v1/stock/candle?symbol=${API_COMPANY}&resolution=D&from=${from}&to=${to}&token=${API_TOKEN}`;

  /* ====================== Setting date range for 1 year (API restrictions) ====================== */
  const lastYear = new Date();
  lastYear.setDate(lastYear.getDate() - 365);

  /* ====================== Collecting all data and enable/disable HMTL ====================== */
  const collect = async (form) => {
    form.preventDefault();
    if (
      API_COMPANY !== "" &&
      API_COMPANY !== " " &&
      API_COMPANY.length <= 35 &&
      regex.test(API_COMPANY) &&
      from <= to
    ) {
      try {
        const response = await fetch(API_URL);
        let brand = await response.json();
        setCompanyInfo(brand);
        setWrongInput(false);
        if (brand.name === undefined) {
          setWrongInput(true);
          setShowCompany(false);
          setShowStock(false);
          return;
        } else {
          setShowCompany(true);
        }
        /* ====================== Fetching stocks ====================== */
        const responses = await fetch(API_STOCK_URL);
        let stockPrice = transformData(await responses.json());
        setStockPrice(stockPrice);

        /* ====================== Sending data to nodeJS ====================== */
        let company = brand.name;
        const input = await fetch("/", {
          method: "POST",
          body: JSON.stringify({
            searchInput,
            dateFrom,
            dateTo,
            company,
            stockPrice,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let result = await input.json();
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      setWrongInput(true);
      setShowCompany(false);
      setShowStock(false);
      return;
    }
  };

  /* ====================== Company's card with information ====================== */
  let CompanyCard = () => {
    return (
      <div className="company-card">
        <div className="company-card__header">
          <div
            className="company-card__title"
            onClick={() => {
              showStock === true ? setShowStock(false) : setShowStock(true);
            }}
          >
            {companyInfo.name}
          </div>
          <div className="company-card__about">
            {companyInfo.country} | {companyInfo.currency}
          </div>
        </div>
        <a
          href={companyInfo.weburl}
          target="blank"
          className="company-card__url"
        >
          Visit company page
        </a>
      </div>
    );
  };

  /* ====================== Stock candles card's information ====================== */
  let ShowStockCandles = () => {
    return (
      <div className="fade-in stocks-candles">
        <div>
          <LineChart
            width={400}
            height={400}
            data={stockPrice}
            margin={{ top: 0, right: 10, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis
              type="number"
              domain={[0, (dataMax) => parseInt(dataMax * 1.3)]}
              allowDecimals={true}
              allowDataOverflow={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#241561"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="red"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="companies">
        <div className="companies-header">
          <h2 className="section-name companies__section-name">
            Search by company
          </h2>
        </div>
      </section>
      <div className="search">
        <div className="search-card">
          <div className="search-input">
            <form className="search-input__form" onSubmit={collect}>
              {wrongInput ? <ErrorMessage /> : null}
              <input
                type="text"
                className="search-input__input"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput.toLocaleUpperCase()}
                placeholder="Company's Ticker Symbol"
              />
              <div className="search-input__stocks-card">
                <div>
                  <label htmlFor="start">From: </label>
                  <input
                    type="date"
                    className="search-input__from"
                    min={lastYear.toLocaleDateString("lt-LT")}
                    max={new Date().toLocaleDateString("lt-LT")}
                    onChange={(e) => setDateFrom(e.target.value)}
                    value={dateFrom}
                  />
                </div>
                <div>
                  <label htmlFor="start">To: </label>
                  <input
                    type="date"
                    className="search-input__to"
                    min={lastYear.toLocaleDateString("lt-LT")}
                    max={new Date().toLocaleDateString("lt-LT")}
                    onChange={(e) => setDateTo(e.target.value)}
                    value={dateTo}
                  />
                </div>
              </div>
              <button type="submit" className="search-input__submit">
                Search
              </button>
            </form>
            {showCompany ? <CompanyCard /> : null}
          </div>
          <div className="stock-candles">
            {showStock ? <ShowStockCandles /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
