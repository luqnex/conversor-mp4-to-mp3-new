import styled from "styled-components";

interface TextProps {
  textColor: "primary" | "secondary";
}

export const Container = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  border-radius: 12px 12px 0 0;
  background-color: white;
  color: black;

  @media (max-width: 768px) {
    height: auto;
    flex-direction: column;
  }
`;

export const Text = styled.p<TextProps>`
  color: ${(props) => (props.textColor === "primary" ? "#000" : "#7987A1")};
`;
