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

//	-------------------------------
//	Global Variables
//	-------------------------------

var faceDetected        = 0;
var faceCollectionMatch = 0;
var faceProfile         = '';
var compareFacesMatch   = 0;
var landmarks = {};

function showRekogLandmark (landmark) {

	var context = canvas.getContext('2d');
	var dotWidth = 4;
	context.fillStyle="#CD0000"; // Set dot colour

	//console.log("X: " + landmarks[landmark].X);
	//console.log("Y: " + landmarks[landmark].Y);

	context.fillRect(landmarks[landmark].X, landmarks[landmark].Y,dotWidth,dotWidth);					

}// end function showRekogCoord

function hideRekogLandmark (landmark) {

	var context = canvas.getContext('2d');
	var dotWidth = 4;
	context.fillStyle="#87CEEB"; // Set dot colour

	//console.log("X: " + landmarks[landmark].X);
	//console.log("Y: " + landmarks[landmark].Y);

	context.fillRect(landmarks[landmark].X, landmarks[landmark].Y,dotWidth,dotWidth);					

}// end function showRekogCoord

var faceProfiles = [
{
  "profile": 62.025757982489836,
  "image": "carloz-sainz.jpg",
  "name": "Carloz Sainz"
},
{
  "profile": 65.08653656004134,
  "image": "daniel.ricciardo.jpg",
  "name": "Daniel Ricciardo"
},
{
  "profile": 61.19948079134899,
  "image": "daniil-kvyat.jpg",
  "name": "Daniil Kvyat"
},
{
  "profile": 64.999992171503,
  "image": "esteban-ocon.jpg",
  "name": "Esteban Ocon"
},
{
  "profile": 57.335370799997996,
  "image": "fernando-alonso.jpg",
  "name": "Fernando Alonso"
},
{
  "profile": 53.11307877760094,
  "image": "filipe-massa.jpg",
  "name": "Filipe Massa"
},
{
  "profile": 57.93126732825766,
  "image": "jolyon-palmer.jpg",
  "name": "Jolyon Palmer"
},
{
  "profile": 61.283271042725204,
  "image": "kevin-magnussen.jpg",
  "name": "Kevin Magnussen"
},
{
  "profile": 48.42988345392672,
  "image": "kimi-raikkonen.jpg",
  "name": "Kimi Raikkonen"
},
{
  "profile": 60.11417741218044,
  "image": "lance-stroll.jpg",
  "name": "Lance Stroll"
},
{
  "profile": 63.770832295561384,
  "image": "lewis-hamilton.jpg",
  "name": "Lewis Hamilton"
},
{
  "profile": 56.54014212004297,
  "image": "marcus-ericsson.jpg",
  "name": "Marcus Ericsson"
},
{
  "profile": 61.23118119488644,
  "image": "max-verstappen.jpg",
  "name": "Max Verstappen"
},
{
  "profile": 59.952308919812126,
  "image": "niko-hulkenberg.jpg",
  "name": "Niko Hulkenberg"
},
{
  "profile": 59.06012913114845,
  "image": "pascal-wehrlein.jpg",
  "name": "Pascal Wehrlein"
},
{
  "profile": 64.97399407077826,
  "image": "romain-grosjean.jpg",
  "name": "Romain Grosjean"
},
{
  "profile": 66.06653848638679,
  "image": "sebastian-vettel.jpg",
  "name": "Sebastian Vettel"
},
{
  "profile": 62.35818292900767,
  "image": "sergio-perez.jpg",
  "name": "Sergio Perez"
},
{
  "profile": 71.29147637618857,
  "image": "stoffel-vandoorne.jpg",
  "name": "Stoffel Vandoorne"
},
{
  "profile": 61.530662709908945,
  "image": "valtteri-bottas.jpg",
  "name": "Valtteri Bottas"
}
];

//	-------------------------------
//	Rekognition Functions
//	-------------------------------

