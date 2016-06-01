describe('common.directives: focusOn', function () {
    var element, scope, timeout;
    beforeEach(function () {
        module('directives.focusOn');
        inject(function ($rootScope, $compile, $timeout) {
            scope = $rootScope.$new();
            timeout = $timeout;
            element = angular.element('<form><input type="text" name="first" /><input type="text" name="second" focus-on="true" /></form>');
            $compile(element)(scope);
            scope.$digest();
        });
    });

    it('should set focus to first autofocus element', function () {
        var input = element.find('input');
        spyOn(input[1],'focus');
        timeout.flush();
        expect(input[1].focus).toHaveBeenCalled();
    });
});
