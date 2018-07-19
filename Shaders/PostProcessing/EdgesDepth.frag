#version 330

uniform sampler2D mDepth;

uniform struct PROJ
{
	float farPlane;
	float proj33;
	float proj43;
} proj;

uniform vec2 texOffset;

uniform float strength;
uniform vec3 color;

in vec2 fragTexCoord;

out vec4 fragColor;

float getLinearDepth(vec2 uv)
{
	float depth = texture(mDepth, uv).r;
	float linearDepth = proj.proj43 / (depth + proj.proj33);
	linearDepth /= proj.farPlane;
	return linearDepth;
}

float sobelX[9] = float[9](
	-1, 0, 1,
	-2, 0, 2,
	-1, 0, 1
);

float sobelY[9] = float[9](
	-1, -2, -1,
	0, 0, 0,
	1, 2, 1
);

float diagnol[9] = float[9](
	1, 0, 1,
	0, 0, 0,
	1, 0, 1
);

int axis[9] = int[9](
	0, 1, 0,
	1, 0, 1,
	0, 1, 0
);


void main()
{
	float centerDepth = getLinearDepth(fragTexCoord);
	centerDepth /= strength; //TODO: Make user param?
	
	float edgeX = 0.0;
	float edgeY = 0.0;
	int index = 0;
	
	vec2 axisScale = vec2(centerDepth, 1.0);
	
	for(int i = -1; i <= 1; i++)
	{
		for(int j = -1; j <= 1; j++)
		{
			index = ((i + 1) * 3) + (j + 1);
			float ld = getLinearDepth(fragTexCoord + vec2(float(j) * texOffset.x, float(i) * texOffset.y));
			
			//ld -= centerDepth * diagnol[index];
			//ld /= axisScale[axis[index]];
			
			//scale with the distance to give more of a impact the father away pixels are from eachother, also makes edge much better up close due to dividing decimal by decimal.
			ld /= centerDepth;
			
			edgeX +=  ld * sobelX[index];
			edgeY +=  ld * sobelY[index];
		}
	}
	
	float gradiantMag = clamp(sqrt((edgeX * edgeX) + (edgeY * edgeY)), 0.0, 1.0);
	
	fragColor = vec4(color * gradiantMag, gradiantMag);
}