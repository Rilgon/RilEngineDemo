#version 330

out vec4 fragColor;

uniform samplerCube mSampler;
uniform vec4 gamma;
in vec3 direction;

void main()
{
	fragColor = pow(texture(mSampler, direction), gamma);
	gl_FragDepth=1.0;
}
