(function(){

	angular.module('appponto').directive('dinner', function(){
		return {
			restrict: 'E',
			templateUrl: 'app/views/template/dialogDinner.html',
			controller: 'DinnerCtrl',
			controllerAs: 'dinner'
		};
	});
		
})();