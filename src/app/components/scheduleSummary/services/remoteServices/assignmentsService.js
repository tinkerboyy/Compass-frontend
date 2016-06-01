angular.module("scheduleSummary.services.remoteServices.AssignmentsService", [])
    .service('AssignmentsService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {

            this.getAssignments = function(scheduleId, teamId, weekEndDate) {
                var deferred = $q.defer();
                var url = API_PREFIX + "/cg/user/schedule/task_assignments";

                var reqObj = {
                    schedId: scheduleId,
                    teamId: teamId,
                    weekEndDate: weekEndDate,
                    payGroupId: 10005,
                    page: 1,
                    start: 0,
                    limit: 25,
                    sort: JSON.stringify([{"property":"empName","direction":"desc"},{"property":"startTime","direction":"asc"}])
                };

                $http.get(url, {params: reqObj})
                    .then(function(res) {
                        deferred.resolve(res.data.assignments);
                    });

                return deferred.promise;
            };

        }
    ]);
