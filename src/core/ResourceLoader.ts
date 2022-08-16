import * as THREE from 'three';
import { AudioLoader, CubeTextureLoader, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { LoaderList } from './interfaces/loader-list.interface';
import { LoaderType } from './types/loader-type.type';

export class ResourceLoader {
  private models: Map<string, GLTF> = new Map();
  private textures: Map<string, THREE.Texture> = new Map();
  private sounds: Map<string, AudioBuffer> = new Map();

  private loaders: Partial<Record<LoaderType, LoaderList[LoaderType]>> = {};
  private manager = new THREE.LoadingManager();

  public getTexture(name: string): THREE.Texture | undefined {
    return this.textures.get(name);
  }

  public getModel(name: string): GLTF | undefined {
    return this.models.get(name);
  }

  public getsound(name: string): AudioBuffer | undefined {
    return this.sounds.get(name);
  }

  set onLoad(cb: () => void) {
    this.manager.onLoad = cb;
  }

  set onError(cb: (path: string) => void) {
    this.manager.onError = cb;
  }

  set onProgress(cb: (url: string, loaded: number, total: number) => void) {
    this.manager.onProgress = cb;
  }

  public async loadCubeTexture(
    name: string,
    urls: string[],
  ): Promise<THREE.CubeTexture | undefined> {
    const texture = this.textures.get(name);
    if (texture && texture instanceof THREE.CubeTexture) {
      return texture;
    }
    const resource = await new Promise<THREE.CubeTexture>((res, rej) => {
      let loader: CubeTextureLoader;
      if (!this.loaders.cube) {
        loader = new CubeTextureLoader(this.manager);
        this.loaders.cube = loader;
      }
      loader = this.loaders.cube as CubeTextureLoader;
      loader.load(urls, res, undefined, rej);
    });
    if (resource) {
      this.textures.set(name, resource);
    }
    return resource;
  }

  public async loadGltf(name: string, path: string): Promise<GLTF> {
    const model = this.models.get(name);
    if (model) {
      return model;
    }
    const resource = await new Promise<GLTF>((res, rej) => {
      let loader: GLTFLoader;
      if (!this.loaders.gltf) {
        loader = new GLTFLoader(this.manager);
        this.loaders.gltf = loader;
      }
      loader = this.loaders.gltf as GLTFLoader;
      loader.load(path, res, undefined, rej);
    });
    if (resource) {
      this.models.set(name, resource);
    }
    return resource;
  }

  public async loadTexture(name: string, path: string): Promise<THREE.Texture> {
    const texture = this.textures.get(name);
    if (texture) {
      return texture;
    }
    const resource = await new Promise<THREE.Texture>((res, rej) => {
      let loader: TextureLoader;
      if (!this.loaders.texture) {
        loader = new TextureLoader(this.manager);
        this.loaders.texture = loader;
      }
      loader = this.loaders.texture as TextureLoader;
      loader.load(path, res, undefined, rej);
    });
    if (resource) {
      this.textures.set(name, resource);
    }
    return resource;
  }

  public async loadAudio(name: string, path: string): Promise<AudioBuffer> {
    const audio = this.sounds.get(name);
    if (audio) {
      return audio;
    }
    const resource = await new Promise<AudioBuffer>((res, rej) => {
      let loader: AudioLoader;
      if (!this.loaders.audio) {
        loader = new AudioLoader(this.manager);
        this.loaders.audio = loader;
      }
      loader = this.loaders.audio as AudioLoader;
      loader.load(path, res, undefined, rej);
    });
    if (resource) {
      this.sounds.set(name, resource);
    }
    return resource;
  }
}
