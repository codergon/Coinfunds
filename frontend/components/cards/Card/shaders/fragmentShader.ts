const fragmentShader = `
    vec3 rgb(float r, float g, float b) {
        return vec3(r / 255., g / 255., b / 255.);
    }
    vec3 rgb(float c) {
        return vec3(c / 255., c / 255., c / 255.);
    }

    uniform vec3 lowcolor;
    uniform vec3 highcolor;
    uniform float time;

    varying vec2 vUv;
    varying float vDistortion;
    varying float xDistortion;

    void main() {
        vec3 highColor = rgb(highcolor.r, highcolor.g, highcolor.b);
        
        vec3 colorMap = rgb(lowcolor.r, lowcolor.g, lowcolor.b);

        colorMap = mix(colorMap, highColor, vDistortion);
        
        gl_FragColor = vec4(colorMap, 1.);
    }
`;

export default fragmentShader;
