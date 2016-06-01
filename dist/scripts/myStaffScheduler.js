/*! myStaffScheduler - version:0.1.0 - 2015-07-29 * Copyright (c) 2015 Compass Group;*/
angular.module('myStaffScheduler', [
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'ng.shims.placeholder',
    'angularGrid',
    'as.sortable',
    'myStaffScheduler.serviceConstants',
    'templates.app',
    'templates.common',
    'common.directives',
    'common.services',
    'resourceAllocation',
    'scheduleSummary'
])


.factory("httpInterceptor", ["$q", "compassToastr", function($q, compassToastr) {
    var httpInterceptor = {
        'request': function(config) {
           return config;
        },
        'responseError': function(rejection) {
            var displayText = "";
            if (rejection.status === 404) {
                displayText = "Unable to find url: " + rejection.config.url;
            } else if (rejection.status === 500) {
                displayText = "Internal Server Error";
            } else if (rejection.status === 403) {
                displayText = "Authorization Failed";
            } else if (rejection.status === 400) {
                displayText = "Incorrect values/field validation error";
            }
            compassToastr.warning(displayText + "<br>Please contact support.");
            console.log(rejection);
            return $q.reject(rejection);
        }
    };
    return httpInterceptor;
}])


.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$provide', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $translateProvider, $provide, $httpProvider) {
    $urlRouterProvider.otherwise("/");

    $translateProvider.translations("en", en_US);
    $translateProvider.fallbackLanguage("en");
    $translateProvider.preferredLanguage("en");

    $provide.decorator('translateDirective', function($delegate) {
        var directive = $delegate[0];
        directive.terminal = true;

        return $delegate;
    });

    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}])

.controller("AppController", ['$rootScope', '$scope', function($rootScope, $scope) {

}])

.run(['$rootScope', '$state', '$location', function ($rootScope, $state) {
  //$rootScope.$on("$stateChangeError", console.log(console));
}]);



angular.module("myStaffScheduler.serviceConstants", [])
    .constant("API_PREFIX", "http://localhost:1337/staffsnd.compass-usa.com/");

angular.module('ui.bootstrap.datepicker')
    .config(function($provide) {
        $provide.decorator('datepickerDirective', ['$delegate', function($delegate) {
            var directive = $delegate[0];
            var link = directive.link;

            directive.compile = function() {
                return function(scope, element, attrs, ctrls) {
                    link.apply(this, arguments);

                    var datepickerCtrl = ctrls[0];
                    var ngModelCtrl = ctrls[1];

                    if (ngModelCtrl) {
                        // Listen for 'refreshDatepickers' event...
                        scope.$on('refreshDatepickers', function refreshView() {
                            datepickerCtrl.refreshView();
                        });
                    }
                };
            };

            return $delegate;
        }]);
    });

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

angular.module('common.directives', [
    'directives.focusOn',
    'directives.header',
    'directives.footer',
    'directives.ShowErrors',
    'directives.footer',
    'common.directives.CostCenterTypeahead',
    'common.directives.GridPagination'
]);

angular.module('directives.focusOn', [])
.directive('focusOn',function($timeout) {
    return {
        restrict : 'A',
        link : function($scope, $element, $attr) {
            $scope.$watch($attr.focusOn, function(focusVal) {
                $timeout(function() {
                    if ($element && $element.length >= 0 && focusVal) {
                        $element[0].focus();
                    }
                });
            });
        }
    };
});

angular.module('directives.appFooter', [])

.controller('AppFooterCtrl', function() {
    var appFooter = this;
})

.directive('appFooter', function() {
    return {
        restrict: "A",
        controller: "AppFooterCtrl as appFooter",
        templateUrl: "directives/footer/appFooter.tpl.html"
    };

});

angular.module("directives.footer", ['directives.appFooter']);

angular.module('common.directives.GridPagination',[
])
    .controller("PaginationController", ['$scope', function($scope) {
        var paginationController = this;

        paginationController.totalResults = 0;
        paginationController.previousEnabled = true;
        paginationController.nextEnabled = true;
        paginationController.startRow = 0;
        paginationController.endRow = 0;
        paginationController.currentPage = 0;
        paginationController.pageCount = 0;

        paginationController.goFirst = function() {
            var oldParams = angular.copy($scope.datasource.lastParams);
            var params = {
                startRow: 0,
                sortModel: oldParams.sortModel
            };
            $scope.datasource.source.getRows(params);
        };

        paginationController.goPrevious = function() {
            var oldParams = angular.copy($scope.datasource.lastParams);
            var startRow = oldParams.startRow - $scope.datasource.source.pageSize;
            var params = {
                startRow: startRow,
                sortModel: oldParams.sortModel
            };
            $scope.datasource.source.getRows(params);
        };

        paginationController.goNext = function() {
            var oldParams = angular.copy($scope.datasource.lastParams);
            var params = {
                startRow: oldParams.endRow,
                sortModel: oldParams.sortModel
            };
            $scope.datasource.source.getRows(params);
        };

        paginationController.goLast = function() {
            var oldParams = angular.copy($scope.datasource.lastParams);
            var totalRows = paginationController.totalResults;
            var pageSize = $scope.datasource.source.pageSize;

            var startRow = (totalRows % pageSize > 0) ? Math.floor(totalRows/pageSize) * pageSize : totalRows - pageSize;
            var params = {
                startRow: startRow,
                sortModel: oldParams.sortModel
            };

            $scope.datasource.source.getRows(params);
        };

        $scope.$watch(function() {
            return $scope.results;
        }, function(data) {
            var results = data;

            if (!data) {
                paginationController.resultCount = 0;
                paginationController.previousEnabled = false;
                paginationController.nextEnabled = false;
                return;
            }
            var reqObj = $scope.requestParams;

            paginationController.totalResults = data.total;
            paginationController.startRow = (reqObj.page * reqObj.limit) - reqObj.limit + 1;
            paginationController.endRow = Math.min(paginationController.startRow + reqObj.limit - 1, data.total);
            paginationController.currentPage = reqObj.page;
            paginationController.pageCount = Math.ceil(data.total/reqObj.limit);

            paginationController.previousEnabled = reqObj.page > 1;
            paginationController.nextEnabled = (reqObj.page < paginationController.pageCount);
        }, true);
    }])

    .directive('gridPagination', [function() {
        return {
            restrict: "A",
            scope: {
                datasource: "=gridPagination",
                results: "=",
                requestParams: "="
            },
            templateUrl: "directives/gridPagination/gridPagination.tpl.html",
            controller: 'PaginationController as paginationController'
        };
    }]);

angular.module('directives.appHeader', [])

.controller('AppHeaderCtrl', function() {
    var appHeader = this;
})

.directive('appHeader', function() {
    return {
        restrict: "A",
        controller: "AppHeaderCtrl as appHeader",
        templateUrl: "directives/header/appHeader.tpl.html"
    };

});

angular.module("directives.header", ['directives.appHeader']);

'use-strict';

