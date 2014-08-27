/**
*  Module
*
* Description
*/
angular.module('esn.controllers', [])

.controller('loginController', function($scope, $rootScope, Restangular, $window, loginAPI){
	$scope.user = {
		username: '',
		password: ''
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
				$rootScope.hide();
				$rootScope.notify('Login Successfully', 500);
				$window.location.href = '#/tab/messages'
			},
			function(err) {
				$rootScope.hide();
				alert('failed');

			}
		);

	};
})
.controller('messageController', function($scope, $rootScope, Restangular, $window){
	$scope.messages = {};





})

//TODO: 