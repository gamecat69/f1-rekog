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

//	------------------------
//	Error Handling
//	------------------------
window.onerror = function(error, url, line) {
	debugOutput('Error: ' + error + ' at line:' + line + ' in url:' + url);
};

//	------------------------
//	Div functions
//	------------------------

function show(o) {
	document.getElementById(o).style.display = 'block';
}//end function show

function hide(o) {
	document.getElementById(o).style.display = 'none';
}//end function hide

function fill(o, fillText) {
	document.getElementById(o).innerHTML = fillText;
}//end function fill

function outputError(errorText) {
	document.getElementById('error').innerHTML = errorText;
	hide('processing');
	show('error');
}//end function fill