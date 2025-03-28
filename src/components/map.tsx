"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import { Environment, SoftShadows } from "@react-three/drei";
import {
  insertCoin,
  isHost,
  Joystick,
  myPlayer,
  onPlayerJoin,
  PlayerState,
  useIsHost,
  useMultiplayerState,
} from "playroomkit";
import { Controller, TBullet } from "./controller";
import { Physics, RigidBody } from "@react-three/rapier";
import Bullet from "./bullet";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Map = () => {
  const [players, setPlayers] = useState<
    {
      state: PlayerState;
      joyStick: Joystick;
    }[]
  >([]);

  const [bullets, setBullets] = useState<TBullet[]>([]);
  const [networkBullets, setNetworkBullets] = useMultiplayerState<TBullet[]>(
    "bullets",
    []
  );

  const isHost = useIsHost();

  const onFire = (bullet: TBullet) => {
    console.log("Firing...");
    setBullets((prev) => [...prev, bullet]);
    const rifleAudio = new Audio("/audio/rifle.mp3");
    rifleAudio.play();
  };
  const onHit = (bulletId: string) => {
    setBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
  };
  const start = async () => {
    await insertCoin();
  };
  useEffect(() => {
    start();
    onPlayerJoin((state) => {
      const joyStick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });
      const newPlayer = { state, joyStick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);

      setPlayers((prev) => {
        if (prev.find((p) => p.state.id == state.id)) return prev;
        return [...prev, newPlayer];
      });
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id != state.id));
      });
    });
  }, []);

  useEffect(() => {
    setNetworkBullets(bullets);
  }, [bullets]);

  return (
    <Suspense>
      <Canvas shadows camera={{ position: [0, 30, 0], fov: 30, near: 2 }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={Math.PI / 2} />
        <SoftShadows size={40} />
        <Environment preset="night" />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Physics gravity={[0, 0, 0]}>
          {players.map(({ joyStick, state }, idx) => {
            return (
              <RigidBody
                type="dynamic"
                friction={0}
                linearDamping={0.01}
                angularDamping={0.01}
                key={state.id}
              >
                <Controller
                  position-x={idx * 3}
                  state={state}
                  joyStick={joyStick}
                  userPlayer={state.id == myPlayer()?.id}
                  onFire={onFire}
                />
              </RigidBody>
            );
          })}
          {(isHost ? [...bullets] : [...networkBullets]).map(
            ({ angle, id, player, position }) => {
              if (!position?.x) return;
              return (
                <Bullet
                  key={id}
                  angle={angle}
                  position={position}
                  player={player}
                  id={id}
                  onHit={() => {
                    onHit(id);
                  }}
                />
              );
            }
          )}
        </Physics>
        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </Suspense>
  );
};

export default Map;
