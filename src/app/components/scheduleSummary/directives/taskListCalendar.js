angular.module("scheduleSummary.directive.TaskListCalendar",[
    'scheduleSummary.services.ScheduleService',
    "scheduleSummary.services.remoteServices.AssignmentsService",
    'common.filters.GetTimeFilter',
    'scheduleSummary.directive.AssignmentCalendarCell'
])
    .controller("TaskListCalendarController", ['$scope', '$filter', '$stateParams', '$state', '$q', 'ScheduleServices', 'AssignmentsService',
        function($scope, $filter, $stateParams, $state, $q, ScheduleServices, AssignmentsService){
            var taskListCalendar = this;
            taskListCalendar.tasks = [];
            taskListCalendar.assignments = [];

            var costCenter = $scope.costCenter;
            var weekEndingDate = $scope.weekEndingDate;

            taskListCalendar.daysOfWeek = [];
            taskListCalendar.dayOfWeekHeaderFormat = "EEE d MMM";

            taskListCalendar.tasksByDayAndTask = {};

            function initialize() {
                if (!costCenter) {
                    $state.go("resourceAllocation.weeklySearch");
                    return;
                }

                if (typeof costCenter !== "undefined" && typeof weekEndingDate !== "undefined") {
                    var weekEndDate = new Date(weekEndingDate);
                    var tempDate = new Date(weekEndDate);
                    tempDate.setDate(tempDate.getDate() - 6);

                    taskListCalendar.daysOfWeek[0] = new Date(tempDate);
                    taskListCalendar.daysOfWeek[1] = new Date(tempDate.setDate(tempDate.getDate() + 1));
                    taskListCalendar.daysOfWeek[2] = new Date(tempDate.setDate(tempDate.getDate() + 1));
                    taskListCalendar.daysOfWeek[3] = new Date(tempDate.setDate(tempDate.getDate() + 1));
                    taskListCalendar.daysOfWeek[4] = new Date(tempDate.setDate(tempDate.getDate() + 1));
                    taskListCalendar.daysOfWeek[5] = new Date(tempDate.setDate(tempDate.getDate() + 1));
                    taskListCalendar.daysOfWeek[6] = new Date(weekEndDate);
                }

                taskListCalendar.tasks = ScheduleServices.getTasks(costCenter.schedId);
                taskListCalendar.assignments = ScheduleServices.getAssignments(costCenter.schedId, costCenter.deptId, weekEndingDate);
            }

            $scope.$watchCollection("taskListCalendar.tasks", function() {
                buildGridData();
            });

            $scope.$watchCollection("taskListCalendar.assignments", function() {
                buildGridData();
            });

            function buildGridData() {
                taskListCalendar.tasksByDayAndTask = {};

                _.each(taskListCalendar.tasks, function(task) {
                    taskListCalendar.tasksByDayAndTask[task.projId] = {task:task, assignments:[[],[],[],[],[],[],[]]};

                    _.each(taskListCalendar.assignments, function(assignment) {
                        if (Number(task.projId) === Number(assignment.projId)) {
                            for (var x=0; x < taskListCalendar.daysOfWeek.length; x++) {
                                if (taskListCalendar.daysOfWeek[x].getTime() === (new Date(assignment.StartDate)).getTime()) {
                                    taskListCalendar.tasksByDayAndTask[task.projId].assignments[x].push(assignment);
                                }
                            }
                        }
                    });
                });
            }

            taskListCalendar.getAssignmentsForDay = function(task, dayNumber) {
                if (task && taskListCalendar.tasksByDayAndTask && taskListCalendar.tasksByDayAndTask[task.projId]) {
                    return taskListCalendar.tasksByDayAndTask[task.projId].assignments[dayNumber];
                } else {
                    return null;
                }
            };

            initialize();
    }])

    .filter('taskTotalHours', [function() {
        return function(task) {
            var totalTime = 0;

            // total task hours
            if (task.taskEndTime > task.taskStartTime) {
                totalTime = task.taskEndTime - task.taskStartTime;
            } else {
                totalTime = (1000 * 60 * 60 * 24) - task.taskStartTime;
                totalTime += task.taskEndTime;
            }

            // remove any breaks
            if (task.breakStartTime !== task.breakEndTime) {
                if (task.breakEndTime > task.breakStartTime) {
                    totalTime -= (task.breakEndTime - task.breakStartTime);
                } else {
                    var totalBreakTime = (1000 * 60 * 60 * 24) - task.breakStartTime;
                    totalBreakTime += task.breakEndTime;
                    totalTime -= totalBreakTime;
                }
            }

            totalTime = totalTime / 1000 / 60 / 60;

            return totalTime;
        };
    }])

    .directive("taskListCalendar", function() {
        return {
            restrict: "A",
            scope: {
                costCenter: '=costCenter',
                weekEndingDate: '=weekEndingDate'
            },
            controller: "TaskListCalendarController as taskListCalendar",
            templateUrl: "scheduleSummary/directives/taskListCalendar.tpl.html"
        };
    });
