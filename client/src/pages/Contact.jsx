import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-body">
      <div className="contact">
        {/* Contact Header */}
        <section className="contact-header">
          <h1>Contact Us</h1>
          <p>We love to hear from you! Reach out to us for any inquiries or support.</p>
        </section>

        {/* Contact Content */}
        <section className="contact-content">
          {/* Contact Form */}
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Enter your message" required></textarea>
              </div>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>

          {/* Company Details */}
          <div className="company-details">
            <h2>Our Details</h2>
            <div className="details">
              <div className="detail-item">
                <span className="icon">📍</span>
                <p>123 Electrical Lane, Tech City, TX 12345, USA</p>
              </div>
              <div className="detail-item">
                <span className="icon">📞</span>
                <p>+1 (123) 456-7890</p>
              </div>
              <div className="detail-item">
                <span className="icon">✉️</span>
                <p>info@mithunelectricals.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Our Location</h2>
          <div className="map">
            <iframe
              title="Mithun Electricals Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.837434509369!2d-97.7407876849192!3d30.26756798244963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b50e6a8b5f7f%3A0x4a3e8c1d8b5f7f1e!2sTech%20City%2C%20TX%2C%20USA!5e0!3m2!1sen!2sin!4v1633021234567!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 Mithun Electricals. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Contact;