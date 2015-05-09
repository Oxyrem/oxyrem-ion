angular.module('oxyrem.services', [])


.service('LoginService', function($q, $http, $templateCache) {
    var API_Address = 'http://oxyrem.reliqarts.com/api/v1/patient/';

    return {
        loginData: {
            user:   null,
            session: null
        },
        getLoginData: function() {
            return this.loginData;
        },
        loginUser: function(email, pw) {
            var endpoint    = API_Address + 'login';
            var deferred    = $q.defer();
            var promise     = deferred.promise;
            var _self       = this;

            $http({
                method: 'POST',
                url:    endpoint,
                data:   JSON.stringify({user: email, password: pw}),
                cache:  $templateCache,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).
            success(function(data, status) {
                _self.loginData.user     = data.extra;
                _self.loginData.session  = data.content;
                deferred.resolve(_self.loginData); 
            }).
            error(function(data, status) {
                deferred.reject(data);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        logoutUser: function(user, session) {
            var endpoint    = API_Address + 'logout';
            var deferred    = $q.defer();
            var promise     = deferred.promise;
            var _self       = this;

            $http({
                method: 'POST',
                url:   endpoint,
                data:  user,
                cache: $templateCache,
                headers: {
                    'x-oxyrem-session': session.id
                }
            }).
            success(function(data, status) {
               deferred.resolve(data); 
            }).
            error(function(data, status) {
                deferred.reject(data);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})


.service('SessionService', ['$cookieStore', function ($cookieStore) {
    var localStoreAvailable = typeof (Storage) !== "undefined";

    var getItem = function (name) {
        var data;
        var localData = localStorage.getItem(name);
        var sessionData = sessionStorage.getItem(name);

        if (sessionData) {
            data = sessionData;
        } else if (localData) {
            data = localData;
        } else {
            return null;
        }

        if (data === '[object Object]') { return null; };
        if (!data.length || data === 'null') { return null; };

        if (data.charAt(0) === "{" || data.charAt(0) === "[" || angular.isNumber(data)) {
            return angular.fromJson(data);
        };

        return data;
    };

    return { 
        isLoggedIn: function() {
            return (this.get('user') || false);
        },
        session: function() {
            return (this.get('session') || false);
        },
        user: function() {
            return this.isLoggedIn();
        },

        store: function (name, details) {
            if (localStoreAvailable) {
                if (angular.isUndefined(details)) {
                    details = null;
                } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                    details = angular.toJson(details);
                };
                sessionStorage.setItem(name, details);
            } else {
                $cookieStore.put(name, details);
            };
        },

        persist: function(name, details) {
            if (localStoreAvailable) {
                if (angular.isUndefined(details)) {
                    details = null;
                } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                    details = angular.toJson(details);
                };
                localStorage.setItem(name, details);
            } else {
                $cookieStore.put(name, details);
            }
        },

        get: function (name) {
            if (localStoreAvailable) {
                return getItem(name);
            } else {
                return $cookieStore.get(name);
            }
        },

        destroy: function (name) {
            if (localStoreAvailable) {
                localStorage.removeItem(name);
                sessionStorage.removeItem(name);
            } else {
                $cookieStore.remove(name);
            };
        }
    }
}])


.service('PatientService', function($resource, $http, $q) {
    var API_Address = 'http://oxyrem.reliqarts.com/api/v1/patient/';
    var limit       = 20;

    return {
        vitals: $resource(API_Address+'vitals/'+':user/'+limit, {user: '@user'}),
        doctors: $resource(API_Address+'doctors/'+':user/'+limit, {user: '@user'})
        
        /*
        vitals: function(user) {
            var endpoint    = API_Address+'vitals/'+user+'/'+limit;
            var deferred    = $q.defer();
            var promise     = deferred.promise;
            var _self       = this;

            $http({
                method: 'GET',
                url:    endpoint,
                data:   null
            }).
            success(function(data, status) {
                deferred.resolve(data); 
            }).
            error(function(data, status) {
                deferred.reject(data);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
        */
    }
});