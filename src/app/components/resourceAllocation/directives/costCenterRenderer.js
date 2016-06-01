angular.module('resourceAllocation.directive.CostCenterRenderer',[])
    .controller('CostCenterRendererController', ['$scope', '$log', '$state',
        function($scope, $log, $state) {
            var costCenterRenderer = this;
            costCenterRenderer.displayText = $scope.showSiteName ? $scope.data.wbtName : $scope.data.deptName;

            costCenterRenderer.showLink = function(data) {
                if ($scope.showSiteName && data.wbtName && data.wbtName.length > 0) {
                    return true;
                }

                if (!$scope.showSiteName && data.deptDesc && data.deptDesc.length > 0) {
                    return true;
                }

                return false;
            };

            costCenterRenderer.onClick = function(data, weekEndingDate) {
                var params = {
                    costCenter: data,
                    weekEndingDate: weekEndingDate
                };

                $state.go("scheduleSummary", params);
            };
        }]
    )

    .directive('costCenterRenderer', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    data: '=costCenterRenderer',
                    showSiteName: '=',
                    weekEndingDate: '=weekEndingDate'
                },
                controller: 'CostCenterRendererController as costCenterRenderer',
                templateUrl: 'resourceAllocation/directives/costCenterRenderer.tpl.html'
            };
        }
    ]);
