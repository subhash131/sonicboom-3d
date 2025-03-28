import React from "react";

const Crosshair = (props: any) => {
  return (
    <group {...props}>
      <mesh position-z={1}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>
      <mesh position-z={1.1}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position-z={1.2}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" transparent opacity={0.7} />
      </mesh>

      <mesh position-z={1.3}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" opacity={0.6} transparent />
      </mesh>

      <mesh position-z={1.4}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" opacity={0.4} transparent />
      </mesh>

      <mesh position-z={1.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

export default Crosshair;
