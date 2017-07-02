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

//	Global Vars

var width       = 320;   // photo Width
var height      = 0;     // Automatically computed based on the webcam output
var streaming   = false; // Start with no streams
var video       = null;
var canvas      = null;
var photo       = null;
var startbutton = null;

function jsPhotoStartup() {
	
	debugOutput('jsPhotoStartup: starting');
	
	video = document.getElementById('video');
	canvas = document.getElementById('canvas');
	photo = document.getElementById('photo');
 
 	navigator.mediaDevices.getUserMedia(
      	{ audio: false, video: true}
      	).then(function(stream) {
          		
          	var vendorURL = window.URL || window.webkitURL;
          	video.src = vendorURL.createObjectURL(stream);
        	show('camera');
        	video.play();
        	
      	}).catch(function(err) {
        	
        	debugOutput("root: Unable to start webcam. Error:" + JSON.stringify(err, null, 2));
			outputError("Please give your browser access to the camera");
			hide('camera');
      	
      	}
    
    ); // end navigator.mediaDevices.getUserMedia

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false); // end video.addEventListener
    
    clearPhoto();

}// end function startup

function clearPhoto() {

	var context = canvas.getContext('2d');
	context.fillStyle = "#AAA";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var data = canvas.toDataURL('image/png');    
	photo.setAttribute('src', data);

}// end function clearPhoto

function takePicture(options, callback) {
	
	//	Takes a picture and returns the image in base64 and original blob
	
	debugOutput('takePicture: starting');
		
	var context = canvas.getContext('2d');
	var output  = {};
	
	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);
    
		output.base64 = canvas.toDataURL('image/png');
		
		if (/Edge\/\d./i.test(navigator.userAgent)){
		
			debugOutput('takePicture: detected MS Edge Browser');
			output.blob = canvas.msToBlob("image/jpeg");
			callback('',output);
		
		} else {
			
			canvas.toBlob(function(blob) {
				output.blob = blob;
				callback('',output);	
			}); 
		
		}
		
	} else {
		clearPhoto();
		callback('','');
	}
	
}//end function takePicture