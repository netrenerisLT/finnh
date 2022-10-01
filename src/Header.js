import React, { useState, useEffect } from "react";

function Navbar() {
  const [fetchJoke, setFetchJoke] = useState([]);
  useEffect(() => {
    getBand();
  }, []);

  const getBand = async () => {
    try {
      let responses = await fetch("https://api.chucknorris.io/jokes/random");
      let joke = await responses.json();
      setFetchJoke(joke.value);
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <header className="header">
      <section className="nav-bar">
        <a className="nav-bar__logo" href="/">
          FinnHub
        </a>
        <nav className="nav-bar__nav">
          <ul className="nav-bar__list">
            <li className="nav-bar__item">
              <a className="nav-bar__link" href="/">
                Home
              </a>
            </li>
          </ul>
        </nav>
      </section>
      <section className="header-info">
        <div className="header-info__left-block">
          <h1 className="header-info__name">
            Ch<span>U</span>ck Stock Market
          </h1>
          <p className="fade-in header-info__about"> {fetchJoke}</p>
        </div>
        <div className="header-info__img">
          {/* <img src="https://imgur.com/gallery/cZrjvpm" alt="img" /> */}
        </div>
      </section>
    </header>
  );
}

export default Navbar;
