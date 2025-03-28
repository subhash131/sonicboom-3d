import { useRef } from "react";
import { Group, Vector3 } from "three";
import { Spaceship } from "./spaceship";
import {
  RigidBody,
  RapierRigidBody,
  BallCollider,
  vec3,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useIsHost, Joystick, PlayerState } from "playroomkit";
import { CameraControls } from "@react-three/drei";
import Crosshair from "./crosshair";
import PlayerInfo from "./player-info";

export type TBullet = {
  id: string;
  position: Vector3;
  angle: number;
  player: string;
};

const MOVEMENT_SPEED = 150;
const FIRE_RATE = 300;

export const Controller = ({
  state,
  joyStick,
  userPlayer,
  onFire,
  ...props
}: {
  joyStick: Joystick;
  state: PlayerState;
  userPlayer: boolean;
  onFire: (bullet: TBullet) => void;
}) => {
  const isHost = useIsHost();
  const group = useRef<Group>(null);
  const character = useRef<Group>(null);
  const rigidBody = useRef<RapierRigidBody>(null);
  const camControls = useRef<CameraControls>(null);
  const lastShoot = useRef(0);

  useFrame((_, delta) => {
    if (!character.current) return;
    if (!rigidBody.current) return;

    if (camControls.current) {
      const camDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const camDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(rigidBody.current.translation());
      camControls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + camDistanceY,
        playerWorldPos.z + camDistanceZ,
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
    }

    const angle = joyStick.angle();
    if (joyStick.isJoystickPressed() && angle) {
      character.current.rotation.y = angle;
      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta,
      };
      rigidBody.current?.applyImpulse(impulse, true);
    }

    if (isHost) {
      state.setState("pos", rigidBody.current.translation());
    } else {
      const pos = state.getState("pos");
      if (pos) {
        rigidBody.current.setTranslation(pos, true);
      }
    }

    if (joyStick.isPressed("fire")) {
      // if (isHost) {
      if (Date.now() - lastShoot.current > FIRE_RATE) {
        lastShoot.current = Date.now();
        const newBullet: TBullet = {
          id: state.id + "-" + +new Date(),
          position: vec3(rigidBody.current.translation()),
          angle,
          player: state.id,
        };
        onFire(newBullet);
      }
      // }
    }
  });

  return (
    <group ref={group} {...props}>
      {userPlayer && <CameraControls ref={camControls} />}
      <RigidBody
        colliders={false}
        ref={rigidBody}
        linearDamping={12}
        lockRotations
        type={isHost ? "dynamic" : "kinematicPosition"}
        onIntersectionEnter={({ other }) => {
          if (isHost && other.rigidBody!.userData!.type === "bullet") {
          }
        }}
      >
        <PlayerInfo name={state.getProfile().name} />
        <group ref={character}>
          <Spaceship />
          {userPlayer && <Crosshair position={[0, 0, 0]} />}
        </group>
        <BallCollider args={[1]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};
