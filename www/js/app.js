// Ionic Oxyrem App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'oxyrem' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'oxyrem.services' is found in services.js
// 'oxyrem.controllers' is found in controllers.js
angular.module('oxyrem', ['ionic', 'ngCordova', 'ngResource', 'ngCookies', 'ng-mfb', 'angularMoment', 'oxyrem.controllers', 'oxyrem.services'])

.constant('angularMomentConfig', {
    // preprocess: 'unix', // optional
    // timezone: 'Europe/London' // optional
})

.run(function($ionicPlatform, $http, $rootScope, $location, $state, $ionicHistory, SessionService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();

        }
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {

        // console.log('session:-', session.id);
        // console.log("Changing state to :", toState.name);

        /*
        if(! (session || toState.name === 'login') ) {
            event.preventDefault();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go("login");
        }
        */
    });

    var session = SessionService.session();
    if (session)
    {
        $http.defaults.headers.common['x-oxyrem-session']  = session.id;
    }

    $http.defaults.headers.common['Content-Type']       = 'application/json';
    $http.defaults.headers.common['x-oxyrem-appalpha']  = 'alphaX-748Oxyremazesd_s145';
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
    // configurations
    // $ionicConfigProvider.views.transition('android');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })

    .state('logout', {
        url: "/logout",
        controller: 'LogoutCtrl',
        templateUrl: "templates/blank.html",
        cache: false
    })

    // nav drawers
    .state('home', {
      url: "/home",
      abstract: true,
      templateUrl: "templates/home.html",
      controller: 'HomeCtrl'
    })

    .state('home.dash', {
        url: "/vi",
        views: {
            'menuContent': {
                templateUrl: "templates/home-dash.html",
                controller: 'DashCtrl',
            }
        }
    })

    .state('home.doctor', {
        url: "/doctor",
        views: {
            'menuContent': {
                templateUrl: "templates/home-doctor.html",
                controller: 'DoctorCtrl'
            }
        }
    })


    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'TabDashCtrl'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    })

    .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
            'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

});