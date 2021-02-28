
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
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}