angular.module('directives.ShowErrors', [])
    .directive('showErrors', function ($timeout, showErrorsConfig) {
        var getShowSuccess, linkFn;
        getShowSuccess = function (options) {
            var showSuccess;
            showSuccess = showErrorsConfig.showSuccess;
            if (options && options.showSuccess !== null) {
                showSuccess = options.showSuccess;
            }
            return showSuccess;
        };
        linkFn = function (scope, el, attrs, formCtrl) {
            var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
            blurred = false;
            options = scope.$eval(attrs.showErrors);
            showSuccess = getShowSuccess(options);
            inputEl = el[0].querySelector('[name]');
            inputNgEl = angular.element(inputEl);
            inputName = inputNgEl.attr('name');
            if (!inputName) {
                throw 'show-errors element has no child input elements with a \'name\' attribute';
            }
            inputNgEl.bind('blur', function () {
                blurred = true;
                return toggleClasses(formCtrl[inputName].$invalid);
            });
            scope.$watch(function () {
                return formCtrl[inputName] && formCtrl[inputName].$invalid;
            }, function (invalid) {
                if (formCtrl[inputName].$pristine) {
                    return;
                }
                if (!angular.isDefined(invalid)) {
                    return;
                }
                return toggleClasses(invalid);
            });
            scope.$on('show-errors-check-validity', function () {
                return toggleClasses(formCtrl[inputName].$invalid);
            });
            scope.$on('show-errors-reset', function () {
                return $timeout(function () {
                    el.removeClass('has-error');
                    el.removeClass('has-success');
                    blurred = false;
                    return blurred;
                }, 0, false);
            });

            toggleClasses = function (invalid) {
                el.toggleClass('has-error', invalid);
                if (showSuccess) {
                    return el.toggleClass('has-success', !invalid);
                }
            };
        };
        return {
            restrict: 'A',
            require: '^form',
            compile: function (elem, attrs) {
                if (!elem.hasClass('form-group')) {
                    throw 'show-errors element does not have the \'form-group\' class';
                }
                return linkFn;
            }
        };
    }
)
    .provider('showErrorsConfig', function () {
        var _showSuccess;
        _showSuccess = false;
        this.showSuccess = function (showSuccess) {
            _showSuccess = showSuccess;
            return _showSuccess;
        };
        this.$get = function () {
            return { showSuccess: _showSuccess };
        };
    });


angular.module("common.filters.GetTimeFilter",[])
.filter('getTime', ["$filter", function($filter) {
    return function(timeString) {
        var formattedString = "";

        if (timeString) {
            formattedString = $filter("date")(new Date(timeString), "shortTime", "UTC");
        }

        return formattedString;
    };
}]);

angular.module("common.services.compassToastr", ['ngToast'])
    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide'
        });
    }])

    .service('compassToastr', ['ngToast', function (ngToast) {
        this.warning = function(message) {
            ngToast.create({
                className: 'danger',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 10000,
                animation: 'slide'
            });
        };

        this.success = function(message) {
            ngToast.create({
                className: 'success',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 3000,
                animation: 'slide'
            });
        };
    }]);

angular.module('common.services', [
    'common.services.compassToastr'
]);

angular.module("resourceAllocation.directive.CostCenterHistory",[])
    .controller("CostCenterHistoryController", ['$stateParams',
        function($stateParams){
            var costCenterHistory = this;
            costCenterHistory.title = "Cost Center History";
        }]
    )

    .directive("costCenterHistory", function() {
        return {
            restrict: "A",
            controller: "CostCenterHistoryController as costCenterHistory",
            templateUrl: "resourceAllocation/directives/costCenterHistory.tpl.html"
        };
    });

angular.module('resourceAllocation.directive.CostCenterRenderer',[])
    .controller('CostCenterRendererController', ['$scope', '$log', '$state',
        function($scope, $log, $state) {
            var costCenterRenderer = this;
            costCenterRenderer.displayText = $scope.showSiteName ? $scope.data.wbtName : $scope.data.deptName;

            costCenterRenderer.showLink = function(data) {
                if ($scope.showSiteName && data.wbtName && data.wbtName.length > 0) {
                    return true;
                }

                if (!$scope.showSiteName && data.deptDesc && data.deptDesc.length > 0) {
                    return true;
                }

                return false;
            };

            costCenterRenderer.onClick = function(data, weekEndingDate) {
                var params = {
                    costCenter: data,
                    weekEndingDate: weekEndingDate
                };

                $state.go("scheduleSummary", params);
            };
        }]
    )

    .directive('costCenterRenderer', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    data: '=costCenterRenderer',
                    showSiteName: '=',
                    weekEndingDate: '=weekEndingDate'
                },
                controller: 'CostCenterRendererController as costCenterRenderer',
                templateUrl: 'resourceAllocation/directives/costCenterRenderer.tpl.html'
            };
        }
    ]);

angular.module('resourceAllocation.directive.WeeklySearch',[
    'resourceAllocation.service.ResourceAllocationService',
    'resourceAllocation.directive.CostCenterRenderer',
    'common.directives.CostCenterTypeahead',
    'common.directives.GridPagination'
    ])
    .controller("WeeklySearchController", ['$scope', '$filter', '$interval', 'ResourceAllocationService',
        function($scope, $filter, $interval, ResourceAllocationService){
            var weeklySearch = this;
            weeklySearch.searchPhrase = "";
            weeklySearch.selectedCostCenter = null;
            weeklySearch.payGroups = [];
            weeklySearch.selectedPayGroup = null;
            weeklySearch.weekEndingDate = null;
            weeklySearch.weekEndingDateOpened = false;
            weeklySearch.weekEndingDateFormat = "MM/dd/yyyy";
            weeklySearch.weekEndingDateDateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            // Table Header Details
            var columnDefs = [
                {headerName: "Cost Center", field: "deptName", width: 150, suppressMenu: true, cellRenderer: renderCustomCostCenter},
                {headerName: "Cost Center Description", field: "deptDesc", width: 150, suppressMenu: true},
                {headerName: "Site Name", field:"wbtName", width: 150, suppressMenu: true, cellRenderer: renderCustomSiteName},
                {headerName: "Site Desc", field:"wbtDesc", width: 150, suppressMenu: true},
                {headerName: "Scheduled Hours", field: "schedHours", width: 150, suppressMenu: true},
                {headerName: "Scheduled Amount", field: "schedAmount", width: 150, suppressMenu: true, valueGetter: amountValueGetter},
                {headerName: "Actual Hours", field: "actualHours", width: 150, suppressMenu: true},
                {headerName: "Actual Amount", field: "actualAmount", width: 150, suppressMenu: true, valueGetter: amountValueGetter},
                {headerName: "Forecast Hours", field: "forcastHours", width: 150, suppressMenu: true},
                {headerName: "Forecast Amount", field: "forcastAmount", width: 150, suppressMenu: true, valueGetter: amountValueGetter}
            ];

            // exposed for pagination
            weeklySearch.getResults = function() {
                return ResourceAllocationService.currentResultObject;
            };

            // exposed for pagination
            weeklySearch.getRequestParams = function() {
                return ResourceAllocationService.currentRequestParams;
            };

            // exposed for pagination
            weeklySearch.datasource = {
                source: null,
                lastParams: null
            };

            // Table Grid default options
            weeklySearch.gridOptions = {
                enableServerSideSorting: true,
                enableServerSideFilter: true,
                columnDefs: columnDefs,
                rowData: null,
                enableColResize: true,
                angularCompileRows: true,
                suppressVerticalScroll: true,
                ready: function() {
                    gridReady = true;
                }
            };

            // variable to check once the grid is loaded
            var gridReady = false;

            // wait until the grid is ready, and we have a date set in weekEndingDate
            var checkEndDate = $interval(function() {
                if (gridReady && weeklySearch.weekEndingDate) {
                    weeklySearch.datasource.source = createNewDataSource();
                    $interval.cancel(checkEndDate);
                }
            }, 100);


            // Add hyperlink for cost center deptName
            function renderCustomCostCenter(params) {
                return '<div cost-center-renderer="data" week-ending-date="weeklySearch.getFormattedDate()"></div>';
            }

            // Add hyperlink for cost center wbtName
            function renderCustomSiteName(params) {
                return '<div cost-center-renderer="data" show-site-name="true" week-ending-date="weeklySearch.getFormattedDate()"></div>';
            }

            // Custom Filter for the Amount
            function amountValueGetter(params) {
                return $filter('currency')(params.data[params.colDef.field]);
            }

            function createNewDataSource() {
                var dataSource = {
                    pageSize: 25,
                    getRows: function(params) {
                        var resultsPerPage = 25;
                        var currentPage = parseInt(params.startRow / resultsPerPage, 10);

                        params.endRow = params.startRow + resultsPerPage;
                        params.deptNameDesc = params.hasOwnProperty("deptNameDesc") ? params.deptNameDesc : "";

                        if (!params.hasOwnProperty("successCallback")) {
                            weeklySearch.gridOptions.api.showLoading(true);
                        }

                        ResourceAllocationService
                            .getCostCenters(weeklySearch.getFormattedDate(), currentPage + 1, params.deptNameDesc,
                                            0, params.sortModel, resultsPerPage)
                            .then(function(data) {
                                var lastRow = data.total;
                                var dataRows = data.data;

                                if (dataRows.length !== resultsPerPage) {
                                    lastRow = dataRows.length;
                                }

                                weeklySearch.datasource.lastParams = params;

                                weeklySearch.gridOptions.api.setRows(dataRows);
                                weeklySearch.gridOptions.api.onNewRows();
                                weeklySearch.gridOptions.api.showLoading(false);
                            });

                    }
                };

                weeklySearch.gridOptions.api.setDatasource(dataSource);

                return dataSource;
            }

            // updates the search parameters when the header changes
            weeklySearch.updateGridSearch = function(selectedCostCenter) {
                var params = {
                    startRow: 1,
                    deptNameDesc: selectedCostCenter.deptName
                };

                weeklySearch.datasource.source.getRows(params);
            };

            weeklySearch.payGroupSelected = function(selectedPayGroup) {
                $scope.$broadcast('refreshDatepickers');
                weeklySearch.selectedPayGroup = selectedPayGroup;
                weeklySearch.weekEndingDate = $filter("date")(selectedPayGroup.weekEndDate, weeklySearch.weekEndingDateFormat);
            };

            // dates that are disabled on the calendar - related to selectedPayGroup (Thu/Sat)
            weeklySearch.disabledDates = function(date, mode) {
                if (weeklySearch.selectedPayGroup) {
                    return (mode === 'day' && (date.getDay() !==  weeklySearch.selectedPayGroup.weekEndDay));
                } else {
                    return false;
                }
            };

            // highlights the full week
            weeklySearch.getDayClass = function(date, mode) {
                var endTime = (new Date(weeklySearch.weekEndingDate)).getTime();

                if (date.getTime() > (endTime - (24*60*60*1000*7)) &&
                    date.getTime() < endTime) {
                    return "selectedWeekBackground";
                }
                return "";
            };

            weeklySearch.openWeekEndingDateDatepicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                weeklySearch.weekEndingDateOpened = !weeklySearch.weekEndingDateOpened;
            };

            // datepicker will set a full dateTtime format, we only want mm/dd/yyyy
            weeklySearch.getFormattedDate = function() {
                return $filter("date")(weeklySearch.weekEndingDate, weeklySearch.weekEndingDateFormat);
            };

            // will eventually turn into a service call?
            function getPayGroups() {
                weeklySearch.payGroups = [{
                    id: "Fri-Thurs Hourly",
                    name: "Fri-Thurs Hourly",
                    weekEndDay: 4
                }, {
                    id: "Sun-Sat Hourly",
                    name: "Sun-Sat Hourly",
                    weekEndDay: 6
                }];

                angular.forEach(weeklySearch.payGroups, function(value, key) {
                    value.weekEndDate = getNextEndingDay(value);
                });

                weeklySearch.selectedPayGroup = weeklySearch.payGroups[0];
                weeklySearch.payGroupSelected(weeklySearch.selectedPayGroup);
            }

            // determines when the next day is for the selected pay group
            function getNextEndingDay(payGroup) {
                var today = new Date();
                var newDate = new Date(today);

                if (newDate.getDay() <= payGroup.weekEndDay) {
                    newDate.setDate(newDate.getDate() - (newDate.getDay() - payGroup.weekEndDay));
                } else {
                    newDate.setDate(newDate.getDate() + (7 - newDate.getDay() + payGroup.weekEndDay));
                }

                return newDate;
            }

            getPayGroups();
        }]
    )

    .directive("weeklySearch", function() {
        return {
            restrict: "A",
            controller: "WeeklySearchController as weeklySearch",
            templateUrl: "resourceAllocation/directives/weeklySearch.tpl.html"
        };
    });

