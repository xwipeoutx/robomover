// Vertex shader

//Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

//Uniforms
uniform mat4 u_World;
uniform mat4 u_ViewProjection;
uniform vec3 u_cameraPosition;
uniform mat4 grassTextureTransform;
uniform mat4 dirtTextureTransform;
uniform vec2 u_Vector;

//Samplers
uniform sampler2D GrassTextureSampler;
uniform sampler2D DirtTextureSampler;

//Varyings
varying vec4 v_worldPos;
varying vec2 transformedUV;
varying vec2 vMainuv;
varying vec2 transformedUV1;
varying vec4 v_output3;
varying vec2 v_uv;

//Lights
#include<lightFragmentDeclaration>[0..maxSimultaneousLights]

//World normal
#include<helperFunctions>

//Entry point
void main(void) {

//World position
vec4 worldPos = u_World * vec4(position, 1.0);

//Lights
v_worldPos = worldPos;
#include<shadowsVertex>[0..maxSimultaneousLights]

//World normal
mat3 u_World_NUS = mat3(u_World);
vec4 output3 = vec4(u_World_NUS * normal, 0.0);

//WorldPos
vec4 output1 = u_World * vec4(position, 1.0);

//WorldPos * ViewProjectionTransform
vec4 output0 = u_ViewProjection * output1;

//VertexOutput
gl_Position = output0;

//GrassTexture
transformedUV = vec2(textureTransform * vec4(uv.xy, 1.0, 0.0));
vMainuv = uv.xy;

//DirtTexture
transformedUV1 = vec2(textureTransform1 * vec4(uv.xy, 1.0, 0.0));
vMainuv = uv.xy;
v_output3 = output3;
v_uv = uv;

}