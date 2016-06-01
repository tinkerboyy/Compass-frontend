'use strict';

angular.module("scheduleSummary.directive.ShowAssignmentInstance",[
    "scheduleSummary.service.TaskAssignmentService"
])
    .controller('ShowAssignmentInstance', ['$scope', 'selectedAssignment', '$modalInstance', '$filter', 'TaskAssignmentService',
        function($scope, selectedAssignment, $modalInstance, $filter, TaskAssignmentService) {
        var taskAssignmentCtrl = this;
            taskAssignmentCtrl.jobs = [];

        taskAssignmentCtrl.assignment = selectedAssignment;
        taskAssignmentCtrl.editAssignment = angular.copy(taskAssignmentCtrl.assignment);
        taskAssignmentCtrl.assignment.costCenterName = taskAssignmentCtrl.assignment.wbtName;

            TaskAssignmentService.getAssignedJobs(selectedAssignment.jobId, selectedAssignment.empId, selectedAssignment.StartDate)
                .then(function(res) {
                    taskAssignmentCtrl.jobs = res.data;
                });


        taskAssignmentCtrl.assignment.startTime = $filter('date')(taskAssignmentCtrl.assignment.startTime, 'hh:mm a');
        taskAssignmentCtrl.assignment.endTime = $filter('date')(taskAssignmentCtrl.assignment.endTime, 'hh:mm a');
        taskAssignmentCtrl.assignment.brkStartTime = $filter('date')(taskAssignmentCtrl.assignment.brkStartTime, 'hh:mm a');
        taskAssignmentCtrl.assignment.brkEndTime = $filter('date')(taskAssignmentCtrl.assignment.brkEndTime, 'hh:mm a');

        //taskAssignmentCtrl.job = taskAssignmentCtrl.jobsList[0].jobDesc;


        taskAssignmentCtrl.cancel = function() {
            $modalInstance.dismiss(false);
        };

        taskAssignmentCtrl.keepChanges = function() {
         //   selectedAssignment = angular.copy(taskAssignmentCtrl.editAssignment);
            taskAssignmentCtrl.assignment = angular.copy(taskAssignmentCtrl.editAssignment);
            $modalInstance.close();
        };

    }]);