angular.module('resourceAllocation',[
    'resourceAllocation.service.ResourceAllocationService',
    'resourceAllocation.directive.WeeklySearch',
    'resourceAllocation.directive.CostCenterHistory'
    ])

    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('resourceAllocation',{
                    url:"/",
                    templateUrl:"resourceAllocation/resource-allocation.tpl.html",
                    controller: "ResourceAllocationController as resourceAllocation"
                })
                .state('resourceAllocation.weeklySearch',{
                    url:"weeklySearch/",
                    templateUrl:"resourceAllocation/tab1.tpl.html"
                })
                .state('resourceAllocation.costCenterHistory',{
                    url:"costCenterHistory/",
                    templateUrl:"resourceAllocation/tab2.tpl.html"
                });
    }])

    .controller('ResourceAllocationController',
        ['$scope', '$stateParams', '$state',
        function($scope, $stateParams, $state) {
            var orderStatus = this;

            // BEGIN TAB MANAGEMENT and ROUTING
            orderStatus.tabState = true;
            function changeState(toState, event, params){
                if (toState.name === "resourceAllocation") {
                    if (event) {
                        event.preventDefault();
                    }
                    $state.go('resourceAllocation.weeklySearch', params);
                }
            }
            var stateChange = $scope.$on("$stateChangeStart",
                function(event, toState, toParams, fromState, fromParams){
                    changeState(toState,event,toParams);
                }
            );
            $scope.$on("$destroy",
                function(){
                    stateChange();
                }
            );
            changeState($state.$current,null,$stateParams);
            // END TAB MANAGEMENT and ROUTING
    }]);

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


angular.module("scheduleSummary.directive.AssignmentCalendarCell",[
    'scheduleSummary.service.TasksService',
    "scheduleSummary.directive.ShowAssignmentInstance"
])
    .controller("AssignmentCalendarCell", ['$scope', 'TasksService', '$modal', 'TaskAssignmentService', '$log',
        function($scope, TasksService, $modal, TaskAssignmentService, $log){
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
                    console.log(selectedItem);
                }, function(result) {
                    $log.info('Modal dismissed at: ' + new Date());
                    $log.info('result: ' + result);
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
                assignments: "=",
                costCenter: "=",
                weekEndingDate: "="
            },
            controller: "AssignmentCalendarCell as assignmentCalendarCell",
            templateUrl: "scheduleSummary/directives/assignmentCalendarCell.tpl.html"
        };
    });

angular.module('scheduleSummary.directive.AssociateList', [
    'scheduleSummary.service.ScheduleAssociatesServices',
    'common.directives.CostCenterTypeahead'
])
    .controller('AssociateListController', ['$scope', 'ScheduleAssociatesService', '$filter',
        function ($scope, ScheduleAssociatesService, $filter) {
            $scope.isCollapsed = true;

            var associateListController = this;
            associateListController.selectedPosition = null;
            associateListController.associates = [];
            associateListController.groupedAssociates = [];
            associateListController.jobTitle = "";
            associateListController.associateName = "";

            associateListController.dragOptions = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return false;
                },
                itemMoved: function (event) {
                    event.dest.sortableScope.callbacks.itemMoved(event);
                },
                alwaysInsertLast: true,
                suppressPlaceholder: true,
                clone: true
            };

            var altCostCenter = null;
            associateListController.selectedCostCenterChanged = function(newCostCenter) {
                if (altCostCenter !== newCostCenter) {
                    altCostCenter = (!newCostCenter ? $scope.costCenter : newCostCenter);
                    showAssociates(altCostCenter, $scope.weekEndingDate);
                }
            };

            associateListController.filterData = function() {
                var retObject = {},
                    associateObject = _.groupBy(angular.copy(associateListController.associates), "jobDesc"),
                    jobTitle = associateListController.jobTitle,
                    nameSearch = associateListController.associateName;

                for (var key in associateObject) {
                    if (associateObject.hasOwnProperty(key) && key.toUpperCase().indexOf(jobTitle.toUpperCase()) !== -1) {
                        var currentAssociateGroup = associateObject[key];

                        if (nameSearch.trim().length === 0) {
                            retObject[key] = associateObject[key];
                        } else {
                            for (var i=0; i < currentAssociateGroup.length; i++) {
                                var currAssociate = currentAssociateGroup[i];

                                if (currAssociate.Name.toUpperCase().indexOf(nameSearch.toUpperCase()) !== -1) {
                                    if (!retObject.hasOwnProperty(key)) {
                                        retObject[key] = [];
                                    }

                                    retObject[key].push(currAssociate);
                                }
                            }
                        }
                    }
                }

                associateListController.groupedAssociates = retObject;
            };



            function showAssociates(costCenter, weekEndingDate) {
                ScheduleAssociatesService.getAllAssociates(costCenter.wbuId, $scope.costCenter.deptId, costCenter.id, weekEndingDate)
                    .then(function (response) {
                        associateListController.associates = response.associates;
                        associateListController.groupedAssociates = _.groupBy(associateListController.associates, 'jobDesc');
                    });
            }

            function initialize() {
                if ($scope.costCenter && $scope.weekEndingDate) {
                    showAssociates($scope.costCenter, $scope.weekEndingDate);
                }
            }

            initialize();
        }]
)
    .directive('associateList', function() {
        return {
            restrict: 'EA',
            scope: {
                costCenter: "=",
                weekEndingDate: '=date'
            },
            controller: 'AssociateListController as associateListController',
            templateUrl: 'scheduleSummary/directives/associateList.tpl.html'
        };
    });

