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
