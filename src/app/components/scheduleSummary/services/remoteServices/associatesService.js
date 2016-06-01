/*globals userId, payGroupId */
angular.module("scheduleSummary.services.remoteServices.AssociatesService", [])
    .factory('AssociatesService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {
            var associatesFactory = {};

            associatesFactory.getAssociates = function(teamId, altTeamId, weekEndingDate) {
                var paramsObj = buildRequestObject(teamId, altTeamId, weekEndingDate);
                var deferred = $q.defer();
                var url = API_PREFIX + 'cg/user/schedule/associates';

                $http.get(url, {params: paramsObj})
                    .success(function(response) {
                        deferred.resolve(response.associates);
                    }).error(function(err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            };

            function buildRequestObject(teamId, altTeamId, weekEndingDate) {
                var reqObj = {
                    userId: userId,
                    teamId: teamId,
                    weekEndDate: weekEndingDate,
                    payGroupId: payGroupId,
                    sort:'[{property: "jobDesc", direction: "ASC"}]',
                    page: 1,
                    start: 0,
                    limit: 25,
                    subteams: 'y'
                };

                if (altTeamId) {
                    reqObj.altteamId = altTeamId;
                }

                return reqObj;
            }

            return associatesFactory;
        }
    ]);
