'use strict';

angular.module("scheduleSummary.service.TaskAssignmentService", [])
    .factory('TaskAssignmentService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {

           var getAssignedJobs = function(jobId, empId, startDate, pageNumber, startRow, limit) {
                var deferred = $q.defer();
                var url = API_PREFIX + "/cg/user/employee_jobs";

                var reqParam = {
                    query: jobId,
                    schedDate: '07/20/2015',
                    empId: empId,
                    page: (typeof pageNumber === 'undefined') ? 1 : pageNumber,
                    start: (typeof startRow === 'undefined') ? 0 : startRow,
                    limit: (typeof limit === 'undefined') ? 25 : limit,
                    sort: JSON.stringify([{"property":"jobName","direction":"DESC"}])
                };

                $http.get(url, {params: reqParam})
                    .then(function(res) {
                        deferred.resolve(res.data);
                    });

                return deferred.promise;
            };

            return {
                getAssignedJobs: getAssignedJobs
            };

        }
    ]);
