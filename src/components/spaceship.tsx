"use client";
import React, { ComponentProps, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";

type ModelProps = ComponentProps<"group"> & { color?: string };

type GLTFResult = {
  nodes: {
    Spitfire: THREE.Mesh;
  };
  materials: {
    Texture: THREE.Material;
  };
};

export function Spaceship({ color, ...props }: ModelProps) {
  const { nodes, materials } = useGLTF(
    "/Spitfire.gltf"
  ) as unknown as GLTFResult;

  const group = useRef<Group>(null);

  return (
    <group {...props} dispose={null} ref={group}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Spitfire.geometry}
        material={materials.Texture}
        scale={0.2}
      />
      <meshStandardMaterial attach="material" color={color} />
    </group>
  );
}

useGLTF.preload("/Spitfire.gltf");
