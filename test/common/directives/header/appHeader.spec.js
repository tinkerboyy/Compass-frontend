describe('common.directives.header: appHeader', function () {
    var element, scope;

    beforeEach(function () {
        module('directives.appHeader');
        module('HTMLTemplates');
        module('pascalprecht.translate');

        inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = angular.element('<header app-header></header>');
            $compile(element)(scope);
            scope.$digest();
        });
    });

    it('header element should contain at least 1 child element', function () {
        var result = element[0];
        expect(result.children.length > 0).toBeTruthy();
    });
});