function processFile() {

	debugOutput('processFile: starting');

	var preview   = document.getElementById('preview-image');
	var imageData = '';

	//	Clear and hide previous results
	document.getElementById('result-text').innerHTML = '';		
	document.getElementById('image-details').innerHTML = '';
	document.getElementById('error').innerHTML = '';
	
	hide('result-text');
	hide('result');
	hide('error');
		
	takePicture('', function(err, data) {

		//	Show photo in preview div and hide camera div
		debugOutput('processFile: Showing preview of image');
		
		show('preview');
		hide('camera');
		
		photo.setAttribute('src', data.base64);
				
		debugOutput('processFile: imageBlob size: ' + data.blob.size);
		debugOutput('processFile: imageBlob type: ' + data.blob.type);
		
		//	Process image as blob for Rekognition input		
		var reader  = new FileReader();
		reader.onloadend = function(blob) {
		
			imageData = blob.target.result;	
		
			//	Kick off the process:
			//	1. Detect a face in the image
			//	2. Attempt to find the detected face in the existing image collection
			//	3. Attempt a direct comparison with all f1 driver images
			//	4. Attempt a fuzzy match using a very basic facial feature coordinates formula

			detectFaces(imageData, function () {
		
				//	Detection complete
				//	If face found attempt to match image in collection 
			
				if (faceDetected) {
			
					debugOutput('processFile: Face detected by detectFaces');
					hide('processing');
			
					faceCollectionSearch(imageData, function () {
				
						//	Collection Search completed
						//	If no match found, attempt a face compare
				
						if (! faceCollectionMatch) {
				
							debugOutput('processFile: No face matched in image collection');
							//debugOutput('processFile: Attempting direct face comparison');
						
							//compareFaces(imageData, function () {

								//	Compare faces complete
								//	If no match found, attempt a fuzzy match
						
								//if (! compareFacesMatch) {
							
									//debugOutput('processFile: No exact face match found');
									debugOutput('processFile: Attempting fuzzy image match');
								
									fuzzyMatch(faceProfile);
									
									//	Show the restart div
									show('restart');
								
								//}//if compareFacesMatch
						
							//});// end compareFaces
				
						}// if faceCollectionMatch
				
					});// end faceCollectionSearch
						
				}//if face detected
			
			}); // end detectFaces
			
		}// reader.onload
		
		//	Picture taken. Trigger the async reader.onload function above
		//debugOutput('processFile: Reading image data Blob');
		
		//try {
			reader.readAsArrayBuffer(data.blob);
			debugOutput('processFile: Read blob OK');
			//debugOutput('processFile: File Reader State: ' + reader.readyState);
		//}
		//catch (err) {
		//	debugOutput('processFile: Error reading blob:' + err);
			//debugOutput('processFile: File Reader State: ' + reader.readyState);
		//}
			
	}); // end takePicture

}//end function processFile

function compareFaces (imageData, callback) {

	//	Compares images directly with images stored in S3
	//	Input: Image Blob
	
	var stopLoop = 0;
	
	var rekognition = new AWS.Rekognition({ region:'eu-west-1' });
	
	for (i = 0; i < faceProfiles.length; i++) {
		
		debugOutput('compareFaces: Attempting match with ' + faceProfiles[i].image);
		
		var params = {
			SimilarityThreshold: 1, 
			SourceImage: {
				Bytes: imageData
			}, 
			TargetImage: {
				S3Object: {
					Bucket: "f1-face-rekog", 
    				Name: "images/" + faceProfiles[i].image
				}
			}
		};
		
		rekognition.compareFaces(params, function(err, data) {

			if (err) {
				
				rekogErr = JSON.stringify(err, null, 2);
				debugOutput('compareFaces: Error:' + rekogErr);
			
				//outputError('Error processing file. Are you sure this contains a face?');
			
			} else {
	
				//rekogReturn = JSON.stringify(data, null, 2);
				//debugOutput('compareFaces: data:' + rekogReturn);
						
				//	Process the return data
				if (data.FaceMatches[0]) {
				
					//	Display the result
					document.getElementById('result-text').innerHTML = "<strong>You look most like....." + faceProfiles[i].name + "</strong>";
					document.getElementById('result-image').src = "images/" + faceProfiles[i].image;
							
					show('result-text');
					show('result');
					show('disclaimer');
					
					compareFacesMatch = 1;
					stopLoop = 1;
				
				}// if Match
			
			}//if err
				
		});
		
		if (stopLoop) {
			break;	// Break out of the for loop
		}
		
	}//for each Profile
	
	callback();

}//end function compareFaces

