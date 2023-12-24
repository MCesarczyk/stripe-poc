import styled from "styled-components";
import { Layout } from "./Layout";
import { NavButton } from "./NavButton";

interface ThankYouPageProps {
  customerEmail?: string;
}

export const ThankYouPage = ({ customerEmail }: ThankYouPageProps) => {
  return (
    <Layout id="success">
      <h1>We appreciate your business!</h1>
      <Paragraph>
        A confirmation email will be sent to{" "}
        <LinkStyle>{customerEmail || 'your email'}</LinkStyle>.
      </Paragraph>
      <Paragraph>
        If you have any questions, please email{" "}
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </Paragraph>
      <NavButton to="/">Create another payment</NavButton>
    </Layout>
  );
};

const Paragraph = styled.p`
  font-size: 1.5rem;
`;

const LinkStyle = styled.span`
  font-weight: 500;
  color: #646cff;
`;
