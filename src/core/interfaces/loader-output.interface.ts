import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export interface LoaderOutput {
  cube: THREE.CubeTexture;
  gltf: GLTF;
  texture: THREE.Texture;
  audio: AudioBuffer;
}
