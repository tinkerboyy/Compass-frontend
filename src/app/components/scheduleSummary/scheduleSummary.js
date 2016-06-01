angular.module('scheduleSummary',[
    'scheduleSummary.directive.TaskBasedScheduler',
    'scheduleSummary.directive.OldScheduler'
    ])

    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('scheduleSummary',{
                    url:"/scheduleSummary/",
                    templateUrl:"scheduleSummary/schedule-summary.tpl.html",
                    controller: "ScheduleSummaryController as scheduleSummary",
                    params: {
                        costCenter: null,
                        weekEndingDate: null
                    }
                })
                .state('scheduleSummary.taskBased',{
                    url:"taskBased/",
                    templateUrl:"scheduleSummary/tab1.tpl.html"
                })
                .state('scheduleSummary.oldScheduler',{
                    url:"oldScheduler/",
                    templateUrl:"scheduleSummary/tab2.tpl.html"
                });
    }])

    .controller('ScheduleSummaryController',
        ['$scope', '$stateParams', '$state',
        function($scope, $stateParams, $state) {
            var orderStatus = this;

            // BEGIN TAB MANAGEMENT and ROUTING
            orderStatus.tabState = true;
            function changeState(toState, event, params){
                if (toState.name === "scheduleSummary") {
                    if (event) {
                        event.preventDefault();
                    }
                    $state.go('scheduleSummary.taskBased', params);
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
    }])
;
