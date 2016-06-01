angular.module("scheduleSummary.services.ScheduleService", [
    "scheduleSummary.services.remoteServices.AssignmentsService",
    "scheduleSummary.services.remoteServices.AssociatesService",
    "scheduleSummary.services.remoteServices.TasksService"
])
    .factory('ScheduleServices', ['$http', '$q', 'API_PREFIX', 'AssignmentsService', 'AssociatesService', 'TasksService',
        function($http, $q, API_PREFIX, AssignmentsService, AssociatesService, TasksService) {
            var scheduleServices = this;

            var _pendingLookups = {};

            /*
             * ASSOCIATES
             */
            var _cachedAssociateResults = {};
            scheduleServices.primaryTeamAssociates = [];

            scheduleServices.getAssociates = function getAssociates(teamId, altTeamId, weekEndingDate) {
                var dataKey = getDataKey(arguments);

                if (!_cachedAssociateResults[dataKey] && !_pendingLookups[dataKey]) {
                    _pendingLookups[dataKey] = true;
                    _cachedAssociateResults[dataKey] = [];

                    AssociatesService.getAssociates(teamId, altTeamId, weekEndingDate)
                        .then(function(data) {
                            _cachedAssociateResults[dataKey].length = 0;

                            if (!altTeamId) {
                                scheduleServices.primaryTeamAssociates.length = 0;
                            }

                            for (var x=0; x < data.length; x++) {
                                _cachedAssociateResults[dataKey].push(data[x]);

                                if (!altTeamId) {
                                    scheduleServices.primaryTeamAssociates.push(data[x]);
                                }
                            }

                            delete _pendingLookups[dataKey];
                        }, function(status) {
                            delete _pendingLookups[dataKey];
                        });
                }

                return _cachedAssociateResults[dataKey];
            };


            /*
             * TASKS
             */
            var _cachedTasksResults = {};

            scheduleServices.getTasks = function getTasks(scheduleId) {
                var dataKey = getDataKey(arguments);

                if (!_cachedAssociateResults[dataKey] && !_pendingLookups[dataKey]) {
                    _pendingLookups[dataKey] = true;
                    _cachedTasksResults[dataKey] = [];

                    TasksService.getTasks(scheduleId)
                        .then(function(data) {
                            _cachedTasksResults[dataKey].length = 0;

                            for (var x=0; x < data.length; x++) {
                                _cachedTasksResults[dataKey].push(data[x]);
                            }

                            delete _pendingLookups[dataKey];
                        }, function(status) {
                            delete _pendingLookups[dataKey];
                        });
                }

                return _cachedTasksResults[dataKey];
            };


            /*
             * ASSIGNMENTS
             */
            var _cachedAssignments = {};

            scheduleServices.getAssignments = function getAssignments(scheduleId, deptId, weekEndingDate) {
                var dataKey = getDataKey(arguments);

                if (!_cachedAssignments[dataKey] && !_pendingLookups[dataKey]) {
                    _pendingLookups[dataKey] = true;
                    _cachedAssignments[dataKey] = [];

                    AssignmentsService.getAssignments(scheduleId, deptId, weekEndingDate)
                        .then(function(data) {
                            _cachedAssignments[dataKey].length = 0;

                            for (var x=0; x < data.length; x++) {
                                _cachedAssignments[dataKey].push(data[x]);
                            }

                            delete _pendingLookups[dataKey];
                        }, function(status) {
                            delete _pendingLookups[dataKey];
                        });
                }

                return _cachedAssignments[dataKey];
            };



            // helper to create a key for data storage
            function getDataKey(args) {
                return JSON.stringify({method:args.callee.toString().match(/function ([^\(]+)/)[1], args:args});
            }

            return scheduleServices;
        }
    ]);