function fuzzyMatch (inputProfile) {

	//	Attempt a fuzzy match using facial feature coordinates
	//	Input: Coordinate data (faceProfile, calculated in detectFaces() )
	//	Old Name: matchFace()

	//	Dummy pseudo async code for testing
	//window.setTimeout(function() {
	//	faceDetected = 1;
	//	callback();
	//	}, 2000);

    var difference = 0;
    var bestIndex = 0;
    var nextBestIndex = 0;
    var bestDifference = Infinity;
    var i, cur, profileValue;

	for (i = 0; i < faceProfiles.length; i++) {
    	
    	cur = faceProfiles[i];
    	profileValue = cur["profile"];
    	//debugOutput('fuzzyMatch: Profile[' + i + '] : ' + profileValue);
    	difference = Math.abs(inputProfile - profileValue);
    	//debugOutput('fuzzyMatch: Diff: ' + difference);
    	
    	if (difference < bestDifference) {
        	bestDifference = difference;
        	nextBestIndex = bestIndex;
        	bestIndex = i;
        	
    	}
	}

	debugOutput('fuzzyMatch: Found a fuzzy match:' + faceProfiles[bestIndex].name);
	debugOutput('fuzzyMatch: Found next fuzzy match:' + faceProfiles[nextBestIndex].name);
				
	//	Display Result
	document.getElementById('result-text').innerHTML = "Your face is similar to <strong>" + faceProfiles[bestIndex].name + "</strong> and <strong>" + faceProfiles[nextBestIndex].name + "</strong>";
	document.getElementById('result-image').src = "images/" + faceProfiles[bestIndex].image;
	document.getElementById('result-image2').src = "images/" + faceProfiles[nextBestIndex].image;
	
	show('result-text');
	show('result');
	show('disclaimer');
	
	//callback();

}//end function fuzzyMatch

function faceCollectionSearch (imageData, callback) {

	//	Compare imageData with all faces in the rekognition face collection
	//	Input: Image Blob
	//	Old Name: faceSearch()

	//	Dummy pseudo async code for testing
	//window.setTimeout(function() {
	//	debugOutput('faceCollectionSearch: Searching for match in collection');
	//	faceCollectionMatch = 0;
	//	callback();
	//	}, 2000);

	var rekognition = new AWS.Rekognition({ region:'eu-west-1' });

	var params = {
		CollectionId: "f1-drivers", 
		FaceMatchThreshold: 95, 
		Image: {
  			Bytes: imageData
  		}, 
  		MaxFaces: 5
 	};

	rekognition.searchFacesByImage(params, function(err, data) {
	
		if (err) {
			
			rekogErr = JSON.stringify(err, null, 2);
			debugOutput('faceCollectionSearch: searchFacesByImage error:' + rekogErr);
			
			outputError('Error processing file.');
			
		} else {
		
			if (data.FaceMatches[0]) {
			
				faceCollectionMatch = 1;
				
				//rekogData = JSON.stringify(data, null, 2);
				//debugOutput('faceCollectionSearch: Full searchFacesByImage data:' + rekogData);
			
				similarity = data.FaceMatches[0].Similarity;
				debugOutput('faceCollectionSearch: searchFacesByImage Similarity:' + similarity);
				
				externalImageId = data.FaceMatches[0].Face.ExternalImageId;
				debugOutput('faceCollectionSearch: searchFacesByImage Match:' + externalImageId);
								
				//	Display Result
				document.getElementById('result-text').innerHTML = "<strong>You look most like....." + externalImageId + "</strong>";
				document.getElementById('result-image').src = "images/" + externalImageId + '.jpg';
						
				show('result-text');
				show('result');
				show('disclaimer');
				
				//	Finished! Call the callback function
				callback();
				
			}//if face matched
		
		}//if err

	callback();

	});

}//end function faceCollectionSearch

