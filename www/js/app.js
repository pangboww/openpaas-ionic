angular.module('esnApp', [
  'ionic',
  'esn.controllers',
  'esn.services',
  'restangular',
  'angularMoment'
  ])
.run(function($ionicPlatform, $rootScope, $window, $state, $ionicLoading, userAPI) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.StatusBar.styleLightContent();
    }
    if(window.cordova.plugins.StatusBar) {
      cordova.plugins.StatusBar.styleLightContent();
    }
  });

  // TODO: Add automatic login 
  //
  //
  // userAPI.currentUser()
  // .then(
  //   function(data) {
  //     $rootScope.user = data;
  //     $state.go('tab.messages');
  //   });

  $rootScope.show = function(text){
    $rootScope.loading = $ionicLoading.show({
      template: text ? text: 'Loading...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidith: 200,
      showDelay: 0 
    });
  };

  $rootScope.hide = function(){
    $ionicLoading.hide();
  };

  $rootScope.notify = function(text, time) {
          var time = time || 1999;
          $rootScope.show(text);
          $window.setTimeout(function() {
              $rootScope.hide();
          }, time);
  };
})

.config(function($stateProvider, $urlRouterProvider, RestangularProvider){
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login/login.html',
      controller: 'loginController'
    })
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'views/tabs/tabs.html',
    })
    .state('tab.messages', {
      url: '/messages',
      views: {
        'tab-messages': {
          templateUrl: 'views/tabs/tab-messages.html',
          controller: 'messageController'
        }
      }
    })
    .state('tab.discussions', {
      url: '/discussions',
      views: {
        'tab-discussions': {
          templateUrl: 'views/tabs/tab-discussions.html'
        }
      }
    })
    .state('tab.communities', {
      url: '/communities',
      views: {
        'tab-communities': {
          templateUrl: 'views/tabs/tab-communities.html'
        }
      }
    })
    .state('tab.applications', {
      url: '/applications',
      views: {
        'tab-applications': {
          templateUrl: 'views/tabs/tab-applications.html'
        }
      }
    })
    .state('tab.comments', {
      url: '/comments',
      views: {
        'tab-messages': {
          templateUrl: 'views/message/comments.html',
          controller: 'commentController'
        }
      }
    });

  $urlRouterProvider.otherwise('/login');

  RestangularProvider.setBaseUrl('http://localhost:8080/api');
  RestangularProvider.setFullResponse(true);
    RestangularProvider.setDefaultHttpFields({
    'withCredentials': true
  });
})
;
