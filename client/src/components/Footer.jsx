import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Mithun Electricals</h3>
          <p>
            Mithun Electricals is a leading provider of electrical solutions,
            offering high-quality products and services to meet the needs of
            both residential and commercial clients.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>150 Sathy Road, Kavindapadi, Erode</p>
          <p>Phone: +91 9942314140</p>
          <p>Email: mithunelectricals@gmail.com</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/admin/inventory">Inventory</a>
            </li>
            <li>
              <a href="/contact">Products</a>
            </li>
            <li>
              <a href="/about">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>{" "}
            |{" "}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>{" "}
            |{" "}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Mithun Electricals. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;