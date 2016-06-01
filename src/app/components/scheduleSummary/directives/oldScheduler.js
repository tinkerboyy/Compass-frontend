angular.module("scheduleSummary.directive.OldScheduler",[])
    .controller("OldSchedulerController", ['$stateParams', 'ScheduleSummaryServices',
        function($stateParams, ScheduleSummaryServices){
            var oldScheduler = this;
            oldScheduler.title = "Old Scheduler";
        }]
)
    .directive("oldScheduler", function() {
        return {
            restrict: "A",
            controller: "OldSchedulerController as oldScheduler",
            templateUrl: "scheduleSummary/directives/oldScheduler.tpl.html"
        };
    });
