describe('common.filters: getTime', function () {
    var element, scope;

    beforeEach(function () {
        module('common.filters.GetTimeFilter');
    });

    it('filter is injectable and exists', inject(function($filter) {
            expect($filter("getTime")).not.toBeNull();
    }));

    it('EDT should return 8:00am', inject(function(getTimeFilter) {
        expect(getTimeFilter(new Date("Mon Jul 20 2015 04:00:00 GMT-0400 (EDT)"))).toBe("8:00 AM");
    }));

    it('UTC should return 8:00am', inject(function(getTimeFilter) {
        expect(getTimeFilter(new Date("Mon Jul 20 2015 08:00:00 GMT-0000 (UTC)"))).toBe("8:00 AM");
    }));

    it('EST should return 8:00am', inject(function(getTimeFilter) {
        expect(getTimeFilter(new Date("Mon Dec 7 2015 03:00:00 GMT-0500 (EST)"))).toBe("8:00 AM");
    }));

    it('should return empty string', inject(function(getTimeFilter) {
        expect(getTimeFilter("")).toBe("");
    }));

});
