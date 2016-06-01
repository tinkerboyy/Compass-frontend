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
