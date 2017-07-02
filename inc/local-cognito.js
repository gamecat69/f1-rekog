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


//	Code examples edited from originals here: https://github.com/aws/amazon-cognito-identity-js

//	Global Variables

var poolData = {
	UserPoolId : 'eu-west-1_MCPx0RxCk',
	ClientId : '7njfiv19iksvikoc3f33e421s4'
};

var poolARN        = 'arn:aws:cognito-idp:eu-west-1:524861776773:userpool/eu-west-1_MCPx0RxCk';
var cognitoUser    = '';
var region         = 'eu-west-1';
var IdentityPoolId = 'eu-west-1:a1586075-6d97-41bb-b316-a45c818a2684';

function registerUser (options, callback) {
	
	console.log('registerUser: Options: ' + JSON.stringify(options, null, 2));
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var attributeList = [];

    //var dataEmail = {
    //    Name : 'email',
    //    Value : 'email@mydomain.com'
    //};

    //var dataPhoneNumber = {
    //    Name : 'phone_number',
    //    Value : '+15555555555'
    //};
    //var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    //var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

    //attributeList.push(attributeEmail);
    //attributeList.push(attributePhoneNumber);

    userPool.signUp(options.username, options.password, attributeList, null, function(err, result){
        if (err) {
			callback(err, '');
        } else {
        	callback('', result);
    	}
    });

}//end function registerUser

function authUser (options, callback) {

    var authenticationData = {
        Username : options.username,
        Password : options.password,
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : options.username,
        Pool : userPool
    };
    cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : IdentityPoolId, // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    poolARN : result.getIdToken().getJwtToken()
                }
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

			getUserInfo	(cognitoUser, function(err, result) {
				
			});

			callback('', result);

        },

        onFailure: function(err) {
        	console.log(err);
            callback(err, '');
        },

    });

}//end function authUser

function getUserInfo (cognitoUser, callback) {

	if (cognitoUser) {

    	cognitoUser.getUserAttributes(function(err, result) {
        	if (err) {
        		console.log(err);
            	callback(err, '');
        	} else {
	        	for (i = 0; i < result.length; i++) {
            		console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        		}
        	}
    	});
    
    } else {
    	err = 'User not logged in';
    	console.log(err);
		callback(err, '');
    }

}// end function getUserInfo

function logoutUser (cognitoUser, callback) {

	if (cognitoUser) {

		cognitoUser.signOut();
		callback();

    } else {
    	err = 'User not logged in';
    	console.log(err);
		callback(err, '');
    }

}//end function deleteUser

function getUserFromLocalStorage (options, callback) {

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
       // Attempt to verify an existing local session
       	cognitoUser.getSession(function(err, session) {
            if (err) {
    			console.log(err);
				callback(err, '');
            }
            
            //console.log('session validity: ' + session.isValid());

            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function(err, attributes) {
                if (err) {
    				console.log(err);
					callback(err, '');
                } else {
                    callback('', attributes);
                }
            });

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : IdentityPoolId, // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    poolARN : session.getIdToken().getJwtToken()
                }
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        });
    }

}// end function getUserFromLocalStorage

function getTempAccess (options, callback) {

	data = {};

	// Set the region where your identity pool exists (us-east-1, eu-west-1)
	AWS.config.region = region;

	// Configure the credentials provider to use your identity pool
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    	IdentityPoolId: IdentityPoolId
	});

	// Make the call to obtain credentials
	AWS.config.credentials.get(function(err, result){

		if (err) {
			callback(err, '');
			//console.log('getTempAccess: Error: ' + err);
		} else {
		
    		// Credentials will be available when this function is called.
    		var accessKeyId = AWS.config.credentials.accessKeyId;
    		var secretAccessKey = AWS.config.credentials.secretAccessKey;
    		var sessionToken = AWS.config.credentials.sessionToken;
    	
    		data.accessKeyId     = AWS.config.credentials.accessKeyId;
    		data.secretAccessKey = AWS.config.credentials.secretAccessKey;
    		data.sessionToken    = AWS.config.credentials.sessionToken;
    	
    		callback('', data);
    	}

	});

}//end function getTempAccess