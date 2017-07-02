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

//	-----------------------
//	Cognito Code
//	-----------------------

//	Get a temporary guest access key to access AWS resources

window.onload = function() {

	debugOutput('root: Attempting login using CognitoIdentityCredentials');

	//	Add listener for button click
	startbutton = document.getElementById('startbutton');
	startbutton.addEventListener('click', function(ev){
		processFile();
		ev.preventDefault();
	}, false);

	getTempAccess('', function(err, data) {
		
		hide('error');
		hide('result-text');
		
		if (err) {
			debugOutput('root: Unable to login as guest:' + JSON.stringify(err, null, 2));
			outputError('Error: ' +  err);
			//fill('error', 'Error: ' +  err);
		} else {
			debugOutput('root: Guest login OK. AccessKeyId: ' + data.accessKeyId);
		}
	
	});
	
	//	Set Y position of Landmarks controls
	//element = document.getElementById('photo');
	//var rect = element.getBoundingClientRect();
	//var yPos = rect.top;
	//console.log("ypos: " + yPos);
	
	//var yPos = (document.getElementById('preview').offset.top;
	//document.getElementById('rekogLandmarks').style.top = yPos+'px';
	//console.log("ypos: " + yPos);
	
	//	Init JS Photo functions and vars
	jsPhotoStartup();
};

//	------------------------
//	Verbose Console output
//	------------------------

function debugOutput (str) {
	    		
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
		
	//	Append debug div with str
	var mydiv = document.getElementById("debugOutput");
	var newcontent = document.createElement('span');
	newcontent.innerHTML = '<br/>' + datetime + ' ' + str;

	while (newcontent.firstChild) {
			mydiv.appendChild(newcontent.firstChild);
	}

}// end function debugOutput

//	------------------------
//	Handlers for link clicks
//	------------------------

// Show/hide debug console
document.getElementById('showDebug').onclick = function() {
	if (document.getElementById('debugDiv').style.display == 'block') {
		hide('debugDiv');
	} else {
		show('debugDiv');
	}

};
