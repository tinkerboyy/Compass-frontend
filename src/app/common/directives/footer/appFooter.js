angular.module('directives.appFooter', [])

.controller('AppFooterCtrl', function() {
    var appFooter = this;
})

.directive('appFooter', function() {
    return {
        restrict: "A",
        controller: "AppFooterCtrl as appFooter",
        templateUrl: "directives/footer/appFooter.tpl.html"
    };

});
