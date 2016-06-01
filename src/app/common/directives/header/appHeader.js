angular.module('directives.appHeader', [])

.controller('AppHeaderCtrl', function() {
    var appHeader = this;
})

.directive('appHeader', function() {
    return {
        restrict: "A",
        controller: "AppHeaderCtrl as appHeader",
        templateUrl: "directives/header/appHeader.tpl.html"
    };

});
