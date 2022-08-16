import { AudioLoader, CubeTextureLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export interface LoaderList {
  cube: CubeTextureLoader;
  gltf: GLTFLoader;
  texture: TextureLoader;
  audio: AudioLoader;
}
