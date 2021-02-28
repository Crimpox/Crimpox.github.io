#version 150

attribute vec4 position;

varying texcoord;

void main(void)
{
    // Some drivers don't like position being written here
    // with the tessellation stages enabled also.
    // Comment next line when Tess.Eval shader is enabled.
    gl_Position = vec4(position, 0.0, 1.0);
    texcoord = position * vec2(0.5) + vec2(0.5);
}