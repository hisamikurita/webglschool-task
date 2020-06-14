attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
uniform vec2 mouse;

void main(){
    vColor = color * vec4(mouse,1,1);
    gl_Position = vec4(position,1.0);
}