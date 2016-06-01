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