angular.module("scheduleSummary.directive.OldScheduler",[])
    .controller("OldSchedulerController", ['$stateParams', 'ScheduleSummaryServices',
        function($stateParams, ScheduleSummaryServices){
            var oldScheduler = this;
            oldScheduler.title = "Old Scheduler";
        }]
)
    .directive("oldScheduler", function() {
        return {
            restrict: "A",
            controller: "OldSchedulerController as oldScheduler",
            templateUrl: "scheduleSummary/directives/oldScheduler.tpl.html"
        };
    });

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

            function initialize() {
                TaskAssignmentService.getAssignedJobs(selectedAssignment.jobId, selectedAssignment.empId, selectedAssignment.StartDate)
                    .then(function(res) {
                        taskAssignmentCtrl.jobs = res.data;
                    });
            }

        taskAssignmentCtrl.editAssignment.startTime = $filter('date')(taskAssignmentCtrl.editAssignment.startTime, 'hh:mm a');
        taskAssignmentCtrl.editAssignment.endTime = $filter('date')(taskAssignmentCtrl.editAssignment.endTime, 'hh:mm a');
        taskAssignmentCtrl.editAssignment.brkStartTime = $filter('date')(taskAssignmentCtrl.editAssignment.brkStartTime, 'hh:mm a');
        taskAssignmentCtrl.editAssignment.brkEndTime = $filter('date')(taskAssignmentCtrl.editAssignment.brkEndTime, 'hh:mm a');


            //taskAssignmentCtrl.selectedJob = function(jobId) {
            //    taskAssignmentCtrl.jobSelected = jobId;
            //    taskAssignmentCtrl.editAssignment.jobId = jobId;
            //
            //    initialize(jobId, taskAssignmentCtrl.assignment.empId, taskAssignmentCtrl.assignment.StartDate);
            //
            //};


        taskAssignmentCtrl.cancel = function() {
            console.log(taskAssignmentCtrl.assignment);
            console.log(taskAssignmentCtrl.editAssignment);
            $modalInstance.dismiss(false);
        };

        taskAssignmentCtrl.keepChanges = function() {
           // taskAssignmentCtrl.assignment = angular.copy(taskAssignmentCtrl.editAssignment);
            selectedAssignment = angular.copy(taskAssignmentCtrl.editAssignment);
            console.log(taskAssignmentCtrl.assignment);
            console.log(taskAssignmentCtrl.editAssignment);
            $modalInstance.close(selectedAssignment);
        };

            initialize();

         //   initialize(taskAssignmentCtrl.assignment.jobId, taskAssignmentCtrl.assignment.empId, taskAssignmentCtrl.assignment.StartDate);

    }]);


angular.module("scheduleSummary.directive.TaskBasedScheduler",[
    'scheduleSummary.directive.AssociateList',
    'scheduleSummary.directive.TaskListCalendar'
])
    .controller("TaskBasedSchedulerController", ['$stateParams', 'ScheduleSummaryServices', '$http',
        function($stateParams, ScheduleSummaryServices, $http){
            var taskBasedScheduler = this;
            taskBasedScheduler.weekEndingDate = $stateParams.weekEndingDate;
            taskBasedScheduler.costCenter = $stateParams.costCenter;

        }])

    .directive("taskBasedScheduler", function() {
        return {
            restrict: "A",
            controller: "TaskBasedSchedulerController as taskBasedScheduler",
            templateUrl: "scheduleSummary/directives/taskBasedScheduler.tpl.html"
        };
    });

