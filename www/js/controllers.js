angular.module('esn.controllers', [])

.controller('loginController', function($scope, $rootScope, Restangular, $state, loginAPI, domainAPI){
	$scope.user = {
		username: 'pangbo@gmail.com',
		password: '123456'
	};
	$scope.login = function (){
		$rootScope.show('Please wait... Authenticating');

		var username = this.user.username,
			password = this.user.password;

		if(!username || !password){
				$rootScope.notify('Please fill up both fields');
				return false;
		}
		
		loginAPI.login({
			username: username,
			password: password
		}).then(
			function(date) {
				$rootScope.user = data;
				var domainID = data.domains[0].domain_id;

				domainAPI.get(domainID).then(
					function(data){
						$rootScope.domain = data.data;
						$rootScope.hide();
						$rootScope.notify('Login Successfully', 999);
						$state.go('tab.messages');
					},
					function(err) {
						$rootScope.hide();
						alert('get domain failed: ' + err);
					});
			},
			function(err) {
				$rootScope.hide();
				alert('login failed: ' + err);

			}
		);
	};
})
.controller('messageController', function($scope, $rootScope, $state, $ionicPopup, getWhatsupService, postNewWhatsup){

	$scope.refresh = function(){
		$scope.messages = [];
		$scope.messages = getWhatsupService.all();
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.refresh();

	$scope.newMessage = function(){
		$scope.data = {};
		$ionicPopup.show({
			templateUrl: './views/message/new-message.html',
     		title: "A new whatsup to your friend: ",
     		scope: $scope,
     		buttons: [
       			{ text: 'Cancel' },
       			{
         			text: '<b>Post</b>',
         			type: 'button-positive',
         			onTap: function(e) {
           				if (!$scope.data.newMessageContent) {
             				//don't allow the user to close unless he enters wifi password
             				e.preventDefault();
           				} else {
             				postNewWhatsup($scope.data.newMessageContent, $rootScope.domain.activity_stream.uuid)
           				}
         			}
       			}
     		]
		});
	}

	$scope.checkComment = function(index){
		$rootScope.comment = $scope.messages[index];
		$state.go('tab.comments');
	}
})

.controller('commentController', function($scope, $rootScope, messageAPI){
	
	$scope.message = $rootScope.comment;

	$scope.postComment = function(){
		if ($scope.whatsupcomment !== ''){
			var objectType = 'whatsup';
      		var data = {
        		description: $scope.whatsupcomment
      		};
	      	var inReplyTo = {
	        	objectType: $scope.message.objectType,
	        	_id: $scope.message._id
	     	};
			
			messageAPI.addComment(objectType, data, inReplyTo).then(
	        	function(response) {
	          		$scope.whatsupcomment = '';
	          		Keyboard.close();
	        	},
	        	function(err) {
	        		console.log(err);
	        	}
      		);
		} else {
			var text = "Please enter something...";
			$rootScope.notify(text, 999);
		}
	}
})





