const vertexShader = `
    uniform float time;
    uniform float height;
    uniform vec2 randnum;

    float xDistortion;
    float yDistortion;

    varying float vDistortion;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vDistortion = snoise(vUv.xx * 3. - vec2(time / randnum.x, time / randnum.x) + cos(vUv.yy) * randnum.y) * height;
        xDistortion = snoise(vUv.xx * 1.) * height * randnum.x / 10.;
        vec3 pos = position;
        pos.z += (vDistortion * 55.);
        pos.x += (xDistortion * 55.);
        pos.y += (sin(vUv.y) * 55.);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

export default vertexShader;
