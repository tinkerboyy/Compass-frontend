/**
 * Created by Madhukar on 7/9/15.
 */
'use strict';

describe("testing the directive: scheduleSummary.services.ScheduleAssociatesService", function () {
    var ScheduleAssociatesService, rootScope, $httpBackend, API_PREFIX, deferred,  serviceApi;
    var url = API_PREFIX + 'cg/user/schedule/associates?_dc=1436387555800&userId=3&teamId=10663&weekEndDate=07%2F09%2F2015&payGroupId=10005&subteams=y&page=1&start=0&limit=25&group=%7B"property"%3A"jobDesc"%2C"direction"%3A"ASC"%7D&sort=%5B%7B"property"%3A"jobDesc"%2C"direction"%3A"ASC"%7D%5D';

    beforeEach(module('myStaffScheduler.serviceConstants'));
    beforeEach(module('scheduleSummary.service.ScheduleAssociatesServices'));

    beforeEach(function() {
        serviceApi = {
            getAllAssociates: function () {
                deferred = q.defer();

                return deferred.promise;
            },
            getMockMessageCount: function (searchPhrase) {
                return $q.when(72);
            }

        };
    });

    beforeEach(inject(function($http, _$httpBackend_, $q, ScheduleAssociatesService, $rootScope, _API_PREFIX_) {
        serviceApi = ScheduleAssociatesService;
        rootScope = $rootScope;
        $httpBackend = _$httpBackend_;
        API_PREFIX = _API_PREFIX_;
    }));

    it('should exist', function() {
        expect(ScheduleAssociatesService).exist;
    });


    it('should get Array of associates', function() {
        $httpBackend.when('GET', url).respond(200);

        serviceApi.getAllAssociates()
            .then(function(response) {
                expect(response).isDefined;
            });

    });


});
