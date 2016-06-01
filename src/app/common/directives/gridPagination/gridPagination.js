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