angular.module("scheduleSummary.directive.TaskListCalendar",[
    'scheduleSummary.service.TasksService',
    'common.filters.GetTimeFilter',
    'scheduleSummary.directive.AssignmentCalendarCell'
])
    .controller("TaskListCalendarController", ['$scope', '$filter', '$stateParams', '$state', '$q', 'TasksService',
        function($scope, $filter, $stateParams, $state, $q, TasksService){
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

                $q.all([
                    TasksService.getTasks(costCenter.schedId)
                        .then(function(data) {
                            var response = data;
                            response.tasks = data.tasks;
                            taskListCalendar.tasks = response.tasks;
                        }),
                    TasksService.getAssignments(costCenter.schedId, costCenter.deptId, weekEndingDate)
                        .then(function(data) {
                            taskListCalendar.assignments = data.assignments;
                        })
                ]).then(function(data) {
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

angular.module('scheduleSummary',[
    'scheduleSummary.service.ScheduleSummaryService',
    'scheduleSummary.directive.TaskBasedScheduler',
    'scheduleSummary.directive.OldScheduler'
    ])

    .config(['$stateProvider',
        function($stateProvider){
            $stateProvider
                .state('scheduleSummary',{
                    url:"/scheduleSummary/",
                    templateUrl:"scheduleSummary/schedule-summary.tpl.html",
                    controller: "ScheduleSummaryController as scheduleSummary",
                    params: {
                        costCenter: null,
                        weekEndingDate: null
                    }
                })
                .state('scheduleSummary.taskBased',{
                    url:"taskBased/",
                    templateUrl:"scheduleSummary/tab1.tpl.html"
                })
                .state('scheduleSummary.oldScheduler',{
                    url:"oldScheduler/",
                    templateUrl:"scheduleSummary/tab2.tpl.html"
                });
    }])

    .controller('ScheduleSummaryController',
        ['$scope', '$stateParams', '$state',
        function($scope, $stateParams, $state) {
            var orderStatus = this;

            // BEGIN TAB MANAGEMENT and ROUTING
            orderStatus.tabState = true;
            function changeState(toState, event, params){
                if (toState.name === "scheduleSummary") {
                    if (event) {
                        event.preventDefault();
                    }
                    $state.go('scheduleSummary.taskBased', params);
                }
            }
            var stateChange = $scope.$on("$stateChangeStart",
                function(event, toState, toParams, fromState, fromParams){
                    changeState(toState,event,toParams);
                }
            );
            $scope.$on("$destroy",
                function(){
                    stateChange();
                }
            );
            changeState($state.$current,null,$stateParams);
            // END TAB MANAGEMENT and ROUTING
    }])
;

'use strict';

angular.module("scheduleSummary.service.ScheduleAssociatesServices", [])
    .factory('ScheduleAssociatesService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {
            var scheduleAssociates = {};

            scheduleAssociates.getAllAssociates = function(userId, teamId, altTeamId, weekEndingDate) {
                var paramsObj = buildRequestObject(userId, teamId, altTeamId, weekEndingDate);
                var deferred = $q.defer();
                var url = API_PREFIX + 'cg/user/schedule/associates';

                    $http.get(url, {params: paramsObj})
                    .success(function(response) {
                        deferred.resolve(response);
                    }).error(function(err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            };

            scheduleAssociates.getMockMessageCount = function() {
                return $q.when(72);
            };

            function buildRequestObject(wbuId, teamId, altTeamId, weekEndingDate) {
                var reqObj = {
                    userId: wbuId,
                    teamId: teamId,
                    weekEndDate: weekEndingDate,
                    payGroupId: 10005,
                    sort:'[{property: "jobDesc", direction: "ASC"}]',
                    page: 1,
                    start: 0,
                    limit: 25,
                    subteams: 'y'
                };

                if(altTeamId) {
                    reqObj.altteamId = altTeamId;
                }

                return reqObj;
            }


            return scheduleAssociates;
        }
    ]);

angular.module("scheduleSummary.service.ScheduleSummaryService", [])
    .service('ScheduleSummaryServices', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {

        }
    ]);

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

angular.module("scheduleSummary.service.TasksService", [])
    .service('TasksService', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {

            this.getTasks = function(scheduleId, pageNumber, startRow, limit) {
                var deferred = $q.defer();
                var url = API_PREFIX + "/cg/user/schedule/template_tasks";

                var reqObj = {
                    schedId: scheduleId,
                    page: (typeof pageNumber === 'undefined') ? 1 : pageNumber,
                    start: (typeof startRow === 'undefined') ? 0 : startRow,
                    limit: (typeof limit === 'undefined') ? 25 : limit
                };

                $http.get(url, {params: reqObj})
                    .then(function(res) {
                        deferred.resolve(res.data);
                    });

                return deferred.promise;
            };

            this.getAssignments = function(scheduleId, teamId, weekEndDate, pageNumber, startRow, limit) {
                var deferred = $q.defer();
                var url = API_PREFIX + "/cg/user/schedule/task_assignments";

                var reqObj = {
                    schedId: scheduleId,
                    teamId: teamId,
                    weekEndDate: weekEndDate,
                    payGroupId: 10005,
                    page: (typeof pageNumber === 'undefined') ? 1 : pageNumber,
                    start: (typeof startRow === 'undefined') ? 0 : startRow,
                    limit: (typeof limit === 'undefined') ? 25 : limit,
                    sort: JSON.stringify([{"property":"empName","direction":"desc"},{"property":"startTime","direction":"asc"}])
                };

                $http.get(url, {params: reqObj})
                    .then(function(res) {
                        deferred.resolve(res.data);
                    });

                return deferred.promise;
            };

        }
    ]);

var en_US = {
    MAIN: {
        TITLE: "MyStaff Scheduler",
        COPYRIGHT: "Copyright &copy; 2015 - Compass Group"
    },
    RESOURCE_ALLOCATION: {
        TITLE: "Resource Allocation",
        TABS: {
            WEEKLY_SEARCH: "Weekly Search",
            COST_CENTER_HISTORY: "Cost Center History"
        },
        PAY_GROUP: "Pay Group:",
        COST_CENTER: "Cost Center:",
        WEEK_ENDING_DAY: "Week Ending Day:"
    },
    SCHEDULE_SUMMARY: {
        TITLE: "Schedule Summary",
        TABS: {
            TASK_BASED: "Task Based",
            OLD: "Old Scheduler"
        },
        ASSOCIATIONS: {
            SEARCH_BY: {
                TEAM: "Search Cost Center...",
                POSITION: "Search Position...",
                NAME: "Search Name...",
                TITLE: {
                    NAME: "Name:",
                    TEAM: "Team:",
                    POSITION: "Position:"
                }
            }
        }
    },
    COMMON: {
        SEARCH: "Search...",
        GO: "Go",
        RESET: "Reset",
        HOURS: "Hours",
        TITLE: {
            POSITION: "Position:"
        }
    }
};


angular.module('templates.app', ['resourceAllocation/directives/costCenterHistory.tpl.html', 'resourceAllocation/directives/costCenterRenderer.tpl.html', 'resourceAllocation/directives/weeklySearch.tpl.html', 'resourceAllocation/resource-allocation.tpl.html', 'resourceAllocation/tab1.tpl.html', 'resourceAllocation/tab2.tpl.html', 'scheduleSummary/directives/assignmentCalendarCell.tpl.html', 'scheduleSummary/directives/associateList.tpl.html', 'scheduleSummary/directives/oldScheduler.tpl.html', 'scheduleSummary/directives/scheduleAssociates.tpl.html', 'scheduleSummary/directives/showAssignment.tpl.html', 'scheduleSummary/directives/taskBasedScheduler.tpl.html', 'scheduleSummary/directives/taskListCalendar.tpl.html', 'scheduleSummary/schedule-summary.tpl.html', 'scheduleSummary/tab1.tpl.html', 'scheduleSummary/tab2.tpl.html']);

angular.module("resourceAllocation/directives/costCenterHistory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("resourceAllocation/directives/costCenterHistory.tpl.html",
    "<h2>{{ costCenterHistory.title }}</h2>");
}]);

angular.module("resourceAllocation/directives/costCenterRenderer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("resourceAllocation/directives/costCenterRenderer.tpl.html",
    "<div class=\"costCenterRenderer\">\n" +
    "    <span ng-if=\"costCenterRenderer.showLink(data)\" ng-click=\"costCenterRenderer.onClick(data, weekEndingDate)\">\n" +
    "        <a class=\"costCenterLink\" href=\"#\" onclick=\"return false;\">{{ ::costCenterRenderer.displayText }}</a>\n" +
    "    </span>\n" +
    "    <span ng-if=\"!costCenterRenderer.showLink(data)\">{{ ::costCenterRenderer.displayText }}</span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("resourceAllocation/directives/weeklySearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("resourceAllocation/directives/weeklySearch.tpl.html",
    "<div class=\"weeklySearch\">\n" +
    "    <div class=\"row header\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <form name=\"headerForm\">\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <p><strong>{{'RESOURCE_ALLOCATION.COST_CENTER' | translate}}</strong></p>\n" +
    "                    <div cost-center-typeahead\n" +
    "                            ng-model=\"weeklySearch.selectedCostCenter\"\n" +
    "                            required>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 col-paygroup\">\n" +
    "                    <p><strong>{{'RESOURCE_ALLOCATION.PAY_GROUP' | translate}}</strong></p>\n" +
    "                    <div class=\"payGroup\">\n" +
    "                        <div dropdown>\n" +
    "                            <button type=\"button\" class=\"btn dropdown-toggle\" dropdown-toggle ng-disabled=\"disabled\">\n" +
    "                                {{ weeklySearch.selectedPayGroup.name }} <span class=\"caret\"></span>\n" +
    "                            </button>\n" +
    "                            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                                <li ng-repeat=\"item in weeklySearch.payGroups\"\n" +
    "                                    ng-click=\"weeklySearch.payGroupSelected(item)\">\n" +
    "                                    <a href=\"#\" onclick=\"return false\">{{ item.name }}</a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 datepicker\">\n" +
    "                    <p><strong>{{'RESOURCE_ALLOCATION.WEEK_ENDING_DAY' | translate}}</strong></p>\n" +
    "                    <input type=\"text\"\n" +
    "                           class=\"form-control\"\n" +
    "                           ng-model=\"weeklySearch.weekEndingDate\"\n" +
    "                           ng-required=\"true\"\n" +
    "                           datepicker-popup=\"{{ ::weeklySearch.weekEndingDateFormat }}\"\n" +
    "                           is-open=\"weeklySearch.weekEndingDateOpened\"\n" +
    "                           datepicker-options=\"weeklySearch.weekEndingDateDateOptions\"\n" +
    "                           date-disabled=\"weeklySearch.disabledDates(date, mode)\"\n" +
    "                           custom-class=\"weeklySearch.getDayClass(date, mode)\"\n" +
    "                           show-button-bar=\"false\"\n" +
    "                           close-on-date-selection=\"false\"\n" +
    "                           close-text=\"Close\"\n" +
    "                           required>\n" +
    "                    <i class=\"glyphicon glyphicon-calendar glyphicon-calendar--position\"\n" +
    "                       ng-click=\"weeklySearch.openWeekEndingDateDatepicker($event)\"></i>\n" +
    "                    </input>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <div class=\"button-wrapper\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\"\n" +
    "                                ng-disabled=\"headerForm.$invalid\"\n" +
    "                                ng-click=\"weeklySearch.updateGridSearch(weeklySearch.selectedCostCenter)\">{{ 'COMMON.GO' | translate }}</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\">{{ 'COMMON.RESET' | translate }}</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row gridContainer\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"gridParent\">\n" +
    "                <div ag-grid=\"weeklySearch.gridOptions\" class=\"ag-fresh grid\"></div>\n" +
    "            </div>\n" +
    "            <div grid-pagination=\"weeklySearch.datasource\"\n" +
    "                    results=\"weeklySearch.getResults()\"\n" +
    "                    request-params=\"weeklySearch.getRequestParams()\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("resourceAllocation/resource-allocation.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("resourceAllocation/resource-allocation.tpl.html",
    "<div class=\"resourceAllocation\">\n" +
    "    <h2>{{ 'RESOURCE_ALLOCATION.TITLE' | translate}}</h2>\n" +
    "    <div>\n" +
    "        <tabset>\n" +
    "            <tab heading=\"{{'RESOURCE_ALLOCATION.TABS.WEEKLY_SEARCH' | translate}}\"\n" +
    "                 ui-sref=\"resourceAllocation.weeklySearch\"\n" +
    "                 active =\"resourceAllocation.tabState\"\n" +
    "                 ui-sref-active=\"active\">\n" +
    "            </tab>\n" +
    "            <tab heading=\"{{'RESOURCE_ALLOCATION.TABS.COST_CENTER_HISTORY' | translate}}\"\n" +
    "                 ui-sref=\"resourceAllocation.costCenterHistory\"\n" +
    "                 active =\"resourceAllocation.tabState\"\n" +
    "                 ui-sref-active=\"active\">\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "        <div class=\"tab-view\">\n" +
    "            <div ui-view></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("resourceAllocation/tab1.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("resourceAllocation/tab1.tpl.html",
    "<div class=\"content\">\n" +
    "    <div weekly-search></div>\n" +
    "</div>");
}]);

