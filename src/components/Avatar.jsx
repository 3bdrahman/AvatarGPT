/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.10 .\public\models\64bb1d39ab757f1e75aaa1aa.glb -o .\src\components\Avatar.jsx -r public 
*/

import React, { useMemo, useRef , useState} from 'react'
import { useControls } from 'leva'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { io } from 'socket.io-client';

const corresponding ={
  "0": "viseme_sil",
  "1": "viseme_E",
  "2": "viseme_aa",
  "3": "viseme_O",
  "4": "viseme_E",  // Reuse E if no separate MorphTarget for ʊ
  "5": "viseme_RR", // Assuming ɝ sounds can be represented by R
  "6": "viseme_I",
  "7": "viseme_U",
  "8": "viseme_O",
  "9": "viseme_O",  // Not sure what aʊ would map to. Reusing O.
  "10": "viseme_O", // Not sure what ɔɪ would map to. Reusing O.
  "11": "viseme_I",
  "12": "viseme_sil", // No sound h, so using silence
  "13": "viseme_RR",
  "14": "viseme_nn", // Assuming l sound can be represented by n
  "15": "viseme_SS",
  "16": "viseme_CH", // Assuming ʃ, tʃ, dʒ, ʒ sounds can be represented by CH
  "17": "viseme_TH",
  "18": "viseme_FF",
  "19": "viseme_DD",
  "20": "viseme_kk",
  "21": "viseme_PP"
}
export function Avatar(props) {
  const socket = io('localhost:5000');
  const [audioURL, setAudioURL] = useState(null);
  const [audio, setAudio] = useState(null);
  const [lipsync, setLipsync] = useState(null);
  // const {playAudio, script} = useControls({
  //   playAudio: false,
  //   script: {value: "output", options: ["output"]}
  // })
  // const audio = useMemo(() => new Audio("/audio/" + script + ".wav"), [script])
  // const jsonFile = useLoader(THREE.FileLoader, `audio/${script}.json`)
  // const lipsync = JSON.parse(jsonFile)
  useEffect(() => {
    socket.on('responseData', (responseData) => {
      console.log("Received responseData from server", responseData); 
      const blob = new Blob([new Uint8Array(responseData.audioData)], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setLipsync(responseData.lipSyncData);

      // Play the audio and start the lip-sync as soon as the data is received
      const audioObj = new Audio(url);
      audioObj.play();
      setAudio(audioObj);
    });

    return () => {
      socket.close();
    }
  }, []);
  // const audio = useMemo(() => audioURL && new Audio(audioURL), [audioURL]);

  useFrame(() => {
    if (!audio || !lipsync) return;
  
    const currentAudioTime = audio.currentTime;
    
    // Reset all morph targets
    
      Object.values(corresponding).forEach((value) => {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      });
    
    
    let currentMouthCue = null;
    let nextMouthCue = null;
    
      // Find the current, next mouth cues
      for (let i = 0; i < lipsync.mouthCues.length - 1; i++) { // Notice the -1
        const mouthCue = lipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          currentMouthCue = mouthCue;
          nextMouthCue = lipsync.mouthCues[i + 1];
          if (nextMouthCue.start === currentMouthCue.start) {
            console.warn('Found adjacent cues with the same start time:', currentMouthCue, nextMouthCue);
            // Handle this special case appropriately, depending on your needs.
          }
          break;
        }
      }

    if (currentMouthCue) {
      // Interpolate between current and next viseme based on audio time
      let interpolationValue = 1; // Default value

if (currentMouthCue) {
  if (nextMouthCue) {
    // Check for unexpected values
    if (nextMouthCue.start === currentMouthCue.start) {
      console.warn('nextMouthCue.start is equal to currentMouthCue.start, this might cause a glitch:', nextMouthCue, currentMouthCue);
    } else {
      interpolationValue = (currentAudioTime - currentMouthCue.start) / (nextMouthCue.start - currentMouthCue.start);
    }
  } else {
    console.warn('nextMouthCue is null or undefined:', nextMouthCue);
  }
}

// Rest of the code using interpolationValue...
      const teethInfluence = 0.95;
      // Set current viseme influence
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[corresponding[currentMouthCue.value]]
      ] = 1 - interpolationValue;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[currentMouthCue.value]]
      ] = (1 - interpolationValue) * teethInfluence;
  
      // If there's a next cue, set its influence with interpolation
      if (nextMouthCue) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[corresponding[nextMouthCue.value]]
        ] = interpolationValue;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[nextMouthCue.value]]
        ] = interpolationValue * teethInfluence;
      }
    }
    
  });
  


  // useEffect(() => {
  //   if(playAudio){
  //     audio.play()
  //   }else{
  //     audio.pause()
  //   }
  // }, [playAudio, script])
  
  const { nodes, materials } = useGLTF('/models/64bb1d39ab757f1e75aaa1aa.glb')
  const group = useRef()
  const {animations :idleAnimation}= useFBX("/animations/Idle.fbx")
  const {animations :greetingAnimation}= useFBX("/animations/Standing Greeting.fbx")
  idleAnimation[0].name = "Idle"
  greetingAnimation[0].name = "Greeting"
  const [animation, setAnimation] = useState("Idle")
  const{actions} = useAnimations([idleAnimation[0], greetingAnimation[0]], group)
  useEffect(() => {
    console.log(nodes.Wolf3D_Head.morphTargetDictionary)
  }, [])
  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);
  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  )
}

useGLTF.preload('/models/64bb1d39ab757f1e75aaa1aa.glb')
