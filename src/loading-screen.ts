import * as THREE from 'three';

export const setupEntryLoader = (attributes: { loaded: boolean }) => {
  attributes.loaded = false;
  const progress = document.createElement('progress');
  const loadingTitle = document.createElement('h1');
  loadingTitle.classList.add('loading-title');
  loadingTitle.innerText = 'Loading...';
  document.body.appendChild(loadingTitle);
  document.body.appendChild(progress);
  progress.classList.add('loading-bar');
  progress.max = 100;
  progress.value = 0;
  return (url: string, loaded: number, total: number) => {
    const percent = (loaded / total) * 100;
    progress.value = percent;
    if (percent >= 100) {
      progress.value = 100;
      progress.style.opacity = '0';
      loadingTitle.style.opacity = '0';
      setTimeout(() => {
        progress.remove();
        loadingTitle.remove();
      }, 750);
      attributes.loaded = true;
    }
  };
};

export const createEntryOverlay = () => {
  const overlayGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uAlpha: { value: 1 },
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position * 2.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uAlpha;

      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
      }
    `,
  });
  const mesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
  return mesh;
};
