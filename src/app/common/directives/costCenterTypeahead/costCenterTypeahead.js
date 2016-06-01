angular.module('common.directives.CostCenterTypeahead', [
    'common.directives.GridPagination'
    ])
    .controller('TypeaheadController', ['$scope', '$filter', '$window', '$timeout', 'CostCenterTypeaheadFactory',
        function ($scope, $filter, $window, $timeout, CostCenterTypeaheadFactory) {
            var typeaheadCtrl = this;
            typeaheadCtrl.dropdownList = [];
            typeaheadCtrl.searchPhrase = '';
            typeaheadCtrl.showDropDownList = false;

            typeaheadCtrl.lookupsPending = 0;

            $scope.$window = $window;

            typeaheadCtrl.searchCostCenter = function(searchPhrase) {
                $scope.updateModel(null);
                typeaheadCtrl.dropdownList = [];

                typeaheadCtrl.toggleDropDown(true);

                doSearch(searchPhrase);
            };

            // exposed for pagination
            typeaheadCtrl.getResults = function() {
                return CostCenterTypeaheadFactory.currentLookupResultObject;
            };

            typeaheadCtrl.getRequestParams = function() {
                return CostCenterTypeaheadFactory.currentLookupRequestParams;
            };

            typeaheadCtrl.datasource = {
                source: {
                    pageSize: 5,
                    getRows: function(params) {
                        doSearch(typeaheadCtrl.searchPhrase, params);
                    }
                },
                lastParams: null
            };

            function doSearch(searchPhrase, params) {
                var resultsPerPage = 5;

                params = params ? params : {startRow:0};
                var currentPage = parseInt(params.startRow / resultsPerPage, 10);

                params.endRow = params.startRow + resultsPerPage;

                typeaheadCtrl.lookupsPending++;

                CostCenterTypeaheadFactory
                    .lookupCostCenters(searchPhrase, currentPage + 1, 0, resultsPerPage)
                    .then(function(response) {
                        typeaheadCtrl.lookupsPending--;
                        typeaheadCtrl.datasource.lastParams = params;
                        typeaheadCtrl.dropdownList = response.data;
                    });
            }

            typeaheadCtrl.selected = function(listItem) {
                $scope.updateModel(listItem);

                if (listItem) {
                    typeaheadCtrl.searchPhrase = listItem.deptName;
                }

                typeaheadCtrl.toggleDropDown();
            };

            typeaheadCtrl.toggleDropDown = function(manualSetting) {
                typeaheadCtrl.showDropDownList = manualSetting ? manualSetting : !typeaheadCtrl.showDropDownList;

                if (typeaheadCtrl.showDropDownList) {
                    $scope.$window.onclick = function (event) {
                        closeSearchWhenClickingElsewhere(event, typeaheadCtrl.toggleDropDown);
                    };
                } else {
                    // wrapping in a timeout due to a digest issue
                    $timeout(function() {
                        typeaheadCtrl.showDropDownList = false;
                    });

                    $scope.$window.onclick = null;
                }
            };

            function closeSearchWhenClickingElsewhere(event, callbackOnClose) {
                var clickedElement = event.target;
                if (!clickedElement) {
                    return;
                }

                var clickedOnTypeAheadHTML = checkParentChain(clickedElement);

                if (!clickedOnTypeAheadHTML) {
                    callbackOnClose();
                    return;
                }
            }

            function checkParentChain(element) {
                if (!element.parentElement) {
                    return false;
                }

                if (element.parentElement.classList.contains('costCenterTypeAhead'))
                {
                    return true;
                }
                else
                {
                    return checkParentChain(element.parentElement);
                }
            }
        }]
    )

    .factory('CostCenterTypeaheadFactory', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {
            // global variables
            var costCenterTypeaheadFactory = {};
            costCenterTypeaheadFactory.currentLookupRequestParams = null;
            costCenterTypeaheadFactory.currentLookupResultObject = null;

            // global variables
            var _numberPerPage = 25;

            //  getResourceAllocationList
            costCenterTypeaheadFactory.lookupCostCenters = function(searchPhrase, pageNumber, startRow, limit, sortModel) {
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
                        costCenterTypeaheadFactory.currentLookupRequestParams = reqObj;

                        costCenterTypeaheadFactory.currentLookupResultObject = response;
                        deferred.resolve(response);
                    })
                    .error(function(error) {
                        deferred.reject(error);
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

            return costCenterTypeaheadFactory;
        }
    ])

    .filter('formatCostCenter', function() {
        return function(costCenter) {
            var formattedString = "";

            if (costCenter) {
                formattedString = costCenter.deptName + " - ";
                formattedString += costCenter.deptDesc ? costCenter.deptDesc : costCenter.wbtName + " (" + costCenter.wbtDesc + ")";
            }

            return formattedString;
        };
    })

    .directive('costCenterTypeahead', ['$timeout',
        function($timeout) {
            return {
                restrict: 'EA',
                scope: true,
                require: "ngModel",
                templateUrl: 'directives/costCenterTypeahead/costCenterTypeahead.tpl.html',
                controller: 'TypeaheadController as typeaheadCtrl',
                link: function(scope, elem, attrs, ctrl) {
                    // add a parser that will process each time the value is
                    // parsed into the model when the user updates it.
                    ctrl.$parsers.unshift(function(value) {
                        var valid = false;

                        if (value) {
                            // test and set the validity after update.
                            valid = (value && value.hasOwnProperty("id"));
                            ctrl.$setValidity('invalidCostCenter', valid);
                        }

                        // if it's valid, return the value to the model,
                        // otherwise return undefined.
                        return valid ? value : undefined;
                    });

                    scope.updateModel = function(item)
                    {
                        ctrl.$setViewValue(item);
                    };
                }
            };
        }
    ]);
