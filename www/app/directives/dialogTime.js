(function(){

	angular.module('appponto').directive('dialtime', function(){
		return {
			restrict: 'E',
			scope: {
				id : '@id',
			},
			templateUrl: 'app/views/template/dialogTime.html'
			// controller: 'MainCtrl',
			// controllerAs: 'main'
		};
	});
		
})();