angular.module("resourceAllocation/tab2.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("resourceAllocation/tab2.tpl.html",
    "<div class=\"content\">\n" +
    "    <div cost-center-history></div>\n" +
    "</div>");
}]);

angular.module("scheduleSummary/directives/assignmentCalendarCell.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/assignmentCalendarCell.tpl.html",
    "<div class=\"assignmentCalendarCell\">\n" +
    "    <ul as-sortable=\"assignmentCalendarCell.dropOptions\" ng-model=\"assignments\">\n" +
    "        <li ng-repeat=\"assignment in assignments track by $index\" as-sortable-item ng-dblclick=\"assignmentCalendarCell.showModal(assignment)\">\n" +
    "            <div class=\"userAssignment\"\n" +
    "                 as-sortable-item-handle\n" +
    "                 popover-template=\"assignmentCalendarCell.templateUrl\"\n" +
    "                 popover-trigger=\"hover\"\n" +
    "                 popover-popup-delay=\"1000\">\n" +
    "                {{ ::assignment.Name }}\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"popup.html\">\n" +
    "    <div class=\"\">\n" +
    "        <p>\n" +
    "            <span class=\"graphicon graphicon-book\"></span>\n" +
    "            <span><strong>Name:</strong></span>\n" +
    "        </p>\n" +
    "\n" +
    "        <p>{{ ::assignment.Name }}</p>\n" +
    "\n" +
    "        <p>\n" +
    "            <span class=\"graphicon graphicon-time\"></span>\n" +
    "            <span><strong>Time:</strong></span>\n" +
    "        </p>\n" +
    "        <p>{{ ::assignment.startTime | date:'hh:mm a' }} - {{ ::assignment.endTime | date:'hh:mm a' }}</p>\n" +
    "\n" +
    "        <p>\n" +
    "            <span class=\"graphicon graphicon-time\"></span>\n" +
    "            <span><strong>Break:</strong></span>\n" +
    "        </p>\n" +
    "        <p>{{ ::assignment.brkStartTime | date:'hh:mm a' }} - {{ ::assignment.brkEndTime | date:'hh:mm a' }}</p>\n" +
    "    </div>\n" +
    "</script>\n" +
    "");
}]);

angular.module("scheduleSummary/directives/associateList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/associateList.tpl.html",
    "<div class=\"associatesList\">\n" +
    "    <div class=\"associatesHeader\">\n" +
    "        <div class=\"searchByCostCenter\">\n" +
    "            <span class=\"title\">{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.TITLE.TEAM' | translate }}</span>\n" +
    "            <div class=\"costCenter\"\n" +
    "                 cost-center-typeahead\n" +
    "                 ng-model=\"associateListController.selectedCostCenter\"\n" +
    "                 ng-change=\"associateListController.selectedCostCenterChanged(associateListController.selectedCostCenter)\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"searchByJobTitle\">\n" +
    "            <span class=\"title\">{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.TITLE.POSITION' | translate }}</span>\n" +
    "            <input class=\"jobTitle\"\n" +
    "                   type=\"text\"\n" +
    "                   ng-model=\"associateListController.jobTitle\"\n" +
    "                   ng-change=\"associateListController.filterData()\"\n" +
    "                   placeholder=\"filter by job title\"><br/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"searchByAssociateName\">\n" +
    "            <div class=\"titleAndSearch\">\n" +
    "                <div class=\"title\">Name</div>\n" +
    "                <input class=\"associateName\"\n" +
    "                       type=\"text\"\n" +
    "                       ng-model=\"associateListController.associateName\"\n" +
    "                       ng-change=\"associateListController.filterData()\"\n" +
    "                       placeholder=\"filter by name\">\n" +
    "            </div>\n" +
    "            <div class=\"hoursContainer\">\n" +
    "                <span class=\"hours\">Hours</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div as-sortable=\"associateListController.dragOptions\" ng-model=\"associateListController.associates\">\n" +
    "        <div class=\"associatesContainer\">\n" +
    "            <ul>\n" +
    "                <li class=\"jobs\"\n" +
    "                    ng-repeat=\"(job, associates) in associateListController.groupedAssociates\">\n" +
    "\n" +
    "                    <div class=\"jobHeader\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "                        <span class=\"jobTitle\">Position: {{ job }} ({{ associates.length }})</span>\n" +
    "                        <span class=\"jobTitleIcon glyphicon\"\n" +
    "                              ng-class=\"{'glyphicon-menu-down': !isCollapsed, 'glyphicon-menu-left': isCollapsed}\"\n" +
    "                              aria-hidden=\"true\"></span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"associateContainer\" collapse=\"isCollapsed\" style=\"height: 0px;\">\n" +
    "                        <ul>\n" +
    "                            <li class=\"associate\" ng-repeat=\"associate in associates\" ng-class-even=\"'evenRows'\" as-sortable-item>\n" +
    "                                <div class=\"associateDetails\" as-sortable-item-handle>\n" +
    "                                    <div class=\"associateJob\">{{ ::job }}</div>\n" +
    "                                    <div class=\"associateName\">{{ ::associate.Name }}<span class=\"associateId\"> - {{ ::associate.empName }}</span></div>\n" +
    "                                    <div class=\"associateHours\">{{ (associate.schedHours !== null) ? associate.schedHours : 0 }}</div>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("scheduleSummary/directives/oldScheduler.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/oldScheduler.tpl.html",
    "<h2>{{ oldScheduler.title }}</h2>");
}]);

