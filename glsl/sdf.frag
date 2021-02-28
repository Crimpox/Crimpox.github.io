#version 150

//1:05:36

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

in VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} inData;

out vec4 fragColor;

float sdEllipsoid(vec3 pos, vec3 rad){
    float k0 = length(pos/rad);
    float k1 = length(pos/rad/rad);
    
    return k0*(k0-1.0)/k1;
}

float sdGuy(in vec3 pos){

    float t = fract(time);
    float y =  4.0 * t * (1.0-t);
    vec3 cen = vec3(0.0, y, 0.0);
    
    float sy = 0.5 + 0.5 * y;
    float sz = 1.0/sy;
    
    vec3 rad = vec3(0.25, 0.25*sy, 0.25*sz);
    return sdEllipsoid(pos-cen, rad);
}

float map (in vec3 pos){
    float d1 = sdGuy(pos);
    
    float d2 = pos.y - (-0.25);
    
    return min(d1, d2);
}

vec3 calcNormal(in vec3 pos){
    vec2 e = vec2(0.0001, 0.);
    return normalize(  vec3(map(pos+e.xyy) - map(pos-e.xyy),
                            map(pos+e.yxy) - map(pos-e.yxy),
                            map(pos+e.yyx) - map(pos-e.yyx)));
}

float castRay(in vec3 ro, vec3 rd){
    float t = 0.0;
    for (int i = 0; i<100; i++){
        //Ray sample
        vec3 pos = ro + t*rd;
        
        float h = map(pos);
        
        if (h < 0.001)
            break;
        
        t += h;
        if (t > 20.0) break;
    }
    if (t > 20.0) t =-1.0; 
    return t;
}

void main(void)
{
    vec2 fragCoord = gl_FragCoord.xy;

    vec2 p = (2.0 * fragCoord - resolution)/resolution.y;
    
    
    //Camera
    float an = 10.0 * mouse.x;
    
    vec3 ta = vec3(0.0, 0.5, 0.0);
    vec3 ro = ta + vec3(1.5*sin(an), 0.0, 1.5*cos(an));
    
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0,1,0)));
    vec3 vv = normalize(cross(uu, ww));
    
    vec3 rd = normalize(p.x*uu + p.y*vv + 1.8*ww);
    
    vec3 col = vec3(0.4, 0.75, 1.0) - 0.7 * rd.y;
    
    col = mix(col, vec3(0.7, 0.75, 0.8), exp(-10.0*rd.y));
    
    float t = castRay(ro, rd);
    
    if (t > 0.0){
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);    
        
        vec3 mate = vec3(0.18);
        
        vec3 sun_dir = normalize(vec3(0.8, 0.4, 0.2));
        float sun_dif = clamp( dot(nor, sun_dir), 0.0, 1.0);
        float sun_sha = step(castRay(pos+nor *0.001, sun_dir), 0.0);
        float sky_dif = clamp (0.5 + 0.5*dot (nor, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
        float bou_dif = clamp (0.5 + 0.5*dot (nor, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);
        
        col = mate*vec3 (7.0, 4.5, 3.0) * sun_dif*sun_sha;
        col += mate*vec3(0.5, 0.8, 0.9) * sky_dif;
        col += mate*vec3(0.7, 0.3, 0.2) * bou_dif;

    }
    
    col = pow(col, vec3(0.4545));
    
    fragColor = vec4(col, 1.0);
    
}