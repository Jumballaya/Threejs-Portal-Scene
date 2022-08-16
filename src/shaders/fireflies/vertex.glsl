
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uTime;

attribute float aScale;

void main() {
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  modelPos.y += sin(uTime + modelPos.x * 100.0) * aScale * 0.2;

  vec4 viewPos = viewMatrix * modelPos;
  vec4 projectedPosition = projectionMatrix * viewPos;

  gl_Position = projectedPosition;
  gl_PointSize = uPointSize * uPixelRatio * aScale;
  gl_PointSize *= (1.0 / -viewPos.z);
}