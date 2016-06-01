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
