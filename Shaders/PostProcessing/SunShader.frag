#version 330

#define DEPTH_THRESHOLD 0.01

//uniform sampler2D mColor;
uniform sampler2D mDepth;

in vec2 fragTexCoord;

out vec4 fragColor;

uniform vec2 sunPosition;

uniform struct Proj
{
	float m33;
	float m43;
	float farPlane;
	float aspectRatio;
} proj;

float getLinearDepth(vec2 texCoord)
{
	float depth = texture(mDepth, texCoord).r;
	return proj.m43 / (depth + proj.m33);
}

void main()
{
	float depth =  getLinearDepth(fragTexCoord);
	//depth = texture(mDepth, fragTexCoord).r;
	//if(depth < 0.9999)
	if(depth < proj.farPlane - DEPTH_THRESHOLD)
	{
		fragColor = vec4(0, 0, 0, 1);
	}
	else
	{
		vec2 sun = sunPosition;
		vec2 deltaTex = fragTexCoord - sun;
		deltaTex.y /= proj.aspectRatio;		
		deltaTex *= 16.0;
		
		
		float delta = length(deltaTex);
		delta = 10 * pow(delta, 21.0);
		delta = 1.0 - delta;
		delta = clamp(delta, 0.0, 1.0);
		fragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(1, 1, 1, 1), delta);
	}

}