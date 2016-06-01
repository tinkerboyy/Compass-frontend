angular.module("scheduleSummary.directive.AssignmentCalendarCell",[
    "scheduleSummary.directive.ShowAssignmentInstance",
    "scheduleSummary.service.TaskAssignmentService"
])
    .controller("AssignmentCalendarCell", ['$scope', '$modal', 'TaskAssignmentService', '$log',
        function($scope, $modal, TaskAssignmentService, $log){
            var assignmentCalendarCell = this;

            assignmentCalendarCell.templateUrl = 'popup.html';

            assignmentCalendarCell.showModal = function(assignment) {
                assignmentCalendarCell.assignment = assignment;

                var modalInstance = $modal.open({
                    templateUrl: 'scheduleSummary/directives/showAssignment.tpl.html',
                    controller: 'ShowAssignmentInstance',
                    controllerAs: 'taskAssignmentCtrl',
                    resolve: {
                        selectedAssignment: function() {
                            return assignmentCalendarCell.assignment;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $log.info('selected object: ' + selectedItem);
                }, function(result) {
                    $log.info('Modal dismissed at: ' + new Date());
                    $log.info('result: ' + result);
                    $scope.didSelect = false;
                });
            };

            assignmentCalendarCell.dropOptions = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    // don't allow drop on self
                    var canDrop = sourceItemHandleScope.itemScope.sortableScope.$id !== destSortableScope.$id;

                    // prevent drop on "unassigned" sections
                    if ($scope.task.wbTeamId === null) {
                        canDrop = false;
                    }

                    return canDrop;
                },
                itemMoved: function (event) {
                    var droppedItemData = event.source.itemScope.modelValue;
                    var isAssignment = droppedItemData.hasOwnProperty("jobId");

                    if (!isAssignment) { //is associate
                        // create new assignment from data
                        var newAssignment = {
                            Name: droppedItemData.Name,
                            taskName: $scope.task.Name
                        };

                        angular.forEach($scope.assignments, function(value, key) {
                            // replace dropped associate with an assignment object
                            if (value === droppedItemData) {
                                $scope.assignments[key] = newAssignment;
                            }
                        });

                    } else { //is assignment

                    }

                },
                alwaysInsertLast: true,
                suppressPlaceholder: true
            };
        }])

    .directive("assignmentCalendarCell", function() {
        return {
            restrict: "EA",
            scope: {
                dayNumber: "@",
                task: "=",
                assignments: "="
            },
            controller: "AssignmentCalendarCell as assignmentCalendarCell",
            templateUrl: "scheduleSummary/directives/assignmentCalendarCell.tpl.html"
        };
    });
