angular.module('resourceAllocation',[
    'resourceAllocation.service.ResourceAllocationService',
    'resourceAllocation.directive.WeeklySearch',
    'resourceAllocation.directive.CostCenterHistory'
    ])

    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('resourceAllocation',{
                    url:"/",
                    templateUrl:"resourceAllocation/resource-allocation.tpl.html",
                    controller: "ResourceAllocationController as resourceAllocation"
                })
                .state('resourceAllocation.weeklySearch',{
                    url:"weeklySearch/",
                    templateUrl:"resourceAllocation/tab1.tpl.html"
                })
                .state('resourceAllocation.costCenterHistory',{
                    url:"costCenterHistory/",
                    templateUrl:"resourceAllocation/tab2.tpl.html"
                });
    }])

    .controller('ResourceAllocationController',
        ['$scope', '$stateParams', '$state',
        function($scope, $stateParams, $state) {
            var orderStatus = this;

            // BEGIN TAB MANAGEMENT and ROUTING
            orderStatus.tabState = true;
            function changeState(toState, event, params){
                if (toState.name === "resourceAllocation") {
                    if (event) {
                        event.preventDefault();
                    }
                    $state.go('resourceAllocation.weeklySearch', params);
                }
            }
            var stateChange = $scope.$on("$stateChangeStart",
                function(event, toState, toParams, fromState, fromParams){
                    changeState(toState,event,toParams);
                }
            );
            $scope.$on("$destroy",
                function(){
                    stateChange();
                }
            );
            changeState($state.$current,null,$stateParams);
            // END TAB MANAGEMENT and ROUTING
    }]);
