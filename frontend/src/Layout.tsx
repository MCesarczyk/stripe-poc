import { ReactNode } from "react";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
  id?: string;
}

export const Layout = ({ children, id }: LayoutProps) => (
  <PageLayout {...{ id }}>
    <ContentWrapper>{children}</ContentWrapper>
  </PageLayout>
);

const PageLayout = styled.div`
  display: grid;
  place-items: center;
  padding: 1rem;
  height: 100vh;
`;

const ContentWrapper = styled.main`
  text-align: center;
`;
