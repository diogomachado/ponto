(function() {
	angular.module('appponto').controller('TodosCtrl', function($location, $rootScope){
		$rootScope.page = $location.path();
	});
})();