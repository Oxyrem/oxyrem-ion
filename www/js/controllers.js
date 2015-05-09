angular.module('oxyrem.controllers', [])

.controller('LoginCtrl', ['$scope', '$ionicPopup', '$state', '$ionicHistory', '$ionicLoading', '$cordovaSpinnerDialog','LoginService', 'SessionService' ,function($scope, $ionicPopup, $state, $ionicHistory, $ionicLoading, $cordovaSpinnerDialog, LoginService, SessionService) {
    $scope.data = {
	    'email' : (SessionService.get('last_user') ? SessionService.get('last_user').email : ''),
	    'password': ''
	};
    $scope.login = function() {
        if (window.cordova) {
            $cordovaSpinnerDialog.show('', 'Logging in...');
        } else {   
            $ionicLoading.show({
                template: '<p class="item-icon-left">Logging in...<ion-spinner class="icon"/></p>'
            });
        }

        LoginService.loginUser($scope.data.email, $scope.data.password).success(function(data) {
            
            // Register session info
            SessionService.persist('session', data.session);
            SessionService.persist('user', data.user);
            SessionService.persist('last_user', data.user);

            // fix for stubborn sticky data
            window.location.reload(true);

            $state.go('home.dash', {}, {reload: true});
        }).error(function(data) {
            console.error(data.message || 'Unknown error occured!');
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: data.message
            });
            if (window.cordova) {
                $cordovaSpinnerDialog.hide();
            } else {
                $ionicLoading.hide();
            }
        }).then(function(data){
            if (window.cordova) {
                $cordovaSpinnerDialog.hide();
            } else {
                $ionicLoading.hide();
            }
        });
    }

    // continue into app if logged in
    if(SessionService.session() ) {
        console.log(SessionService.user().username, 'is logged in.');
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("home.dash", {}, {reload: true});
    }
}])

.controller('LogoutCtrl', ['$scope', '$ionicPopup', '$state', 'LoginService', 'SessionService' ,function($scope, $ionicPopup, $state, LoginService, SessionService) {
    
    LoginService.logoutUser(SessionService.get('user'), SessionService.get('session'))
    .success(function(data) {
        SessionService.destroy('session');
        SessionService.destroy('user');
        $state.go('login');
    })
    .error(function(data) {
        console.error(data.message);
        /*var alertPopup = $ionicPopup.alert({
            title: 'Dirty logout!',
            template: data.message
        });*/
        SessionService.destroy('session');
        SessionService.destroy('user');
        $state.go('login');
    })
    .then(function(data) {
        
    });
}])

.controller('HomeCtrl', ['$scope', '$state', 'SessionService', function($scope, $state, SessionService) {
    if(! SessionService.session() ) { $state.go("login"); }

    $scope.data = {
        'user' : SessionService.user()
    };
}])

.controller('DashCtrl', ['$scope', 'PatientService', 'SessionService', function($scope, PatientService, SessionService) {
    $scope.data.user = SessionService.user();
    
    // $state.go($state.current, {}, {reload: true});
    
    var currentUserId   = 20/*$scope.data.user.id*/;
    var vitals          = PatientService.vitals.get({user: currentUserId});

    vitals.$promise.then(function(data) {
        console.log(data);
        $scope.data.vitals = data.content;
    });

    $scope.doRefresh = function() {
        var q = PatientService.vitals.get({user: currentUserId});
        q.$promise.then(function(data) {
            $scope.data.vitals = data.content;
            $scope.$broadcast('scroll.refreshComplete');
            console.log($scope.data);
        });
    };
}])

.controller('DoctorCtrl', ['$scope', 'PatientService', 'SessionService', function($scope, PatientService, SessionService) {
    $scope.data.user = SessionService.user();
    
    var currentUserId   = 20/*$scope.data.user.id*/;
    var doctors         = PatientService.doctors.get({user: currentUserId});

    doctors.$promise.then(function(data) {
        console.log(data);
        $scope.data.doctors = data.content;
    });

    $scope.doRefresh = function() {
        var q = PatientService.doctors.get({user: currentUserId});
        q.$promise.then(function(data) {
            $scope.data.doctors = data.content;
            $scope.$broadcast('scroll.refreshComplete');
            console.log($scope.data);
        });
    };
}])




.controller('TabDashCtrl', function($scope) {
    
})

.controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});