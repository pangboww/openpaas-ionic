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
						$rootScope.notify('Login Successfully', 1999);
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
.controller('messageController', function($scope, $rootScope, Restangular, activitystreamAPI){

	$scope.refresh = function(){
		$scope.messages = {}
		var activitystreamID = $rootScope.domain.activity_stream.uuid;
		activitystreamAPI.get(activitystreamID).then(
			function(data){
				$scope.messages = data.data;
				$scope.$broadcast('scroll.refreshComplete');
			},
			function(err){
				alert("Get messages failed: " + err);
				$scope.$broadcast('scroll.refreshComplete');
			}
		);

	};
	$scope.refresh();


})