function detectFaces (imageData, callback) {

	//	Get face attributes from rekognition
	//	Input: Image Blob

	debugOutput('detectFaces: Detecting face in image');

	var faceId = '';
	var rv = 1;

	var params = {
		Image: {
			Bytes: imageData
		}, 
		Attributes: [
			'ALL'
		]
	};

	//	Dummy pseudo async code for testing
	//window.setTimeout(function() {
	//	faceDetected = 1;
	//	callback();
	//	}, 2000);
	
	var rekognition = new AWS.Rekognition({ region:'eu-west-1' });
	
	rekognition.detectFaces(params, function(err, data) {

		if (err) {
			rekogErr = JSON.stringify(err, null, 2);
			debugOutput('detectFaces: Rekog error:' + rekogErr);
			
			outputError('Error processing file.');
			//show('error');
			
			rv = 1;
			
		} else {
	
			//rekogReturn = JSON.stringify(data, null, 2);
			//console.log('detectFaces Output:' + rekogReturn);
			//debugOutput('detectFaces Output:' + rekogReturn);
	
			if (data.FaceDetails[0]) {
	
				faceDetected = 1;
	
				//	A valid face was found in the imageData
			
				var ageLow = data.FaceDetails[0].AgeRange.Low;
				var ageHigh = data.FaceDetails[0].AgeRange.High;
				var smiling = data.FaceDetails[0].Smile.Value;
				var eyeglasses = data.FaceDetails[0].Eyeglasses.Value;
				var sunglasses = data.FaceDetails[0].Sunglasses.Value;
				var gender = data.FaceDetails[0].Gender.Value;
				//var faceWidth = data.FaceDetails[0].BoundingBox.Width;
				var faceHeight = data.FaceDetails[0].BoundingBox.Height;
				var mouthWidth   = data.FaceDetails[0].Landmarks[4].X - data.FaceDetails[0].Landmarks[3].X;
				var eyeWidth     = data.FaceDetails[0].Landmarks[1].X - data.FaceDetails[0].Landmarks[0].X;
				var nosePosition = data.FaceDetails[0].Landmarks[2].Y;
				var eyeWidthPercent   = (eyeWidth / faceWidth) * 100;
				var mouthWidthPercent = (mouthWidth / faceWidth) * 100;
				var noseHeight        =  nosePosition - data.FaceDetails[0].BoundingBox.Top;
				var noseHeightPercent = (noseHeight / faceHeight) * 100;
				
				var beard = data.FaceDetails[0].Beard.Value;
				var mustache = data.FaceDetails[0].Mustache.Value;
				var eyesOpen = data.FaceDetails[0].EyesOpen.Value;
				var mouthOpen = data.FaceDetails[0].MouthOpen.Value;
				var emotion0 = data.FaceDetails[0].Emotions[0].Type;
				var emotion0Conf = data.FaceDetails[0].Emotions[0].Confidence;
				var emotion1 = data.FaceDetails[0].Emotions[1].Type;
				var emotion1Conf = data.FaceDetails[0].Emotions[1].Confidence;
				var emotion2 = data.FaceDetails[0].Emotions[2].Type;
				var emotion2Conf = data.FaceDetails[0].Emotions[2].Confidence;

				var eyeLeftX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[0].X);
				var eyeLeftY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[1].Y);
				var eyeRightX = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[1].X);
				var eyeRightY = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[1].Y);
				var noseX     = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[2].X);
				var noseY     = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[2].Y);
				var faceHeight = canvas.height * parseFloat(data.FaceDetails[0].BoundingBox.Height);
				var faceWidth  = canvas.width * parseFloat(data.FaceDetails[0].BoundingBox.Width);
				
				var leftPupilX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[5].X);
				var leftPupilY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[5].Y);
				var rightPupilX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[6].X);
				var rightPupilY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[6].Y);

				var leftBrowLeftX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[7].X);
				var leftBrowLeftY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[7].Y);				
				var rightBrowRightX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[11].X);
				var rightBrowRightY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[11].Y);				
				
				var noseLeftX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[21].X);
				var noseLeftY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[21].Y);	
				var noseRightX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[22].X);
				var noseRightY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[22].Y);

				// Draw coordinates on preview image
				var context = canvas.getContext('2d');
				var dotWidth = 4;
				context.fillStyle="#87CEEB"; // Set dot colour
				
				//	Populate a landmarks JSON structure
				//var landmarks = {};
				var	rekogLandMarksDiv = "<span><strong>Hover mouse to show <br/>facial landmarks</strong></span><br/>";
				for (i = 0; i < data.FaceDetails[0].Landmarks.length; i++) {
					var landmark = data.FaceDetails[0].Landmarks[i];
					landmarks[landmark.Type] = {};
					landmarks[landmark.Type].X = canvas.width  * parseFloat(landmark.X);
					landmarks[landmark.Type].Y = canvas.height * parseFloat(landmark.Y);
					context.fillRect(landmarks[landmark.Type].X, landmarks[landmark.Type].Y,dotWidth,dotWidth);
					if (typeof(landmark.Type) != "undefined") {
						rekogLandMarksDiv = rekogLandMarksDiv + "<span onmouseover=\"showRekogLandmark('" + landmark.Type + "');this.style.fontWeight=\'bold\';this.style.color=\'#fbef3d\';\" onmouseout=\"hideRekogLandmark('" + landmark.Type + "');this.style.fontWeight=\'normal\';this.style.color=\'#f8f8f0\';\">" + landmark.Type + "</span><br/>";
					}
				}
				document.getElementById('rekogLandmarks').innerHTML = rekogLandMarksDiv;
				show('rekogLandmarks');
				//console.log('landmarks JSON' + JSON.stringify(landmarks, null, 2));
				
				//context.fillRect(landmarks.leftPupil.X,landmarks.leftPupil.Y,dotWidth,dotWidth);
				//context.fillRect(landmarks.rightPupil.X,landmarks.rightPupil.Y,dotWidth,dotWidth);
				//context.fillRect(landmarks.nose.X,landmarks.nose.Y,dotWidth,dotWidth);

				context.fillStyle="#FFFFFF"; // Set dot colour
				context.font="14px Arial";
				context.fillText("Analyzing facial coordinates...",5,14);
				
				//context.fillRect(landmarks.leftEyeBrowUp.X,landmarks.leftEyeBrowUp.Y,dotWidth,dotWidth);
				//context.fillRect(landmarks.rightEyeBrowUp.X,landmarks.rightEyeBrowUp.Y,dotWidth,dotWidth);
				//context.fillRect(landmarks.noseLeft.X,landmarks.noseLeft.Y,dotWidth,dotWidth);
				//context.fillRect(landmarks.noseRight.X,landmarks.noseRight.Y,dotWidth,dotWidth);
				
				//faceProfile = (eyeWidthPercent * mouthWidthPercent) / noseHeightPercent;

				//debugOutput("detectFaces: Canvas height:" + canvas.height);
				//debugOutput("detectFaces: Canvas width:" + canvas.width);
				
				//faceProfile = triAreaPercent(eyeLeftX, eyeLeftY, eyeRightX, eyeRightY, noseX, noseY, faceWidth, faceHeight);
				//faceProfile = calcFaceProfile(eyeLeftX, eyeLeftY, eyeRightX, eyeRightY, noseX, noseY, faceWidth, faceHeight);
				faceProfile = calcFaceProfile(landmarks.leftPupil.X, landmarks.leftPupil.Y,landmarks.rightPupil.X,landmarks.rightPupil.Y,landmarks.nose.X,landmarks.nose.Y);
								
				//console.log("detectFaces: faceProfile:" + faceProfile);
				
				//debugOutput('detectFaces: Age Range:' + ageLow + ' - ' + ageHigh);
				//debugOutput('detectFaces: Smiling:' + smiling);
				//debugOutput('detectFaces: Gender:' + gender);
				//debugOutput('detectFaces: Beard:' + beard);
				//debugOutput('detectFaces: MouthWidth:' + mouthWidth);
				//debugOutput('detectFaces: eyeWidth:' + eyeWidth);
				
				//debugOutput('detectFaces: FaceWidth:' + faceWidth);
				//debugOutput('detectFaces: FaceHeight:' + faceHeight);
				//debugOutput('detectFaces: eyeLeftX:' + eyeLeftX);
				//debugOutput('detectFaces: eyeLeftY:' + eyeLeftY);
				//debugOutput('detectFaces: eyeRightX:' + eyeRightX);
				//debugOutput('detectFaces: eyeRightY:' + eyeRightY);
				//debugOutput('detectFaces: noseX:' + noseX);
				//debugOutput('detectFaces: noseY:' + noseY);
				//debugOutput('detectFaces: EyeWidthPercent:' + eyeWidthPercent);
				//debugOutput('detectFaces: MouthWidthPercent:' + mouthWidthPercent);
				//debugOutput('detectFaces: noseHeightPercent:' + noseHeightPercent);
			
				//	Display basic image details
				//document.getElementById('image-details').style.display = 'block';
				
				show('image-details');
				document.getElementById('image-details').innerHTML = 
				  "<strong>Gender: </strong>" + gender + "<br/>" 
				+ "<strong>Age Range: </strong>" + ageLow + " - " + ageHigh + "<br/>"
				+ "<strong>Wearing glasses: </strong>" + eyeglasses + "<br/>"
				+ "<strong>Wearing Sunglasses: </strong>" + sunglasses + "<br/>"
				+ "<strong>Beard: </strong>" + beard + "<br/>"		
				+ "<strong>Mustache: </strong>" + mustache + "<br/>"
				+ "<strong>Eyes Open: </strong>" + eyesOpen + "<br/>"	
				+ "<strong>Mouth Open: </strong>" + mouthOpen + "<br/>"
				+ "<strong>Smiling: </strong>" + smiling + "<br/>"
				+ "<strong>Emotions: </strong>" + "<br/>"
				+ emotion0 + "(" + emotion0Conf.toFixed(2) + "% confidence)" + "<br/>"
				+ emotion1 + "(" + emotion1Conf.toFixed(2) + "% confidence)" + "<br/>"
				+ emotion2 + "(" + emotion2Conf.toFixed(2) + "% confidence)" + "<br/>"
				+ "";
				
				//console.log('Face Profile: ' + faceProfile);
				
				//	Finished! Call the callback function
				callback();
				
			} else {
				outputError('No face found in image.');				
			}
		
		}//if err
	
	//callback();
	
	});

}//end function detectFaces

