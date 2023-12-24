import { FormEventHandler, useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

import "./CheckoutFormCustom.css";
import styled from "styled-components";

export const CheckoutFormCustom = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${import.meta.env.VITE_URL}/thank-you`,
      },
    });

    if (
      error instanceof Error &&
      (error.type === "card_error" || error.type === "validation_error")
    ) {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Wrapper>
      <Column>
        <Preview>
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </Preview>
      </Column>
      <Column>
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement
            id="payment-element"
            options={
              paymentElementOptions as StripePaymentElementOptions | undefined
            }
          />
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>
          {message && <div id="payment-message">{message}</div>}
        </form>
      </Column>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;

  @media (max-width: 765px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  &:nth-of-type(odd) {
    text-align: end;

    @media (max-width: 765px) {
      text-align: unset;
    }
  }

  &:nth-of-type(even) {
    background-color: #fff;
  }
`;

const Preview = styled.div`
  display: grid;
  align-content: center;
  height: 100%;
  min-width: 400px;
  max-width: 600px;
  padding: 80px;

  @media (max-width: 765px) {
    min-width: 100%;
    max-width: 100%;
    padding: 40px;
  }
`;
