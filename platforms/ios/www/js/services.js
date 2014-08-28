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
 }])

.factory('domainAPI', ['Restangular', function(Restangular) {

    /**
     * Get the list of members of a domain.
     *
     * @param {String} id
     * @param {Hash} options - Hash with limit (int), offset (int) and search (string)
     */
    function getMembers(id, options) { 
      return Restangular.one('domains', id).getList('members', options);
    }

    /**
     * Invite users to join a domain
     *
     * @param {String} id
     * @param {Array} emails - Array of emails (string)
     */
    function inviteUsers(id, emails) {
      return Restangular.one('domains', id).customPOST(emails, 'invitations');
    }

    /**
    * Check if the current user is the manager of the domain.
    * returns HTTP 200 if OK, HTTP 403 if not manager.
    *
    * @param {String} id - The domain id
    */
    function isManager(id) {
      return Restangular.one('domains', id).one('manager').get();
    }

    /**
    * retrieve a domain basic informations
    * returns HTTP 200 if OK, HTTP 403 if not manager.
    *
    * @param {String} id - The domain id
    */
    function get(id) {
      return Restangular.one('domains', id).get();
    }

    return {
      getMembers: getMembers,
      inviteUsers: inviteUsers,
      isManager: isManager,
      get: get
    };
 }])

.factory('activitystreamAPI', ['Restangular', function(Restangular) {
    function get(id, options) {
      	return Restangular.all('activitystreams/' + id).getList(options);
    }
    return {
      	get: get
    };
}])


