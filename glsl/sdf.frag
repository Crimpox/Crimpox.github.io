
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_float;

void main(){
    vec2 uv =  gl_FragCoord.xy / u_resolution;


    vec3 color = vec3(uv.x, uv.y, 1.0);

    gl_FragColor = vec4(color, 1.0);

}