function profileFaces(element) {

	var rekognition = new AWS.Rekognition({ region:'eu-west-1' });
	var newfaceProfiles = [];
	
	var i = element.selectedIndex;
	//console.log('Index: ' + i);
					
		var params = {
			Image: {
				S3Object: {
					Bucket: "f1-face-rekog", 
    				Name: "images/" + faceProfiles[i].image
				}
			}, 
			Attributes: [
				'ALL'
			]
		};
	
		rekognition.detectFaces(params, function(err, data) {

		//console.log('profileFaces: Processing image: ' + faceProfiles[i].image);

		if (err) {
			rekogErr = JSON.stringify(err, null, 2);
			debugOutput('profileFaces: Rekog error:' + rekogErr);
			
			//outputError('Error processing file: ' + faceProfiles[i].image);
			
		} else {
		
			if (data.FaceDetails[0]) {
	
				faceDetected = 1;
	
				//	A valid face was found in the imageData
							
				var eyeLeftX  = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[0].X);
				var eyeLeftY  = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[1].Y);
				var eyeRightX = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[1].X);
				var eyeRightY = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[1].Y);
				var noseX     = canvas.width * parseFloat(data.FaceDetails[0].Landmarks[2].X);
				var noseY     = canvas.height * parseFloat(data.FaceDetails[0].Landmarks[2].Y);
				var faceHeight = canvas.height * parseFloat(data.FaceDetails[0].BoundingBox.Height);
				var faceWidth  = canvas.width * parseFloat(data.FaceDetails[0].BoundingBox.Width);
							
				//	Populate a landmarks JSON structure
				var landmarks = {};
				for (idx = 0; idx < data.FaceDetails[0].Landmarks.length; idx++) {
					var landmark = data.FaceDetails[0].Landmarks[idx];
					landmarks[landmark.Type] = {};
					landmarks[landmark.Type].X = canvas.width  * parseFloat(landmark.X);
					landmarks[landmark.Type].Y = canvas.height * parseFloat(landmark.Y);
					//console.log('landmarkName: ' + landmark.Type);
				}
				//console.log('landmarks JSON' + JSON.stringify(landmarks, null, 2));
								
				//faceProfile = (eyeWidthPercent * mouthWidthPercent) / noseHeightPercent;

				//debugOutput("profileFaces: Canvas height:" + canvas.height);
				//debugOutput("profileFaces: Canvas width:" + canvas.width);
				
				//faceProfile = triAreaPercent(eyeLeftX, eyeLeftY, eyeRightX, eyeRightY, noseX, noseY, faceWidth, faceHeight);
				//faceProfile = calcFaceProfile(eyeLeftX, eyeLeftY, eyeRightX, eyeRightY, noseX, noseY, faceWidth, faceHeight);
				faceProfile = calcFaceProfile(landmarks.leftPupil.X, landmarks.leftPupil.Y,landmarks.rightPupil.X,landmarks.rightPupil.Y,landmarks.nose.X,landmarks.nose.Y);
				
				//debugOutput("profileFaces: faceProfile:" + faceProfile);
				
				//console.log('faceProfile JSON:' + JSON.stringify(faceProfiles, null, 2));
								
				//console.log('profileFaces: Face Profile: ' + faceProfile);
				
				profileData = {};
				profileData.profile = faceProfile;
				profileData.image = faceProfiles[i].image;
				profileData.name = faceProfiles[i].name;
				console.log(JSON.stringify(profileData, null, 2));
				
				//newfaceProfiles = [i] = { "profile" : faceProfile, "image" : faceProfiles[i].image, "name" : faceProfiles[i].name }
				//console.log(newfaceProfiles);

				//	Finished! Call the callback function
				//callback();
				
			} else {
				outputError('No face found in image.');				
				
			}//if face detected
		
		}//if err
		
		});
	

}//end function profileFaces