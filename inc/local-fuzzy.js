/*!
 * Copyright 2016 Amazon.com,
 * Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the
 * License. A copy of the License is located at
 * 
 *     http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, express or implied. See the License
 * for the specific language governing permissions and
 * limitations under the License. 
 */

function distanceBetweenPoints (x1, y1, x2, y2) {
	
	// Returns the distance between two coordinates
	
	return Math.sqrt( Math.pow( (x2 - x1), 2) + Math.pow( (y2 - y1), 2));

}//end function distanceBetweenPoints

function midPoint (x1, y1, x2, y2) {

	// Returns the midPoint between two coordinates

	var midPointArray = [];

	midPointArray[0] = ((x1 + x2) / 2);
	midPointArray[1] = ((y1 + y2) / 2);
	
	return ( midPointArray );

}//end function midPoint

function areaOfTri (x1, y1, x2, y2, x3, y3) {

	//	Calculates the area of a triangle
	//	Given the three coordinates
	
	//	x1,y1 - x2,y2 = triangle base
	//	x3,y3 = triangle point

	var midPointArray = [];
	var base, height;

	//	Calculate length of base (eye width)
	base = distanceBetweenPoints(x1, y1, x2, y2);
	
	//	Calculate midpoint between eyes
	midPointArray = midPoint(x1, y1, x2, y2);
	
	//	Calculate height of triangle at midpoint
	//	(distance between eyes and nose)
	height = distanceBetweenPoints(midPointArray[0], midPointArray[1], x3, y3);
	
	//	Calculate area
	return (base * height) / 2;

}//end function areaOfTri

function faceArea (width, height) {

	//	Calculates the overall area of the a face bounding box
	
	//	eliptical
	//return (Math.PI * (width / 2) * (height / 2 ));

	//	rectangle
	return width * height;

}//	end function faceArea

function calcFaceProfile (x1, y1, x2, y2, x3, y3, width, height) {

	/*
	faceProfile = calcFaceProfile(
		landmarks.leftPupil.X, landmarks.leftPupil.Y,
		landmarks.rightPupil.X,landmarks.rightPupil.Y,
		landmarks.nose.X,landmarks.nose.Y
		);
	*/
	
	var eyeDistance = distanceBetweenPoints(x1, y1, x2, y2);
	var rightEyeNoseDistance = distanceBetweenPoints(x2, y2, x3, y3);	

	//	Calculate midpoint between eyes
	var midPointArray = midPoint(x1, y1, x2, y2);
	
	//	Calculate height of triangle at midpoint
	//	midpoint = point halfway between eye pupils
	//	height = distance between midpoint and nose
	var Noseheight = distanceBetweenPoints(midPointArray[0], midPointArray[1], x2, y2);

	//console.log('eyeDistance: ' + eyeDistance);
	//console.log('rightEyeNoseDistance: ' + rightEyeNoseDistance);
	//console.log('Noseheight: ' + Noseheight);
	
	return (rightEyeNoseDistance / eyeDistance) * 100;

}//	end function calcFaceProfile

function triAreaPercent (x1, y1, x2, y2, x3, y3, width, height) {

	//triAreaPercent(eyeLeftX, eyeLeftY, eyeRightX, eyeRightY, noseX, noseY, faceWidth, faceHeight);

	// Calculates the percentage of triangle in a square
	var triAreaVal, faceAreaVal;
	
	//	Get area of triangle
	triAreaVal = areaOfTri (x1, y1, x2, y2, x3, y3);
	
	//	Get Area of face bounding box
	faceAreaVal = faceArea (width, height);
	
	//	Calculate the percentage of the triangle in the face area
	return ( (triAreaVal / faceAreaVal) * 100);

}//	end function triAreaPercent