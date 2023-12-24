import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CheckoutForm } from "./CheckoutForm";
import { Return } from "./Return";
import { Home } from "./Home";
import { CheckoutPageCustom } from "./CheckoutPageCustom";
import { ThankYouPage } from "./ThankYouPage";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout-stripe" element={<CheckoutForm />} />
          <Route path="/checkout-custom" element={<CheckoutPageCustom />} />
          <Route path="/return" element={<Return />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
