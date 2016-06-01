'use strict';

describe("testing the directive: resourceAllocation.directive.WeeklySearch'", function () {
    var weeklySearchController,
        apiService,
        rootScope,
        scope,
        service;
    var pageSize = 25;
    var payGroups = [
        {
            id: "Fri-Thurs Hourly",
            name: "Fri-Thurs Hourly",
            weekEndDay: 4
        }, {
            id: "Sun-Sat Hourly",
            name: "Sun-Sat Hourly",
            weekEndDay: 6
        }];

    var mockData = {"total":8895,"data":[{"schedId":-618005,"deptName":"6799","deptId":"81521","deptDesc":"","wbtName":" 6799 HERITAGE","wbtDesc":"Front of House","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-597556,"deptName":"20352","deptId":"80200","deptDesc":"","wbtName":"#20352 - BANQUET","wbtDesc":"Front of House staff","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-579548,"deptName":"20352","deptId":"80201","deptDesc":"","wbtName":"#20352 - COFFEE SRVC","wbtDesc":"Coffee Service Staff","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-525406,"deptName":"20352","deptId":"80199","deptDesc":"","wbtName":"#20352 - KITCHEN","wbtDesc":"Kitchen & Utility Staff","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-579527,"deptName":"20352","deptId":"80218","deptDesc":"","wbtName":"#20352 COFF ON CALL","wbtDesc":"On Call Coffee Service","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-453670,"deptName":"20352","deptId":"80219","deptDesc":"","wbtName":"#20352-BANQ ON CALL","wbtDesc":"BQT On Call","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-636677,"deptName":"20352","deptId":"84525","deptDesc":"","wbtName":"#20352-I BLDG","wbtDesc":"I BLDG Catering","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-671068,"deptName":"20352","deptId":"80792","deptDesc":"","wbtName":"#20352-UTILITY","wbtDesc":"Housseins staff","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-705427,"deptName":"22593","deptId":"80204","deptDesc":"","wbtName":"#22594 - C BLDG","wbtDesc":"Catering staff at C Bldg","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-456898,"deptName":"22686","deptId":"85007","deptDesc":"","wbtName":"041-AMS","wbtDesc":"Athens Middle School","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-700413,"deptName":"10011","deptId":"41760","deptDesc":"Dell Computers AO1","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-666599,"deptName":"1003","deptId":"60485","deptDesc":"Albany Academy","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":13426848,"deptName":"10031","deptId":"12335","deptDesc":"University of Missouri Rolla","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":253.7,"forcastAmount":2263.73,"clientId":1,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":13426848,"teamActiveNewSched":"Y"},{"schedId":-678674,"deptName":"10031","deptId":"94287","deptDesc":"","wbtName":"10031 - BAKERY","wbtDesc":"Bakery","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-429707,"deptName":"10031","deptId":"17581","deptDesc":"","wbtName":"10031-CATERING","wbtDesc":"Catering","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-513424,"deptName":"10031","deptId":"88906","deptDesc":"","wbtName":"10031-COYOTE JACKS","wbtDesc":"Rustic Range","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-591616,"deptName":"10031","deptId":"17577","deptDesc":"","wbtName":"10031-EINSTEINS","wbtDesc":"Einsteins","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":13426846,"deptName":"10031","deptId":"17569","deptDesc":"","wbtName":"10031-FOODCOURT","wbtDesc":"Foodcourt","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":13426846,"teamActiveNewSched":"Y"},{"schedId":-681400,"deptName":"10031","deptId":"17526","deptDesc":"","wbtName":"10031-KITCHEN","wbtDesc":"Kitchen","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-645794,"deptName":"10031","deptId":"17580","deptDesc":"","wbtName":"10031-OUTTAKES","wbtDesc":"Outakes","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-429712,"deptName":"10031","deptId":"17578","deptDesc":"","wbtName":"10031-TJ","wbtDesc":"TJ","teamTypeId":10007,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-574049,"deptName":"10035","deptId":"18642","deptDesc":"Dow Jones 1","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":"Y"},{"schedId":-592462,"deptName":"10047","deptId":"38222","deptDesc":"Amex Salt Lake City","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-430585,"deptName":"1005","deptId":"38742","deptDesc":"Honeywell","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null},{"schedId":-448384,"deptName":"10050","deptId":"38226","deptDesc":"Amex TRCN Phoenix","wbtName":"","wbtDesc":"","teamTypeId":10005,"paygrpId":10005,"weekEndDate":1435204800000,"actualHours":0.0,"actualAmount":0.0,"schedHours":0.0,"schedAmount":0.0,"forcastHours":0.0,"forcastAmount":0.0,"clientId":null,"wbuId":3,"sraSummaryNoOfMealsSched":0,"sraSummaryNoOfMealsActual":0,"sraSummaryProdLaborHrsSched":null,"sraSummaryProdLaborHrsActual":null,"sraSummaryNCompassLaborHrsSched":0,"sraSummaryNCompassLaborHrsActual":0,"sraSummaryProductivitySched":0.0,"sraSummaryProductivityActual":0.0,"sraSummaryOTHrsSched":null,"sraSummaryOTHrsActual":null,"sraSummaryNCompassOTHrsSched":0,"sraSummaryNCompassOTHrsActual":0,"sraSummaryFiscalYear":null,"sraSummaryDepartment":null,"sraSummaryCompletedBy":null,"sraSummaryDateCompleted":null,"sraSummaryTargetProd":0.0,"sraSummaryWeekEnding":null,"createdBy":null,"createdDate":null,"createdDateString":"Not yet created","updatedDateString":null,"updatedBy":null,"updateDate":null,"createdByUserName":"Not yet created","updatedByUserName":null,"sraWeeklyMealForecastTotal":null,"completedBy":null,"completedDate":null,"templateSchedId":null,"teamActiveNewSched":null}],"success":true};

    //beforeEach(module("ui.router"));
    beforeEach(module('myStaffScheduler.serviceConstants'));
    beforeEach(module('resourceAllocation.directive.WeeklySearch'));
    beforeEach(module('resourceAllocation.service.ResourceAllocationService'));

    beforeEach(inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
       // var service = ResourceAllocationService;

        apiService = {
            getCostCenters: function() {
                return $q.when(response);
            },

        };

        weeklySearchController = $controller('WeeklySearchController', {$scope: scope, ResourceAllocationService: apiService});
    }));

    it('should exist', function() {
        expect(weeklySearchController).isDefined;
    });

    it('should define grid options', function() {
        expect(weeklySearchController.gridOptions).toBeDefined();
    });

    it('should have payGroups defined before activation,', function() {
        expect(weeklySearchController.payGroups).toBeDefined();
    });

    it('should should fetch maximum results per page', function() {
        expect(pageSize).toEqual(25);
    });

    describe('After Activation: ', function() {
        beforeEach(function() {
            rootScope.$apply();
        });

        it('should have response after activation', function() {
            expect(mockData.total).toBe(8895);
        });

        it('should have data property defined  and is not empty after activation', function() {
            expect(mockData.data.length).toBeGreaterThan(0);
        });

        it('should instantiate pay groups with', function() {
            weeklySearchController.payGroups = payGroups;
            expect(weeklySearchController.payGroups).toEqual(payGroups);
        });

        it('should have payGroups have length after activation,', function() {
            expect(weeklySearchController.payGroups.length).toBeGreaterThan(0);
        });
    });

});
