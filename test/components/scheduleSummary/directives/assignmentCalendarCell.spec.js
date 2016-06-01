describe('scheduleSummary.directive.AssignmentCalendarCell', function () {
    var scope,
        tasksService,
        assignmentCalendarCellController,
        sourceItemHandleScope,
        destSortableScope;

    beforeEach(function () {
        module('scheduleSummary.directive.AssignmentCalendarCell');
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            tasksService = {};
            assignmentCalendarCellController = $controller("AssignmentCalendarCell", {$scope:scope, TasksService:tasksService});
        });
    });

    beforeEach(function() {
        sourceItemHandleScope = {
            itemScope: {
                sortableScope: {
                    $id: 1
                }
            }
        };

        destSortableScope = {
            $id: 1
        };

        scope.task = {wbTeamId: "99999"};
    });

    it('controller should be defined', function() {
        expect(assignmentCalendarCellController).toBeDefined();
    });

    it('should not be able to drop self id onto self', function() {
        expect(assignmentCalendarCellController.dropOptions.accept(sourceItemHandleScope, destSortableScope)).toBe(false);
    });

    it('should be able to drop onto a different scope', function() {
        destSortableScope.$id = 2;
        expect(assignmentCalendarCellController.dropOptions.accept(sourceItemHandleScope, destSortableScope)).toBe(true);
    });

    it("should be unable to drop onto a different scope, if it's a reserved team id", function() {
        destSortableScope.$id = 2;
        scope.task.wbTeamId = null;
        expect(assignmentCalendarCellController.dropOptions.accept(sourceItemHandleScope, destSortableScope)).toBe(false);
    });
});
