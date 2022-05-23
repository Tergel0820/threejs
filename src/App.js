import React, { useState, useEffect, useRef, useMemo } from "react";
import { Vector2, AxesHelper, DoubleSide } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import robotoRegular from "./styles/Roboto_Regular.json";
import "./styles/App.scss";

extend({
  EffectComposer,
  UnrealBloomPass,
  RenderPass,
  ShaderPass,
  TextGeometry,
});

const Box = (props) => {
  const ref = useRef();
  // useFrame((state, delta) => (ref.current.rotation.x += 0.005, ref.current.rotation.y += 0.005));
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <mesh
      ref={ref}
      {...props}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? "#fff" : "#202020"}
      />
    </mesh>
  );
};

const CircleGeometry = (props) => {
  const ref = useRef();
  // useFrame(() => ref.current && void (ref.current.rotation.y += 0.01));
  return (
    <mesh ref={ref} {...props}>
      <circleGeometry attach="geometry" args={[1, 128]} />
      <meshBasicMaterial attach="material" color="pink" side={DoubleSide} />
    </mesh>
  );
};

const Effect = () => {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new Vector2(size.width, size.height), [size]);
  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => composer.current.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[aspect, 0.8, 1, 0.1]} />
      <shaderPass
        attachArray="passes"
        args={[FXAAShader]}
        material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
        renderToScreen
      />
    </effectComposer>
  );
};

const Text = (props) => {
  const font = new FontLoader().parse(robotoRegular);
  return (
    <mesh {...props}>
      <textGeometry args={["OB2O", { font, size: 0.5, height: 0.1 }]} />
      <meshPhysicalMaterial attach="material" color={"cyan"} />
    </mesh>
  );
};

const App = () => {
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hovered
      ? "pointer"
      : "url('https://i.ppy.sh/8fefebffb06e15983b3d7be7a67546eea9017ef7/68747470733a2f2f692e706f7374696d672e63632f37504277474a62592f637572736f72726564686f742e706e67') 39 39, auto";
  }, [hovered]);
  return (
    <div style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}>
      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
        }}
        onCreated={(state) => state.gl.setClearColor("#0f0f15")}
      >
        <Effect />
        <OrbitControls />
        <ambientLight intensity={1} />
        <spotLight position={[10, 15, 10]} angle={0.5} />
        <primitive object={new AxesHelper(100)} />
        {/* <Box position={[0, 0, 0]} />
        <Box position={[0, 0, 1.1]} />
        <Box position={[0, 0, -1.1]} />
        <Box position={[0, 1.1, 0]} />
        <Box position={[0, 1.1, 1.1]} />
        <Box position={[0, 1.1, -1.1]} />
        <Box position={[0, -1.1, 0]} />
        <Box position={[0, -1.1, 1.1]} />
        <Box position={[0, -1.1, -1.1]} />
        <Box position={[1.1, 0, 0]} />
        <Box position={[1.1, 0, 1.1]} />
        <Box position={[1.1, 0, -1.1]} />
        <Box position={[1.1, 1.1, 0]} />
        <Box position={[1.1, 1.1, 1.1]} />
        <Box position={[1.1, 1.1, -1.1]} />
        <Box position={[1.1, -1.1, 0]} />
        <Box position={[1.1, -1.1, 1.1]} />
        <Box position={[1.1, -1.1, -1.1]} />
        <Box position={[-1.1, 0, 0]} />
        <Box position={[-1.1, 0, 1.1]} />
        <Box position={[-1.1, 0, -1.1]} />
        <Box position={[-1.1, 1.1, 0]} />
        <Box position={[-1.1, 1.1, -1.1]} />
        <Box position={[-1.1, 1.1, 1.1]} />
        <Box position={[-1.1, -1.1, 0]} />
        <Box position={[-1.1, -1.1, 1.1]} />
        <Box position={[-1.1, -1.1, -1.1]} /> */}
        <CircleGeometry position={[0, 0, 0]} />
        <Text position={[1, 0, 0]} />
      </Canvas>
      <div className="word-con">
        <h1 className="word word-1">OB2O</h1>
      </div>
    </div>
  );
};

export default App;