import { Link } from "react-router-dom";
import styled from "styled-components";

export const NavButton = styled(Link)`
display: inline-block;
background-color: #111;
color: white;
padding: 0.5rem 1rem;
border-radius: 0.25rem;
text-decoration: none;
font-weight: 500;
font-size: 1.25rem;
margin: 1rem;

&:hover {
  background-color: #222;
}
`;
