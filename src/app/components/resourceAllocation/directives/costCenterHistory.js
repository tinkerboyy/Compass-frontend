angular.module("resourceAllocation.directive.CostCenterHistory",[])
    .controller("CostCenterHistoryController", ['$stateParams',
        function($stateParams){
            var costCenterHistory = this;
            costCenterHistory.title = "Cost Center History";
        }]
    )

    .directive("costCenterHistory", function() {
        return {
            restrict: "A",
            controller: "CostCenterHistoryController as costCenterHistory",
            templateUrl: "resourceAllocation/directives/costCenterHistory.tpl.html"
        };
    });
