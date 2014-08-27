/**
* esn.services Module
*
* Description
*/
angular.module('esn.services', ['restangular'])

.factory('loginAPI', ['Restangular', function(Restangular) {

	function login(credentials) {
	  return Restangular.all('login').post(credentials);
	}

	return {
	  login: login
	};
}])
.factory('userAPI', ['Restangular', function(Restangular) {

    function currentUser() {
      return Restangular.one('user').get();
    }

    function user(uuid) {
      return Restangular.one('user', uuid).get();
    }

    function getCommunities() {
      return Restangular.one('user').all('communities').getList();
    }

    return {
      currentUser: currentUser,
      user: user,
      getCommunities: getCommunities
    };
  }]);

