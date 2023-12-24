import { Layout } from "./Layout";
import { NavButton } from "./NavButton";

export const Home = () => {
  return (
    <Layout>
      <h1>Terraeye checkout</h1>
      <NavButton to="/checkout-stripe">Embedded form</NavButton>
      <NavButton to="/checkout-custom">Custom form</NavButton>
    </Layout>
  );
};
