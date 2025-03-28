import { RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useIsHost } from "playroomkit";
import React, { useEffect, useRef } from "react";
import { MeshBasicMaterial, Vector3 } from "three";

interface BulletUserData {
  type: string;
  player: string;
  damage: number;
}

const BULLET_SPEED = 20;

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: true,
});
bulletMaterial.color.multiplyScalar(12);

const Bullet = ({
  angle,
  onHit,
  player,
  position,
  id,
}: {
  player: string;
  angle: number;
  position: Vector3;
  id: string;
  onHit: (bulletId: string, position: Vector3) => void;
}) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const isHost = useIsHost();

  useEffect(() => {
    const velocity = {
      x: Math.sin(angle) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angle) * BULLET_SPEED,
    };
    rigidBody.current?.setLinvel(velocity, true);
  }, []);
  return (
    <group position={[position.x, position.y, position.z]} rotation-y={angle}>
      <RigidBody
        ref={rigidBody}
        gravityScale={0}
        sensor
        userData={{
          type: "bullet",
          player,
          damage: 10,
        }}
        onIntersectionEnter={(e) => {
          const otherUserData = e.other.rigidBody?.userData as
            | BulletUserData
            | undefined;
          if (isHost && otherUserData?.type !== "bullet") {
            rigidBody.current?.setEnabled(false);
            onHit(id, vec3(rigidBody.current?.translation()));
          }
        }}
      >
        <mesh position-z={0.25} material={bulletMaterial} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Bullet;
