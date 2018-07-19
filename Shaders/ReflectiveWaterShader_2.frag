#version 330

in vec2 fragTexCoord;
in vec4 clipSpacePos;
in vec3 worldPos;
in vec3 viewVector;
in vec3 worldNormal;

uniform sampler2D mReflectiveTexture;
uniform sampler2D mRefractiveTexture;
uniform sampler2D mDistortTexture;

uniform float timeOffset;
uniform float scrollSpeed;
uniform float distortSpeed;
uniform vec3 specularColor;
uniform float viewSpecularExponent;
uniform vec3 waterColor;
uniform float waterColorDensity;
uniform float reflectionDecrease;
uniform float hasReflection;
uniform float baseSpecularExponent;
uniform float baseSpecularStrength;
uniform float textureRepeat;

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
	vec2 texCoord = fragTexCoord * textureRepeat;
	vec2 distortUV = texCoord + (timeOffset * scrollSpeed);
	
	vec3 distortNormal = texture(mDistortTexture, distortUV).rgb;
	distortNormal *= 2.0;
	distortNormal -= 1.0;
	
	vec2 offsetUV = distortNormal.rg * distortSpeed;
	
	vec2 projCoords = clipSpacePos.xy / clipSpacePos.w;
	projCoords += 1.0;
	projCoords *= 0.5;
	
	vec2 reflectUV = vec2(projCoords.x, 1.0 - projCoords.y) + offsetUV;
	reflectUV.x = clamp(reflectUV.x, 0.0, 1.0);
	reflectUV.y = clamp(reflectUV.y, 0.0, 1.0);
	vec4 reflection = texture(mReflectiveTexture, reflectUV);
	
	vec2 refractUV = vec2(projCoords.x, projCoords.y) + offsetUV;
	refractUV.x = clamp(refractUV.x, 0.0, 1.0);
	refractUV.y = clamp(refractUV.y, 0.0, 1.0);
	vec4 refraction = texture(mRefractiveTexture, refractUV);
	
	fragColor = refraction;
	
	float distanceToCam = length(viewVector);
	vec3 V = viewVector / distanceToCam;
	vec3 N = normalize(worldNormal);	
	vec3 L = normalize(dirLight.direction);
	vec3 DN = normalize(distortNormal + texture(mDistortTexture, texCoord - (timeOffset * scrollSpeed)).xyz);
	
	float baseSpec = max(DN.y, 0.0);
	baseSpec = pow(baseSpec, baseSpecularExponent);
	baseSpec *= baseSpecularStrength;
	
	vec3 lightReflect = reflect(-L, DN);
	float viewSpec = max(dot(lightReflect, V), 0.0);
	viewSpec = pow(viewSpec, viewSpecularExponent);

	float fresnal = max(dot(N, V), 0.0);
	fresnal = 1.0 - fresnal;
	fresnal = pow(fresnal, reflectionDecrease);
	 
	float totalSpecular = max(baseSpec + viewSpec, 0.0);
	vec3  specHighlight = specularColor * totalSpecular;
	
	vec3 nonRefractive = mix(waterColor, reflection.rgb, (1.0 - waterColorDensity) * hasReflection);
	nonRefractive += specHighlight;
	
	vec3 finalColor = mix(refraction.rgb, nonRefractive, fresnal);
	
		
	if(fog.params.y > 0.0)
	{
		
		float fogScale = (fog.params.y - distanceToCam) / (fog.params.y - fog.params.x);
		float fogLerp = min(fogScale, 1.0);		
		finalColor.rgb = mix(finalColor.rgb, fog.color, 1.0 - fogLerp);
	}
	//
	fragColor = vec4(finalColor, 1.0);
	//fragColor = reflection;
	////fragColor = refraction;
	//
	////fragColor = vec4(1.0);
}