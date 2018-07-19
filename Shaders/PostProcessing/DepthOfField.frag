#version 330

uniform sampler2D mDepth;
uniform sampler2D mBlur;

in vec2 fragTexCoord;

uniform vec2 textureOffset;

uniform struct DOF
{
	float focalLength;
	float apertureSize;
	float focusDistance;
	float focusPower;
} dof;

uniform struct PROJ
{
	float farPlane;
	float proj33;
	float proj43;
} proj;

out vec4 fragColor;

void main()
{
	//linear depth is distance in eye space
	float distance = 0.0;	
	float depth = texture(mDepth, fragTexCoord).r;
	depth *= 2.0;
	depth -= 1.0;	
	distance = abs(proj.proj43 / (depth + proj.proj33));
	
	float coc = 0.0;
	
	//normal computation when ignoring the focal length, often seen in implementations as it gives the correct results
	//coc = 1.0 * abs((dof.focusDistance - distance) / distance);
	//coc *= coc;
	
	//real life camera based computation, doesn't really make sense to follow it in graphics as you can get better results with less math.
	//float imageDistance = (distance * dof.focalLength) / (distance - dof.focalLength);
	//float focusImageDistance = (dof.focusDistance * dof.focalLength)  (dof.focusDistance - dof.focalLength);
	//float aperture = dof.focalLength / dof.apertureSize;
	//coc = aperture * abs((focusImageDistance - imageDistance) / imageDistance);
	
	
	//augmented exponential coc to have sharp image near focus plane and then more intensly fall into blur compared to normal computation.
	float distPercent = dof.apertureSize * (dof.focusDistance - distance) / (proj.farPlane);
	coc =  pow(abs(distPercent), dof.focusPower);

	
	coc = min(coc, 1.0);	
	fragColor = texture(mBlur, fragTexCoord);
	fragColor.a = coc;
}