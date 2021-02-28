
let sdfShader;

function preload(){
    sdfShader = loadShader('../glsl/sdf.vert', '../glsl/sdf.frag');

}

function setup(){
    createCanvas(500, 500, WEBGL);
    background(0);
    shader(sdfShader);
    noStroke();

}

function draw(){
    sdfShader.setUniform("u_resolution", [width, height]);
    sdfShader.setUniform("u_time", millis() / 1000.0);
    sdfShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    
    shader(sdfShader);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}