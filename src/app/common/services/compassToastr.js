angular.module("common.services.compassToastr", ['ngToast'])
    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide'
        });
    }])

    .service('compassToastr', ['ngToast', function (ngToast) {
        this.warning = function(message) {
            ngToast.create({
                className: 'danger',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 10000,
                animation: 'slide'
            });
        };

        this.success = function(message) {
            ngToast.create({
                className: 'success',
                content: message,
                dismissButton: true,
                dismissOnTimeout: true,
                timeout: 3000,
                animation: 'slide'
            });
        };
    }]);
