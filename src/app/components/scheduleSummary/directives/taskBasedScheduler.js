angular.module("scheduleSummary.directive.TaskBasedScheduler",[
    'scheduleSummary.directive.AssociateList',
    'scheduleSummary.directive.TaskListCalendar'
])
    .controller("TaskBasedSchedulerController", ['$stateParams', '$http',
        function($stateParams, $http){
            var taskBasedScheduler = this;
            taskBasedScheduler.weekEndingDate = $stateParams.weekEndingDate;
            taskBasedScheduler.costCenter = $stateParams.costCenter;

        }])

    .directive("taskBasedScheduler", function() {
        return {
            restrict: "A",
            controller: "TaskBasedSchedulerController as taskBasedScheduler",
            templateUrl: "scheduleSummary/directives/taskBasedScheduler.tpl.html"
        };
    });