angular.module("scheduleSummary/directives/scheduleAssociates.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/scheduleAssociates.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"row col-padding-all\">\n" +
    "            <div class=\"col-md-3\">{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.TITLE.TEAM' | translate }}</div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <cost-center-typeahead\n" +
    "                        ng-model=\"scheduleAssociatesCtrl.selectedCostCenter\">\n" +
    "                </cost-center-typeahead>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row col-padding-all\">\n" +
    "            <div class=\"col-md-3\">{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.TITLE.POSITION' | translate }}</div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <div class=\"dropdown\" dropdown>\n" +
    "                    <input class=\"btn btn-default dropdown-toggle\"\n" +
    "                           placeholder=\"{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.POSITION' | translate }}\"\n" +
    "                           dropdown-toggle\n" +
    "                           type=\"text\"\n" +
    "                           ng-disabled=\"disabled\"\n" +
    "                           ng-model=\"scheduleAssociatesCtrl.selectedPosition\">\n" +
    "                        <span class=\"caret\"></span>\n" +
    "                    </input>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li ng-repeat=\"(key, groupsList) in scheduleAssociatesCtrl.groupedAssociates | filter: selectedPosition\"\n" +
    "                                ng-click=\"scheduleAssociatesCtrl.selectedGroupPosition(key, groupsList)\">\n" +
    "                            {{ ::key }}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row search-by-name\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"col-md-9\">\n" +
    "            <div class=\"row col-padding-all\">\n" +
    "                <h5>{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.TITLE.NAME' | translate }}</h5>\n" +
    "            </div>\n" +
    "            <div class=\"row col-padding-all\">\n" +
    "                <form name=\"searchByNameForm\">\n" +
    "                    <div>\n" +
    "                        <input class=\"search-box\"\n" +
    "                               type=\"search\"\n" +
    "                               class=\"form-control\"\n" +
    "                               ng-model=\"searchTerm\"\n" +
    "                               placeholder=\"{{ 'SCHEDULE_SUMMARY.ASSOCIATIONS.SEARCH_BY.NAME' | translate }}\">\n" +
    "                               <div class=\"search-icon-container\">\n" +
    "                                   <span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>\n" +
    "                               </div>\n" +
    "                        </input>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <div>{{ 'COMMON.HOURS' | translate }}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row row-wrapper\">\n" +
    "    <div class=\"row-positions-content\">\n" +
    "        <div class=\"list-wrapper\" ng-repeat=\"(key, groups) in scheduleAssociatesCtrl.groupedAssociates | searchPosition: scheduleAssociatesCtrl.selectedPosition | searchName: searchTerm\">\n" +
    "            <div class=\"list-positions-wrapper\">\n" +
    "                <div class=\"list-positions\" ng-click=\"groups.isCollapsed = !groups.isCollapsed\">\n" +
    "                    <span>{{ (groups.isCollapsed) ? '-' : '+' }}</span>\n" +
    "                    <span class=\"group-title-text\">\n" +
    "                    {{ 'COMMON.TITLE.POSITION' | translate }}&nbsp;{{ ::key }}&nbsp;&nbsp;({{ results.length }})\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <ul class=\"list-unstyled\" collapse=\"!groups.isCollapsed\">\n" +
    "                <li class=\"list-persons-wrapper group-title-wrapper list-persons list-person\"  ng-repeat=\"(i, associate) in groups | filter: { Name: searchTerm } as results\" ng-class=\"(associate.schedHours >= 50) ? 'danger-hours' : 'normal-hours'\">\n" +
    "                    <span>{{ ::associate.Name }} - {{ ::associate.empName }}</span>\n" +
    "                    <span class=\"hours-text\">{{ ::(associate.schedHours !== null) ? associate.schedHours : 0 }}</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("scheduleSummary/directives/showAssignment.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/showAssignment.tpl.html",
    "<div class=\"panel panel-primary\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h3 class=\"panel-title\">{{ ::taskAssignmentCtrl.editAssignment.Name }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <form name=\"assignmentForm\" novalidate role=\"form\">\n" +
    "                <div class=\"row form-row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            Start/End:\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\" >\n" +
    "                            <div class=\"form-group\" show-errors='{showSuccess: true}'>\n" +
    "                                <input class=\"form-control\" type=\"text\" name=\"startTime\" ng-model=\"taskAssignmentCtrl.editAssignment.startTime\" rpattern=\"/[0-9]|\\:/\" required/>\n" +
    "                                <!--<span class=\"help-block\" ng-show=\"assignmentForm.startTime.$invalid\">start time is required</span>-->\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\" show-errors='{showSuccess: true}'>\n" +
    "                                <input class=\"form-control\" type=\"text\" name=\"endTime\" ng-model=\"taskAssignmentCtrl.editAssignment.endTime\" required/>\n" +
    "                                <!--<span class=\"help-block\" ng-show=\"assignmentForm.endTime.$invalid\">End time is required</span>-->\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row form-row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            Meal:\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <div class=\"form-group\" show-errors='{showSuccess: true}'>\n" +
    "                                <input class=\"form-control\" type=\"text\" name=\"brkStartTime\" ng-model=\"taskAssignmentCtrl.editAssignment.brkStartTime\" required/>\n" +
    "                                <!--<span class=\"help-block\" ng-show=\"assignmentForm.brkStartTime.$invalid\">start time is required</span>-->\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\" show-errors='{showSuccess: true}'>\n" +
    "                                <input class=\"form-control\" type=\"text\" name=\"brkEndTime\" ng-model=\"taskAssignmentCtrl.editAssignment.brkEndTime\" required/>\n" +
    "                                <!--<span class=\"help-block\" ng-show=\"assignmentForm.brkEndTime.$invalid\">End time is required</span>-->\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row form-row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            Cost Center:\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <cost-center-typeahead\n" +
    "                                    ng-model=\"taskAssignmentCtrl.editAssignment.wbtName\">\n" +
    "                            </cost-center-typeahead>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row form-row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            Home Team:\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <input type=\"text\" ng-model=\"taskAssignmentCtrl.editAssignment.costCenterName\" disabled/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row form-row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            Job:\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <div class=\"dropdown\" dropdown>\n" +
    "                                <button class=\"btn btn-default dropdown-toggle\"\n" +
    "                                        dropdown-toggle\n" +
    "                                        ng-disabled=\"disabled\">\n" +
    "                                    {{ ::taskAssignmentCtrl.jobSelected }}\n" +
    "                                    <div class=\"caretContainer\">\n" +
    "                                        <span class=\"caret\"></span>\n" +
    "                                    </div>\n" +
    "                                </button>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li ng-repeat=\"job in taskAssignmentCtrl.jobs\" ng-click=\"taskAssignmentCtrl.selectedJob(job.jobId)\">\n" +
    "                                        {{ ::job.jobDesc }}\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-footer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <!-- <div class=\"col-md-4\">\n" +
    "                    <button class=\"btn btn-primary btn-lg\"  ng-click=\"taskAssignmentCtrl.cancel()\">Cancel</button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <button class=\"btn btn-primary btn-lg\">Delete</button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <button class=\"btn btn-primary btn-lg\">Keep Changes</button>\n" +
    "                </div> -->\n" +
    "                <div class=\"btn-group btn-group-justified\" role=\"group\" aria-label=\"...\">\n" +
    "                    <div class=\"btn-group\" role=\"group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"taskAssignmentCtrl.cancel()\">Cancel</button>\n" +
    "                    </div>\n" +
    "                    <div class=\"btn-group\" role=\"group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\">Delete</button>\n" +
    "                    </div>\n" +
    "                    <div class=\"btn-group\" role=\"group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"taskAssignmentCtrl.keepChanges()\">Keep Changes</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("scheduleSummary/directives/taskBasedScheduler.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/taskBasedScheduler.tpl.html",
    "<div class=\"container-fluid task-based-scheduler\">\n" +
    "    <div class=\"row scheduler-row\">\n" +
    "        <div class=\"col-md-9 scheduler-body\">\n" +
    "            <div class=\"row scheduler-header\">\n" +
    "                <div class=\"col-md-12 scheduler-header-content\">\n" +
    "                    <p>Cost Center:&nbsp;<h3>\n" +
    "                    {{ taskBasedScheduler.costCenter.deptName }} -\n" +
    "                    {{ taskBasedScheduler.costCenter.deptDesc || taskBasedScheduler.costCenter.wbtName }}</h3></p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div task-list-calendar\n" +
    "                 cost-center=\"taskBasedScheduler.costCenter\"\n" +
    "                 week-ending-date=\"taskBasedScheduler.weekEndingDate\"\n" +
    "                 class=\"row\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <div associate-list\n" +
    "                    cost-center=\"taskBasedScheduler.costCenter\"\n" +
    "                    date=\"taskBasedScheduler.weekEndingDate\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("scheduleSummary/directives/taskListCalendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/directives/taskListCalendar.tpl.html",
    "<div class=\"container-fluid taskListCalendar\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12 taskList\">\n" +
    "            <table>\n" +
    "                <thead>\n" +
    "                    <tr class=\"header\">\n" +
    "                        <td class=\"headerTaskName\">task</td>\n" +
    "                        <td class=\"headerStartTime\">start</td>\n" +
    "                        <td class=\"headerEndTime\">end</td>\n" +
    "                        <td class=\"headerTotalHours\">total</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[0] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[1] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[2] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[3] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[4] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[5] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                        <td class=\"headerDayOfWeek\">{{ ::taskListCalendar.daysOfWeek[6] | date : taskListCalendar.dayOfWeekHeaderFormat }}</td>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                    <tr class=\"tasks\" ng-repeat=\"task in taskListCalendar.tasks\">\n" +
    "                        <td class=\"taskName\">{{ ::task.Name }}</td>\n" +
    "                        <td class=\"startTime\">{{ ::task.taskStartTime | getTime }}</td>\n" +
    "                        <td class=\"endTime\">{{ ::task.taskEndTime | getTime }}</td>\n" +
    "                        <td class=\"totalHours\">{{ ::task | taskTotalHours }}</td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,0)\"\n" +
    "                            day-number=\"0\">\n" +
    "                        </td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,1)\"\n" +
    "                            day-number=\"1\">\n" +
    "                        </td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,2)\"\n" +
    "                            day-number=\"2\">\n" +
    "                        </td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,3)\"\n" +
    "                            all-assignments=\"taskListCalendar.assignments\"\n" +
    "                            day-number=\"3\">\n" +
    "                        </td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,4)\"\n" +
    "                            all-assignments=\"taskListCalendar.assignments\"\n" +
    "                            day-number=\"4\">\n" +
    "                        </td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,5)\"\n" +
    "                            day-number=\"5\">\n" +
    "                        </td>\n" +
    "                        <td class=\"dayOfWeek\"\n" +
    "                            assignment-calendar-cell\n" +
    "                            task=\"task\"\n" +
    "                            assignments=\"taskListCalendar.getAssignmentsForDay(task,6)\"\n" +
    "                            day-number=\"6\">\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("scheduleSummary/schedule-summary.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/schedule-summary.tpl.html",
    "<div class=\"scheduleSummary\">\n" +
    "    <h2>{{ 'SCHEDULE_SUMMARY.TITLE' | translate}}</h2>\n" +
    "    <div>\n" +
    "        <tabset>\n" +
    "            <tab heading=\"{{'SCHEDULE_SUMMARY.TABS.TASK_BASED'| translate}}\"\n" +
    "                 ui-sref=\"scheduleSummary.taskBased\"\n" +
    "                 active =\"scheduleSummary.tabState\"\n" +
    "                 ui-sref-active=\"active\">\n" +
    "            </tab>\n" +
    "            <tab heading=\"{{'SCHEDULE_SUMMARY.TABS.OLD'| translate}}\"\n" +
    "                 ui-sref=\"scheduleSummary.oldScheduler\"\n" +
    "                 active =\"scheduleSummary.tabState\"\n" +
    "                 ui-sref-active=\"active\">\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "        <div class=\"tab-view\">\n" +
    "            <div ui-view></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("scheduleSummary/tab1.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/tab1.tpl.html",
    "<div class=\"content\">\n" +
    "    <div task-based-scheduler></div>\n" +
    "</div>");
}]);

