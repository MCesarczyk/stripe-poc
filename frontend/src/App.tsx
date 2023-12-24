import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CheckoutForm } from "./CheckoutForm";
import { Return } from "./Return";
import { Home } from "./Home";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
