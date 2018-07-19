#version 330

in struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

uniform sampler2D mSampler;

uniform Material material;
out vec4 fragColor;

uniform float fadeFactor;
uniform float maxFade;

uniform vec4 gamma;

void main()
{	
	float distanceToCam = length(fsIn.viewVector);
	fragColor = pow(texture(mSampler, fsIn.texCoord), gamma);

	//the farther the grass is discard more grass blades to make it looks more realistic
	float expTerm = max(exp(-distanceToCam * fadeFactor), maxFade);
	fragColor.a *= expTerm;

	if(fragColor.a <= 0.6)
	{
		discard;
	}
	
	vec3 normal = normalize(fsIn.worldNormal);	
}