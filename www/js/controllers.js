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
						$rootScope.notify("Get domainID wrong, please login again or try later.", 1999);
					});
			},
			function(err) {
				$rootScope.hide();
				$rootScope.notify("Wrong email or password.", 1999);

			}
		);
	};
})
.controller('messageController', function($scope, $rootScope, $state, $ionicPopup, getWhatsupService, postNewWhatsup){
	$rootScope.$broadcast('viewState.showTabBar', true);
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
     		scope: $scope,
     		buttons: [
       			{ text: 'Cancel' },
       			{
         			text: '<b>Post</b>',
         			type: 'button-positive',
         			onTap: function(e) {
           				if (!$scope.data.newMessageContent) {
             				e.preventDefault();
           				} else {
             				postNewWhatsup($scope.data.newMessageContent, $rootScope.domain.activity_stream.uuid);
             				$scope.refresh();
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
	$rootScope.$broadcast('viewState.showTabBar', false);
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
	          		refreshComment();
	          		Keyboard.close();
	        	},
	        	function(err) {
	        		console.log(err);
	        	}
      		);

			var refreshComment = function(){
      			var ids = $rootScope.comment._id;
      			messageAPI.get({'ids[]': ids}).then(function(response){
      				$scope.message = response.data[0];
      				console.log(response.data[0]);
      			},function(err){
      				$rootScope.notify("Refresh comment failed: "+err, 1999);
      			});
      		};

		} else {
			var text = "Please enter something...";
			$rootScope.notify(text, 999);
		}
	}
})





