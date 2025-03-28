import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferGeometry, Material, Mesh, NormalBufferAttributes } from "three";

export default function Box(props: any) {
  const meshRef =
    useRef<
      Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]>
    >();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    return (meshRef.current.rotation.x += delta);
  });
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
