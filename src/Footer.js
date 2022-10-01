import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__elements">
        <div className="footer__contact-me">
          <p className="footer__project-contact-me">Contact me!</p>
          <a
            href="mailto: netreneris@gmail.com"
            className="footer__project-email"
          >
            netreneris@gmail.com
          </a>
        </div>
        <div className="footer__foot-bar">
          <p className="footer__logo">FinnHub</p>
          <div className="footer__social-icons">
            <a href="https://www.facebook.com" target="blank">
              <img
                src="https://blog-assets.hootsuite.com/wp-content/uploads/2018/09/flogo-RGB-HEX-Blk-58.png"
                alt="Facebook"
              ></img>
            </a>
            <a href="https://www.instagram.com" target="blank">
              <img
                src="https://blog.hootsuite.com/wp-content/uploads/2018/09/glyph-logo_May2016-310x310.png"
                alt="Instagram"
              ></img>
            </a>
            <img src="" alt=""></img>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
