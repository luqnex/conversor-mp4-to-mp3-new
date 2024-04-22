import { AiOutlineClear } from "react-icons/ai";

import { Container, Text } from "./styles";

interface ListItemProps {
  name: string;
  size: number;
  handleClearAllStates: () => void;
}

export const ListItem = ({
  name,
  size,
  handleClearAllStates,
}: ListItemProps) => {
  function handleConvertBytesToMegabits(bytes: number): number {
    return bytes / (1024 * 1024);
  }

  return (
    <Container>
      <Text textColor="primary">{name}</Text>
      <Text textColor="secondary">
        {handleConvertBytesToMegabits(size).toFixed(1)} MB
      </Text>
      <Text textColor="secondary">Resultado: MP3</Text>
      <AiOutlineClear size="24" onClick={handleClearAllStates} />
    </Container>
  );
};
