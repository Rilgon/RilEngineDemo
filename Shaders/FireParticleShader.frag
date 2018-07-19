#version 330

in vec2 texCoord;
in float fragLife;
in vec3 viewVector;

uniform struct Fog
{
	vec3 color;
	vec2 params;
} fog;


uniform sampler2D mTexture;

uniform vec3 startColor;
uniform vec3 endColor;

out vec4 fragColor;

void main()
{	
	fragColor = texture(mTexture, texCoord);
	fragColor.rgb *= mix(startColor, endColor, fragLife);	
	fragColor *= fragLife;
	
	//if(fog.params.y > 0.0)
	//{
	//	float distanceToCam = length(viewVector);
	//	float fogScale = (fog.params.y - distanceToCam) / (fog.params.y - fog.params.x);
	//	float fogLerp = min(fogScale, 1.0);		
	//	fragColor.rgb = mix(fragColor.rgb, fog.color, 1.0 - fogLerp);
	//}

}