angular.module("scheduleSummary/tab2.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scheduleSummary/tab2.tpl.html",
    "<div class=\"content\">\n" +
    "    <div old-scheduler></div>\n" +
    "</div>");
}]);

angular.module('templates.common', ['directives/costCenterTypeahead/costCenterTypeahead.tpl.html', 'directives/footer/appFooter.tpl.html', 'directives/gridPagination/gridPagination.tpl.html', 'directives/header/appHeader.tpl.html']);

angular.module("directives/costCenterTypeahead/costCenterTypeahead.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/costCenterTypeahead/costCenterTypeahead.tpl.html",
    "<div class=\"costCenterTypeAhead\">\n" +
    "    <input type=\"search\"\n" +
    "           class=\"form-control\"\n" +
    "           placeholder=\"{{ 'COMMON.SEARCH' | translate }}\"\n" +
    "           autocomplete=\"off\"\n" +
    "           ng-model=\"typeaheadCtrl.searchPhrase\"\n" +
    "           ng-change=\"typeaheadCtrl.searchCostCenter(typeaheadCtrl.searchPhrase)\"\n" +
    "           ng-model-options=\"{debounce:500}\">\n" +
    "        <div class=\"caretContainer\" ng-click=\"typeaheadCtrl.toggleDropDown()\">\n" +
    "            <span class=\"caret\"></span>\n" +
    "        </div>\n" +
    "    </input>\n" +
    "\n" +
    "    <div ng-class=\"{'show-dropdown': typeaheadCtrl.showDropDownList, 'hide-dropdown': !typeaheadCtrl.showDropDownList}\">\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"list in typeaheadCtrl.dropdownList\" ng-click=\"typeaheadCtrl.selected(list)\">\n" +
    "                {{ list | formatCostCenter }}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"loadingAnimation\" ng-show=\"typeaheadCtrl.lookupsPending > 0\"></div>\n" +
    "\n" +
    "        <hr />\n" +
    "\n" +
    "        <div grid-pagination=\"typeaheadCtrl.datasource\"\n" +
    "             results=\"typeaheadCtrl.getResults()\"\n" +
    "             request-params=\"typeaheadCtrl.getRequestParams()\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("directives/footer/appFooter.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/footer/appFooter.tpl.html",
    "<div class=\"container-fluid\">\n" +
    "    <span class=\"copyright\" translate=\"{{ 'MAIN.COPYRIGHT '}}\"></span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("directives/gridPagination/gridPagination.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/gridPagination/gridPagination.tpl.html",
    "<div class=\"paginationControls\">\n" +
    "    <div class=\"controls\">\n" +
    "        <button ng-disabled=\"!paginationController.previousEnabled\" ng-click=\"paginationController.goFirst()\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>\n" +
    "            <span class=\"glyphicon glyphicon-chevron-left secondChevron\" aria-hidden=\"true\"></span>\n" +
    "        </button>\n" +
    "        <button ng-disabled=\"!paginationController.previousEnabled\" ng-click=\"paginationController.goPrevious()\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>\n" +
    "        </button>\n" +
    "        {{ paginationController.currentPage }} of {{ paginationController.pageCount }}\n" +
    "        <button ng-disabled=\"!paginationController.nextEnabled\" ng-click=\"paginationController.goNext()\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\n" +
    "        </button>\n" +
    "        <button ng-disabled=\"!paginationController.nextEnabled\" ng-click=\"paginationController.goLast()\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\n" +
    "            <span class=\"glyphicon glyphicon-chevron-right secondChevron\" aria-hidden=\"true\"></span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"totalRecords\">\n" +
    "        Displaying {{ paginationController.startRow }}-{{ paginationController.endRow}} of {{ paginationController.totalResults }}\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("directives/header/appHeader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/header/appHeader.tpl.html",
    "<div class=\"container-fluid\">\n" +
    "    <div class=\"row\">\n" +
    "        <h3>{{ 'MAIN.TITLE' | translate }}</h3>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
