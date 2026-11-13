/**
 * GLSL for the space view. Colors come from per-planet attributes, so no textures are loaded.
 *
 * aState values (shared by the glow points and the planet spheres):
 *   0 normal · 1 dimmed (not part of the current focus) · 2 highlighted (linked or on the tour)
 *   3 selected · 4 hovered
 */

export const GLOW_VERTEX = /* glsl */ `
attribute float aSize;
attribute vec3 aGlow;
attribute float aState;
uniform float uScale;
uniform float uTime;
uniform float uFadeNear;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(-mv.z, 0.001);
  float boost = 1.0;
  if (aState > 3.5) boost = 1.35;
  else if (aState > 2.5) boost = 1.5 + 0.15 * sin(uTime * 2.5);
  else if (aState > 1.5) boost = 1.15;
  float size = aSize * 2.7 * boost * uScale / dist;
  gl_PointSize = clamp(size, 2.0, 180.0);
  bool dimmed = aState > 0.5 && aState < 1.5;
  float dim = dimmed ? 0.1 : 1.0;
  // Planets between the camera and the focus fade out so they do not block the view.
  float fade = aState > 2.5 ? 1.0 : smoothstep(uFadeNear * 0.45, uFadeNear, dist);
  // Sub-pixel planets become faint dots, so a zoomed-out view reads as a calm haze.
  vAlpha = dim * fade * clamp(size / 3.0, 0.35, 1.0);
  vColor = dimmed ? vec3(dot(aGlow, vec3(0.3, 0.5, 0.2))) * vec3(0.7, 0.8, 1.0) : aGlow;
}
`;

export const GLOW_FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float core = exp(-d * 10.0);
  float halo = exp(-d * 3.2) * 0.32;
  gl_FragColor = vec4(vColor * (core + halo) * vAlpha, 1.0);
  #include <colorspace_fragment>
}
`;

export const PLANET_VERTEX = /* glsl */ `
attribute vec3 aGlow;
attribute float aState;
uniform float uFadeNear;
varying float vFade;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vObj;
varying vec3 vBase;
varying vec3 vGlowColor;
varying float vState;
varying float vSeed;

void main() {
  vObj = position;
  vec4 world = instanceMatrix * vec4(position, 1.0);
  vec4 mv = modelViewMatrix * world;
  vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
  vView = -mv.xyz;
  #ifdef USE_INSTANCING_COLOR
    vBase = instanceColor;
  #else
    vBase = vec3(0.5);
  #endif
  vGlowColor = aGlow;
  vState = aState;
  vSeed = instanceMatrix[3].x * 0.137 + instanceMatrix[3].y * 0.071;
  float centerDist = -(modelViewMatrix * vec4(instanceMatrix[3].xyz, 1.0)).z;
  vFade = aState > 2.5 ? 1.0 : smoothstep(uFadeNear * 0.45, uFadeNear, centerDist);
  gl_Position = projectionMatrix * mv;
}
`;

export const PLANET_FRAGMENT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vObj;
varying vec3 vBase;
varying vec3 vGlowColor;
varying float vState;
varying float vSeed;
varying float vFade;

void main() {
  // Screen-door fade (interleaved gradient noise) keeps the spheres opaque and cheap.
  float noise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  if (noise > vFade) discard;
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  vec3 l = normalize(vec3(0.45, 0.6, 0.75));
  float diff = max(dot(n, l), 0.0);
  // Soft latitude bands, different per planet, instead of a texture.
  float bands = 0.5 + 0.5 * sin(vObj.y * 6.5 + sin(vObj.x * 3.7 + vSeed) * 1.4 + vSeed);
  vec3 base = vBase * (0.62 + 0.3 * bands);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 2.4);
  vec3 col = base * (0.12 + 0.95 * diff) + vGlowColor * rim * 1.1;
  if (vState > 2.5 && vState < 3.5) col += vGlowColor * 0.22;
  if (vState > 3.5) col += vGlowColor * 0.12;
  if (vState > 0.5 && vState < 1.5) col = vec3(dot(col, vec3(0.3, 0.5, 0.2))) * vec3(0.12, 0.13, 0.17);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;
