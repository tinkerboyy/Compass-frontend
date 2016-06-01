describe('common.directives.footer: appFooter', function () {
    var element, scope;

    beforeEach(function () {
        module('directives.appFooter');
        module('HTMLTemplates');

        inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = angular.element('<footer app-footer></footer>');
            $compile(element)(scope);
            scope.$digest();
        });
    });

    it('footer should have a copyright class', function () {
        var result = element[0].querySelectorAll('.copyright');
        expect(angular.element(result).hasClass('copyright')).toBeDefined();
    });
});
