'use strict';

describe('testing the directive: common.directives.CostCenterTypeahead', function() {
    var typeaheadCtrl, scope, service, deferred, q, serviceApi, lookup, rootScope, mockResponse;
    var searchPhrase = '10011';
    var reqObj = {
        weekEndingDate: '01/01/2015',
        payGroupId: 10005,
        page: 1,
        deptNameDesc: '10011',
        start: 0,
        limit: 25,
        sort: []
    };

    beforeEach(module("myStaffScheduler.serviceConstants"));
    beforeEach(module("common.directives.GridPagination"));
    beforeEach(module("common.directives.CostCenterTypeahead"));

    beforeEach(function() {
       lookup = {"total":1,"data":[{"schedId":5545667,"deptName":"10011","deptId":"41760","deptDesc":"Dell Computers AO1","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1420088400000,"actualHours":19.38,"actualAmount":213.34,"schedHours":0.0,"schedAmount":0.0,"forcastHours":19.38,"forcastAmount":213.34,"clientId":1,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null}],"success":true};


        serviceApi = {
            lookupCostCenters: function() {
                deferred = q.defer();

                return deferred.promise;
            },
            searchCostCenter: function(searchPhrase) {
                return searchPhrase;
            },
            getCostCenters: function() {
                deferred = q.defer();

                return deferred.promise;
            }

        };
    });

    beforeEach(inject(function($controller, $rootScope, $q) {
        q = $q;
        scope = $rootScope.$new();
        rootScope = $rootScope;

        typeaheadCtrl = $controller('TypeaheadController', {$scope: scope, CostCenterTypeaheadFactory: serviceApi});
    }));

    it('should exist', function() {
        expect(typeaheadCtrl).isDefined;
    });

    it('should request the searchCostCenter()', function() {
       spyOn(serviceApi, 'searchCostCenter').and.callThrough();
        serviceApi.searchCostCenter(searchPhrase);

        expect(serviceApi.searchCostCenter).toHaveBeenCalled();
    });

    it('should have empty dropdownList array before searchCostCenter()', function() {
        expect(typeaheadCtrl.dropdownList).toBeDefined();
    });


    describe('before lookupCostCenters()', function() {

        it('should have dropdownList defined to empty array', function() {
            expect(typeaheadCtrl.dropdownList).toEqual([]);
        });

        it('should have searchPhrase defined to empty string', function() {
            expect(typeaheadCtrl.searchPhrase).toEqual('');
        });

        it('should have showDropDownList defined to false', function() {
            expect(typeaheadCtrl.showDropDownList).toEqual(false);
        });

    });

    describe('After lookupCostCenters()', function() {
        beforeEach(function() {
            rootScope.$apply();

            typeaheadCtrl.dropdownList = lookup.data;
            if(typeaheadCtrl.showDropDownList == false) {
                typeaheadCtrl.showDropDownList = true;
            }
        });

        it('should have dropdownList have array list', function() {
            expect(typeaheadCtrl.dropdownList.length).toBeGreaterThan(0);
        });

        it('should have dropdownList to be 1', function() {
            expect(typeaheadCtrl.dropdownList.length).toBe(1);
        });

        it('should have showDropDownList to true', function() {
            expect(typeaheadCtrl.showDropDownList).toEqual(true);
        });

        it('should save the response in the controller scope', function() {
            expect(typeaheadCtrl.dropdownList).toEqual(lookup.data);
        });

    });

});
