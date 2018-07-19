#version 330

in vec2 fragTexCoord;
in vec4 clipSpacePos;
in vec3 worldPos;
in vec3 viewVector;
in vec3 worldNormal;

uniform sampler2D mReflectiveTexture;
uniform sampler2D mRefractiveTexture;
uniform sampler2D mWaterMap;

uniform float totalTime;
uniform float rippleSpeed;
uniform float textureRepeat;
uniform float waveExponent;
uniform vec3 waterColor;
uniform vec3 highlightColor;
uniform float specularExponent;
uniform float reflectionStrength;
uniform float refractionStrength;
uniform vec3 specularColor;
uniform float distortSpeed;

uniform struct DirectionalLight
{
	vec3 diffuse;
	vec3 specular;
	vec3 direction;
} dirLight;

uniform struct Fog
{
	vec3 color;
	vec2 params;
} fog;

out vec4 fragColor;



void main()
{
	float distanceToCam = length(viewVector);

	//repeat the input uv 
	vec2 fragRepeat = fragTexCoord * textureRepeat;

	//two random uv to be sampled
	vec2 d0 = vec2(fragRepeat.x + totalTime * rippleSpeed, fragRepeat.y);
	vec2 d1 = vec2(fragRepeat.x, 1.0 - (fragRepeat.y + totalTime * rippleSpeed));
	
	//two random normals smapled
	vec3 n0 = texture(mWaterMap, d0).rgb;
	vec3 n1 = texture(mWaterMap, d1).rgb;
	
	//move normals from 0-1 to -1-1
	n0 *= 2.0;
	n0 -= 1.0;
	
	n1 *= 2.0;
	n1 -= 1.0;
	
	vec2 offset = n0.xy + n1.yz;
	offset *= distortSpeed;
	
	vec3 n2 = texture(mWaterMap, fragTexCoord + offset).rgb * 2.0 - 1.0;
	float d = n2.x + n2.y + n2.z;
	d *= 0.3333;
	d = max(d, 0.0);
	d = pow(d, waveExponent);
	vec4 mixedCol = vec4(mix(waterColor, highlightColor, d), 1.0);
	
	vec2 projCoords = clipSpacePos.xy / clipSpacePos.w;
	projCoords += 1.0;
	projCoords *= 0.5;
	
	vec2 offsetUV =	n2.xy;
	
	vec2 reflectUV = vec2(projCoords.x, 1.0 - projCoords.y) + (offsetUV * 0.01);
	reflectUV.x = clamp(reflectUV.x, 0.0, 1.0);
	reflectUV.y = clamp(reflectUV.y, 0.0, 1.0);
	vec4 reflection = texture(mReflectiveTexture, reflectUV);
	reflection = mix(mixedCol, reflection, reflectionStrength);
	
	vec2 refractUV = vec2(projCoords.x, projCoords.y) + (offsetUV * 0.01);
	refractUV.x = clamp(refractUV.x, 0.0, 1.0);
	refractUV.y = clamp(refractUV.y, 0.0, 1.0);
	vec4 refraction = texture(mRefractiveTexture, refractUV);
	refraction = mix(mixedCol, refraction, refractionStrength);
	
	
	vec3 V = viewVector / distanceToCam;
	vec3 N = normalize(worldNormal);	
	vec3 L = normalize(dirLight.direction);

	
	vec3 H = normalize(V + L + vec3(offsetUV.x, offsetUV.y, 0.0));
	float spec = pow(max(dot(H, N), 0.0), specularExponent);
	vec3 specColor = specularColor * vec3(spec);

	float fresnal = max(dot(N, V), 0.0);
	fresnal = 1.0 - fresnal;

	
	vec4 finalColor = mix(refraction, reflection, fresnal);
	//finalColor.rgb += specColor;
	
	
	if(fog.params.y > 0.0)
	{
		
		float fogScale = (fog.params.y - distanceToCam) / (fog.params.y - fog.params.x);
		float fogLerp = min(fogScale, 1.0);		
		//finalColor.rgb = mix(finalColor.rgb, fog.color, 1.0 - fogLerp);
	}
	//
	fragColor = finalColor;
	//fragColor = reflection;
	//fragColor = refraction;
	//fragColor = vec4(mixedCol, 1.0);
	//
	////fragColor = vec4(1.0);
}