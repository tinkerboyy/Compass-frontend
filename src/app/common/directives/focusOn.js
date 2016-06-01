angular.module('directives.focusOn', [])
.directive('focusOn',function($timeout) {
    return {
        restrict : 'A',
        link : function($scope, $element, $attr) {
            $scope.$watch($attr.focusOn, function(focusVal) {
                $timeout(function() {
                    if ($element && $element.length >= 0 && focusVal) {
                        $element[0].focus();
                    }
                });
            });
        }
    };
});
