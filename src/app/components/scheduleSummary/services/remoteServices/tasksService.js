angular.module("scheduleSummary.services.remoteServices.TasksService", [])
    .service('TasksService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {

            this.getTasks = function(scheduleId) {
                var deferred = $q.defer();
                var url = API_PREFIX + "/cg/user/schedule/template_tasks";

                var reqObj = {
                    schedId: scheduleId,
                    page: 1,
                    start: 0,
                    limit: 25
                };

                $http.get(url, {params: reqObj})
                    .then(function(res) {
                        deferred.resolve(res.data.tasks);
                    });

                return deferred.promise;
            };

        }
    ]);
