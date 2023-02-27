import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import products from "./db.json";
import Home from "./pages/Home";
import Sales from "./pages/Sales";

function App() {
  const [data, setData] = useState([]);

  const fetchProducts = () => {
    setData(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;
