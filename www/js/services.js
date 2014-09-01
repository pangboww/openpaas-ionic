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

.factory('messageAPI', ['Restangular', function(Restangular) {

    function get(options) {
      if (angular.isString(options)) {
        return Restangular.one('messages', options).get();
      }
      return Restangular.all('messages').getList(options);
    }

    function post(objectType, data, targets) {
      var payload = {};

      payload.object = angular.copy(data);
      payload.object.objectType = objectType;
      payload.targets = targets;

      return Restangular.all('messages').post(payload);
    }

    function addComment(objectType, data, inReplyTo) {
      var payload = {};
      payload.object = angular.copy(data);
      payload.object.objectType = objectType;
      payload.inReplyTo = inReplyTo;

      return Restangular.all('messages').post(payload);
    }

    return {
      get: get,
      post: post,
      addComment: addComment
    };

}])

.service('getWhatsupService', function($rootScope, Restangular, activitystreamAPI, messageAPI){
    
    this.all = function(){
        var whatsups = [];
        var activitystreamID = $rootScope.domain.activity_stream.uuid;
        activitystreamAPI.get(activitystreamID).then(
            function(data){
                angular.forEach(data.data, function(value, key){
                    if(value.inReplyTo == undefined || value.inReplyTo.length == 0){
                        var ids = value.object._id;
                        messageAPI.get({'ids[]': ids}).then(function(response){
                            whatsups.push(response.data[0]);
                        });
                    }
                });
            },
            function(err){
                alert("Get messages failed: " + err);
            }
        );
        return whatsups;
    };
})

.service('postNewWhatsup', ['messageAPI', '$rootScope', function(messageAPI, $rootScope){
  return function(newMessageContent, uuid){

    var objectType = 'whatsup';
    var data = {
        description: newMessageContent
      };
    var target = {
        objectType: 'activitystream',
        id: uuid
      };
    messageAPI.post(objectType, data, [target]).then(
        function(response) {
          $rootScope.notify("Post new message successful.", 1999);
        },
        function(err) {
          console.log(err);
        });
  }
}])

.directive('tabControllerBar', function($rootScope){
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      $rootScope.$on('viewState.showTabBar', function(e, showTabBar) {
        if(showTabBar === false) {
          $element[0].classList.add('tabs-item-hide');
        } else {
          $element[0].classList.remove('tabs-item-hide');
        }
      });
    }
  };
});


