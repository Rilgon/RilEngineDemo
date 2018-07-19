#version 330

#define DEPTH_THRESHOLD 0.0001

uniform sampler2D mDepth;

uniform struct ProjInfo
{
	float proj33;
	float proj43;
	float farPlane;
} projInfo;

uniform vec2 texOffset;

uniform float density;
uniform vec3 color;

uniform mat4 invViewProj;
uniform vec3 camPos;

in vec2 fragTexCoord;

out vec4 fragColor;

void main()
{
	float depth = texture(mDepth, fragTexCoord).r;
	float linearDepth = projInfo.proj43 / (depth + projInfo.proj33);
	
	if(linearDepth < projInfo.farPlane - DEPTH_THRESHOLD)
	{
		vec3 screenSpace = vec3(fragTexCoord.x, fragTexCoord.y, depth) * 2.0 - 1.0;
	
		vec4 worldPos = invViewProj * vec4(screenSpace, 1.0);
		worldPos /= worldPos.w;
		
		vec3 vertToCam = camPos - worldPos.xyz;
		float distToEye = length(vertToCam);
		
		float fogExp = distToEye * density;
		float fogFactor = exp(-(fogExp));
		
		fragColor = vec4(color, 1.0 - fogFactor);
	}
	else
	{
		fragColor = vec4(0.0);
	}

	
	
	//vec3 vertToCam = camPos - worldPos.xyz;
	//float yDiff = abs(vertToCam.y);
	//yDiff = 0.0 - worldPos.y;
	//
	//vertToCam.y = 0.0;
	//float xzDiff = length(vertToCam);
	//
	//float term0 = xzDiff / yDiff;
	//term0 = term0 * term0;
	//
	//float term1 = yDiff * yDiff * 0.5;
	//
	//float density = sqrt(1.0 + term0 * term1);
	//
    //
	//density = 1.0 - exp(-density * 0.004);
	//
	//fragColor = vec4(color, density);
}