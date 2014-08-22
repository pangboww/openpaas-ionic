// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('esnApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('login', {
      url: '/login',
      abstract: true,
      templateUrl: 'views/modules/login/login.html'
    })
    .state('login.signin', {
      url: '/signin',
      views: {
        'login-signin': {
          templateUrl: 'views/modules/login/login-signin.html'
        }
      }
    })
    .state('login.signup', {
      url: '/signup',
      views: {
        'login-signup': {
          templateUrl: 'views/modules/login/login-signup.html'
        }
      }
    })
    $urlRouterProvider.otherwise('/login/signin');
});
