import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import VoiceRecorder from "./components/VoiceRecorder";

function App() {
  return (
    <div className="h-screen relative">
    <Canvas className="h-full w-full absolute top-0 left-0" shadows camera={{ position: [-0.5, 0.1, 8], fov: 38 }}>
      <color attach="background" args={["#110101"]} />
      <Experience />
    </Canvas>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
    <VoiceRecorder/>
    </div>
    
    </div>
  );
}

export default App;
