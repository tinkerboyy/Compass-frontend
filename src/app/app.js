angular.module('myStaffScheduler', [
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'ng.shims.placeholder',
    'angularGrid',
    'as.sortable',
    'myStaffScheduler.serviceConstants',
    'templates.app',
    'templates.common',
    'common.directives',
    'common.services',
    'resourceAllocation',
    'scheduleSummary'
])


.factory("httpInterceptor", ["$q", "compassToastr", function($q, compassToastr) {
    var httpInterceptor = {
        'request': function(config) {
           return config;
        },
        'responseError': function(rejection) {
            var displayText = "";
            if (rejection.status === 404) {
                displayText = "Unable to find url: " + rejection.config.url;
            } else if (rejection.status === 500) {
                displayText = "Internal Server Error";
            } else if (rejection.status === 403) {
                displayText = "Authorization Failed";
            } else if (rejection.status === 400) {
                displayText = "Incorrect values/field validation error";
            }
            compassToastr.warning(displayText + "<br>Please contact support.");
            console.log(rejection);
            return $q.reject(rejection);
        }
    };
    return httpInterceptor;
}])


.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$provide', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $translateProvider, $provide, $httpProvider) {
    $urlRouterProvider.otherwise("/");

    $translateProvider.translations("en", en_US);
    $translateProvider.fallbackLanguage("en");
    $translateProvider.preferredLanguage("en");

    $provide.decorator('translateDirective', function($delegate) {
        var directive = $delegate[0];
        directive.terminal = true;

        return $delegate;
    });

    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}])

.controller("AppController", ['$rootScope', '$scope', function($rootScope, $scope) {

}])

.run(['$rootScope', '$state', '$location', function ($rootScope, $state) {
  //$rootScope.$on("$stateChangeError", console.log(console));
}]);


