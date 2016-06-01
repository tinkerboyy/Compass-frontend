angular.module('resourceAllocation.service.ResourceAllocationService', [])
    .factory('ResourceAllocationService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {
            // global variables
            var resourceAllocationService = {};
            resourceAllocationService.currentLookupRequestParams = null;
            resourceAllocationService.currentLookupResultObject = null;

            resourceAllocationService.currentRequestParams = null;
            resourceAllocationService.currentResultObject = null;

            // global variables
            var _numberPerPage = 25;

            //  getResourceAllocationList
            resourceAllocationService.lookupCostCenters = function(searchPhrase, pageNumber, startRow, limit, sortModel) {
                var deferred = $q.defer();
                var url = API_PREFIX + "cg/user/staff/util/getcostcenters";

                if (!sortModel || sortModel.length !== 0) {
                    sortModel= [{field:"deptName", sort:"ASC"}];
                }

                var reqObj = buildRequestObject(null, pageNumber, null, startRow, sortModel, limit);
                reqObj.query = searchPhrase;

                $http.get(url, {params: reqObj})
                    .success(function(response) {
                        // setting request params for other controllers needing to understand
                        //  request params - current page, total per page, etc
                        resourceAllocationService.currentLookupRequestParams = reqObj;

                        resourceAllocationService.currentLookupResultObject = response;
                        deferred.resolve(response);
                    })
                    .error(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            };

            resourceAllocationService.getCostCenters = function(weekEndingDate, pageNumber, deptNameDesc, startRow, sortModel, limit) {
                var deferred = $q.defer();

                var url = API_PREFIX + "cg/user/scheduleresource/schedule_week";
                var reqObj = buildRequestObject(weekEndingDate, pageNumber, deptNameDesc, startRow, sortModel, limit);

                $http.get(url, {params: reqObj})
                    .then(function(res) {
                        // setting request params for other controllers needing to understand
                        //  request params - current page, total per page, etc
                        resourceAllocationService.currentRequestParams = reqObj;

                        resourceAllocationService.currentResultObject = res.data;
                        deferred.resolve(res.data);
                    });

                return deferred.promise;
            };

            // helper function to build the GET bundle
            function buildRequestObject(weekEndingDate, pageNumber, deptNameDesc, startRow, sortModel, limit) {
                var resultsPerPage = limit ? limit : _numberPerPage;
                var reqObj = {
                    uId: 3,
                    weekEndingDate: weekEndingDate,
                    payGroupId: 10005,
                    page: pageNumber,
                    start: startRow,
                    limit: resultsPerPage
                };

                // add weekEndingDate if defined
                if (weekEndingDate) {
                    reqObj.weekEndingDate = weekEndingDate;
                }

                // add deptNameDesc if defined
                if (deptNameDesc) {
                    reqObj.deptNameDesc = deptNameDesc;
                }

                // determine sort model
                if (sortModel && sortModel.length > 0) {
                    var sortOptions = [];

                    angular.forEach(sortModel, function (elem, key, array) {
                        sortOptions.push({ property: elem.field, direction: elem.sort});
                    });

                    reqObj.sort = JSON.stringify(sortOptions);
                } else {
                    reqObj.sort = JSON.stringify([{property:"wbtName", direction:"ASC"}]);
                }

                return reqObj;
            }

            return resourceAllocationService;
        }
    ]);

