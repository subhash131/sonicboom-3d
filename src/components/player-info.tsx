import { Billboard, Text } from "@react-three/drei";
import React from "react";

const PlayerInfo = ({ name }: { name: string }) => {
  return (
    <Billboard>
      <Text position-y={0.36} fontSize={0.2}>
        {name}
        <meshBasicMaterial color="white" />
      </Text>
    </Billboard>
  );
};

export default PlayerInfo;
