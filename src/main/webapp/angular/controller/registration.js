'use strict'
angular.module('myApp').controller("registration", function ($scope,$location,blockUI, commonServices) {
	
	$scope.pageLoaded = true;
	$scope.errorMessageContainer = false;
	$scope.successMessageContainer = false;	
	$scope.loading_contactsInfo = false;
	$scope.error = true;
	$scope.user= {};
	
	// avaiable registration form container
	$scope.cloudAvalContainer = true;
	$scope.userDetailContainer = false;
	$scope.validUserContainer = false;
	$scope.loading_contactsInfo = false;
	$scope.registrationcontainer = true;
	$scope.CongratulationContainer = false;
	$scope.paymentContainer = false;
	 
	
	// function to check cloudname is available
	$scope.cloudCheck = function(cloudAvailUrl) {
		blockUI.start();
		if(cloudAvailUrl){
			$scope.loading_contactsInfo = true;
			commonServices.getInfo(cloudAvailUrl).then(function(responseData){	
				blockUI.stop();
				$scope.loading_contactsInfo = false;
				if(responseData.message =="true"){
					$scope.successMessageContainer = true;
					$scope.errorMessageContainer = false;
					$scope.successMessage = "This cloud name is available.";
					$scope.error = false;
				}else if((responseData.message =="false")){
					$scope.successMessageContainer = false;
					$scope.errorMessageContainer = true;
					$scope.errorMessage = "This cloud name is not available.";
					$scope.error = true;
				}
				else{
					$scope.errorMessageContainer = true;
					$scope.successMessageContainer = false;
					$scope.errorMessage = responseData[0].errorMessage;
					$scope.error = true;

				}
			
			});
		}else{
			$scope.errorMessageContainer = true;
			$scope.errorMessage = "Error: Invalid Request";
		}
	
	}
	
	$scope.resetForm = function(item, event) {
		$scope.pageLoaded = false;											
		 
	}
	// function to submit cloudname 
	$scope.submitForm = function(isValid) {
	 
	if(isValid){
			$scope.userDetailContainer = true;
			$scope.cloudAvalContainer = false;
			$scope.validUserContainer = false;
			$scope.errorMessageContainer = false;
						
		}else{
			$scope.errorMessageContainer = true;
			$scope.loading_contactsInfo = false;
			$scope.errorMessage = "Error: Invalid Request";
		}
	}
	
	// function to submit user information
	$scope.submitUserInfo = function(isValid,postUrl) {

		if(isValid){
			$scope.errorMessageContainer = false;
			$scope.successMessageContainer = false;	
			$scope.loading_contactsInfo = true;
			 
			 var apiUrl = {postUrl : postUrl};
			 
			$scope.user.identifier = Math.floor((Math.random() *(10000-1000))+1000);
			 
			//Updating paramters accordingly
			var dataObject= {
				emailAddress : $scope.user.userEmail,
				phoneNumber : $scope.user.userTel,
				password : $scope.user.password,
				confirmPassword : $scope.user.password_c,
				identifier:$scope.user.identifier
			};
			commonServices.saveInfo(dataObject,apiUrl).then(function(responseData){	
			 
			 
				if(responseData.message == "Success"){
					$scope.pageLoaded = true;					
					$scope.loading_contactsInfo=false;								  
					$scope.userDetailContainer = false;
					$scope.validUserContainer = true;					 
				}
				else
				{
					$scope.errorMessageContainer = true;
					$scope.errorMessage = responseData[0].errorMessage;
				}
			});
		}else{
			$scope.errorMessageContainer = true;
			$scope.loading_contactsInfo = false;
			$scope.errorMessage = "Error: Invalid Request";
		}
	}
	
	$scope.validatesCodes = function(isValid,postUrl)
	{
			if(isValid){
			$scope.errorMessageContainer = false;
			$scope.successMessageContainer = false;	
			$scope.loading_contactsInfo = true;
			 
			 var apiUrl = {postUrl : postUrl};
			 
			
			 
			//Updating paramters accordingly
			var dataObject= {
				emailCode : $scope.user.emailCode,
				phoneCode : $scope.user.phoneCode,
				identifier:$scope.user.identifier
			};
			commonServices.saveInfo(dataObject,apiUrl).then(function(responseData){	
			
				if(responseData.message == "Success"){
					$scope.pageLoaded = true;					
					$scope.loading_contactsInfo=false;								  
					$scope.userDetailContainer = false;
					$scope.validUserContainer = false;		
					$scope.paymentContainer = true;
				}
				else
				{
					$scope.errorMessageContainer = true;
					$scope.errorMessage = responseData[0].errorMessage;
				}
			});
		}
		else
		{
			$scope.errorMessageContainer = true;
			$scope.loading_contactsInfo = false;
			$scope.errorMessage = "Error: Invalid Request";
		}
		
	}
	
	$scope.getPaymentID = function(isValid,postUrl)
	{ 
			if(isValid){
			$scope.errorMessageContainer = false;
			$scope.successMessageContainer = false;	
			$scope.loading_contactsInfo = true;
			 
			 var apiUrl = {postUrl : postUrl};
			 
			 
			//Updating paramters accordingly
			var dataObject= {
				paymentType : "CREDIT_CARD",
				paymentReferenceId : "abcde0123456789",
				paymentResponseCode:"OK",
				amount:"25",
				currency:"USD"
			};
			commonServices.saveInfo(dataObject,apiUrl).then(function(responseData){	
			if(responseData.paymentId != null){
					$scope.pageLoaded = true;					
					$scope.loading_contactsInfo=false;								  
					$scope.userDetailContainer = false;
					$scope.validUserContainer = false;		
					$scope.paymentContainer = true;
					$scope.registerCloudName(responseData.paymentId,"csp/+testcsp/clouds/personalClouds");
				}
				else
				{
					$scope.errorMessageContainer = true;
					$scope.errorMessage = responseData[0].errorMessage;
				}
			});
		}
		else
		{
			$scope.errorMessageContainer = true;
			$scope.loading_contactsInfo = false;
			$scope.errorMessage = "Error: Invalid Request";
		}
	
	}
	
	$scope.registerCloudName = function(paymentID,posturl)
	{ 
			if(paymentID != null){
			$scope.errorMessageContainer = false;
			$scope.successMessageContainer = false;	
			$scope.loading_contactsInfo = true;
			 
			 var apiUrl = {postUrl : posturl};
			 
			 
			//Updating paramters accordingly
			var dataObject= {
								properties: 
								{
									cloudName: $scope.user.cloudName,
									requestType: "PERSONAL",
									paymentId: paymentID,
									rnPolicyConsent: $scope.user.I_Agree,
									cspPolicyConsent: $scope.user.I_Agree
								},
								personalCloudInfo: 
								{
									phoneNumber: $scope.user.userTel,
									emailAddress: $scope.user.userEmail,
									password: $scope.user.password
								}};
								
								
			commonServices.saveInfo(dataObject,apiUrl).then(function(responseData){	
			
				if(responseData.message == "Success"){
					$scope.pageLoaded = true;					
					$scope.loading_contactsInfo=false;								  
					$scope.userDetailContainer = false;
					$scope.validUserContainer = false;		
					$scope.paymentContainer = false;
					$scope.registrationcontainer = false;
					$scope.CongratulationContainer = true;
				}
				else
				{
					$scope.errorMessageContainer = true;
					$scope.errorMessage = responseData[0].errorMessage;
				}
			});
		}
		else
		{
			$scope.errorMessageContainer = true;
			$scope.loading_contactsInfo = false;
			$scope.errorMessage = "Error: Invalid Request";
		}
	
	}
	
	
});