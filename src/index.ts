import './styles/main.css';
import * as THREE from 'three';
import { Core } from './core/Core';
import { createEntryOverlay, setupEntryLoader } from './loading-screen';

import fireflyVertexShader from './shaders/fireflies/vertex.glsl';
import fireflyFragmentShader from './shaders/fireflies/fragment.glsl';

import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

import { ShaderMaterial } from 'three';

const publicPath = process?.env?.PUBLIC_PATH || '/';

const state = {
  core: new Core(window.location.hash === '#debug'),

  attributes: {
    loaded: false,
    backgroundColor: new THREE.Color(0x170c18),
    fireflies: {
      geometry: new THREE.BufferGeometry(),
      count: 30,
      size: 95,
      positions: new Float32Array(30 * 3),
      scales: new Float32Array(30 * 1),
    },
  },
};

const getSceneModel = async () => {
  const model = await state.core.loader.loadGltf(
    'portal',
    `${publicPath}models/portal.glb`,
  );
  return model;
};

const getBakedMaterial = async () => {
  const texture = await state.core.loader.loadTexture(
    'portal',
    `${publicPath}/textures/portal.jpg`,
  );
  texture.flipY = false;
  texture.encoding = THREE.sRGBEncoding;
  const bakedMaterial = new THREE.MeshBasicMaterial({ map: texture });
  return bakedMaterial;
};

const getPoleLightMaterial = async () => {
  const material = new THREE.MeshBasicMaterial({ color: 0xffff8a });
  return material;
};

const getPortalLightMaterial = async () => {
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  return material;
};

const setupBaseModel = async () => {
  const bakedMaterial = await getBakedMaterial();
  const poleLightMaterial = await getPoleLightMaterial();
  const portalLightMaterial = await getPortalLightMaterial();
  const model = await getSceneModel();

  model.scene.traverse((child) => {
    if (child.type === 'Mesh') {
      const mesh = child as THREE.Mesh;
      if (mesh.name.startsWith('poleLight')) {
        mesh.material = poleLightMaterial;
      } else if (mesh.name.startsWith('portal')) {
        mesh.material = portalLightMaterial;
      } else {
        mesh.material = bakedMaterial;
      }
    }
  });
  return model.scene;
};

const createPortalScene = async () => {
  const baseModel = await setupBaseModel();
  return [baseModel];
};

const createFireflies = () => {
  state.attributes.fireflies.positions = new Float32Array(
    state.attributes.fireflies.count * 3,
  );
  for (let i = 0; i < state.attributes.fireflies.count; i++) {
    state.attributes.fireflies.positions[i * 3] = (Math.random() - 0.5) * 4;
    state.attributes.fireflies.positions[i * 3 + 1] = Math.abs(
      (Math.random() - 0.5) * 6,
    );
    state.attributes.fireflies.positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    state.attributes.fireflies.scales[i] = Math.random();
  }

  state.attributes.fireflies.geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(state.attributes.fireflies.positions, 3),
  );
  state.attributes.fireflies.geometry.setAttribute(
    'aScale',
    new THREE.BufferAttribute(state.attributes.fireflies.scales, 1),
  );

  const material = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uPointSize: { value: state.attributes.fireflies.size },
      uTime: { value: 0 },
    },
    vertexShader: fireflyVertexShader,
    fragmentShader: fireflyFragmentShader,
  });

  const points = new THREE.Points(
    state.attributes.fireflies.geometry,
    material,
  );
  return points;
};

// Main function
const main = async () => {
  state.core.setBackgroundColor(state.attributes.backgroundColor);

  const entryLoader = setupEntryLoader(state.attributes);
  state.core.loader.onProgress = entryLoader;
  const overlay = createEntryOverlay();
  state.core.scene.add(overlay);

  const fireflies = createFireflies();
  state.core.scene.add(fireflies);

  state.core.gui?.addColor(state.attributes, 'backgroundColor').onChange(() => {
    state.core.setBackgroundColor(state.attributes.backgroundColor);
  });

  const portalMaterial = new ShaderMaterial({
    fragmentShader: portalFragmentShader,
    vertexShader: portalVertexShader,

    uniforms: {
      uTime: { value: 0 },
    },
  });

  const fireflyGui = state.core?.gui?.addFolder('Fireflies');
  fireflyGui
    ?.add(fireflies.material.uniforms.uPointSize, 'value')
    .name('Size')
    .min(30)
    .max(200)
    .step(0.001);

  const objects = await createPortalScene();

  const portalLight = objects.map((obj) => {
    let found: THREE.Mesh | null = null;
    obj.traverse((child) => {
      if (child.name === 'portalLight') {
        found = child as THREE.Mesh;
      }
    });
    return found as THREE.Mesh | null;
  })[0];
  if (portalLight) {
    portalLight.material = portalMaterial;
  }

  state.core.add(...objects);
  const clock = new THREE.Clock();
  state.core.loop((deltaT: number) => {
    if (state.attributes.loaded && overlay.material.uniforms.uAlpha.value > 0) {
      overlay.material.uniforms.uAlpha.value -= 0.01;
      if (!state.core.controls.enabled) {
        state.core.controls.enabled = true;
      }
    }
    if (state.attributes.loaded) {
      state.core.scene.remove(overlay);
      overlay.material.dispose();
      overlay.geometry.dispose();
      fireflies.material.uniforms.uTime.value = clock.getElapsedTime();
      portalMaterial.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
};

main();
