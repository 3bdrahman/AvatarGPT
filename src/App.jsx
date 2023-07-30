import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import VoiceRecorder from "./components/VoiceRecorder";

function App() {
  return (
    <div className="h-screen relative">
    <Canvas className="h-full w-full absolute top-0 left-0" shadows camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
    <VoiceRecorder/>
    </div>
    
    </div>
  );
}

export default App;
