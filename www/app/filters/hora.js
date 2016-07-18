(function() {
    angular.module('appponto').filter('horaPt', function(Tool){

        return function(input) {
            return Tool.formatarHora(input);;
        }
    });
})();