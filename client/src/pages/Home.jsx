import { useNavigate } from "react-router-dom";
import "./Home.css";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleExploreInventory = () => {
    navigate("/products"); // Navigate to the inventory page
  };

  const handleContactUs = () => {
    navigate("/contact"); // Navigate to the contact page
  };

  const handleLearnMore = () => {
    navigate("/about"); // Navigate to the about page
  };

  return (
    <div className="home-body">
      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to Mithun Electricals</h1>
            <p>Your trusted partner in electrical solutions and inventory management.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleExploreInventory}>
                Explore Products
              </button>
              <button className="btn-secondary" onClick={handleContactUs}>
                Contact Us
              </button>
            </div>
          </div>
          {/* Hero Shapes */}
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Why Choose Us?</h2>
          <div className="feature-cards">
            <div className="card">
              <span className="icon">⚡</span>
              <h3>Wide Range of Products</h3>
              <p>We offer a comprehensive inventory of electrical components and tools.</p>
            </div>
            <div className="card">
              <span className="icon">📦</span>
              <h3>Efficient Inventory Management</h3>
              <p>Our system ensures seamless tracking and management of your electrical supplies.</p>
            </div>
            <div className="card">
              <span className="icon">📞</span>

              <h3>24/7 Support</h3>
              <p>Our team is always available to assist you with your electrical needs.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about">
          <div className="about-content">
            <h2>About Mithun Electricals</h2>
            <p>
              Mithun Electricals is a leading provider of electrical solutions, offering high-quality products and services
              to meet the needs of both residential and commercial clients. Our inventory management system ensures that you
              always have access to the tools and components you need, when you need them.
            </p>
            <button className="btn-primary" onClick={handleLearnMore}>
              Learn More
            </button>
          </div>
          {/* About Shapes */}
          <div className="about-shapes">
            <div className="shape shape-3"></div>
            <div className="shape shape-6"></div>
            <div className="shape shape-7"></div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;