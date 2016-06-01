angular.module('scheduleSummary.directive.AssociateList', [
    'scheduleSummary.services.ScheduleService',
    'common.directives.CostCenterTypeahead'
])
    .controller('AssociateListController', ['$scope', 'ScheduleServices', '$timeout',
        function ($scope, ScheduleServices, $timeout) {
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
                associateListController.associates = ScheduleServices.getAssociates($scope.costCenter.deptId,
                                                                                    costCenter.id,
                                                                                    weekEndingDate);
            }

            $scope.$watchCollection("associateListController.associates", function() {
                associateListController.groupedAssociates = {};

                $timeout(function() {
                    associateListController.groupedAssociates = _.groupBy(associateListController.associates, 'jobDesc');
                }, 1);
            });

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
