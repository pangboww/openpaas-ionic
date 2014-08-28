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
.controller('messageController', function($scope, $rootScope, getWhatsupService){


	$scope.refresh = function(){
		$scope.messages = [];
		$scope.messages = getWhatsupService.all();
		// $scope.messages = fetchMessagesContent.fetchContent(whatsups);
		console.log($scope.messages);
		$scope.$broadcast('scroll.refreshComplete');
	};
	$scope.refresh();


})
