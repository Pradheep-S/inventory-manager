import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inventory from "./pages/Inventory";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/products" element={<Products/>} />
      </Routes>
    </Router>
  );
}

export default App;
