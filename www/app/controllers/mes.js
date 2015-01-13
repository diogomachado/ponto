(function() {
	angular.module('appponto').controller('MesCtrl', function($location, $rootScope){
		$rootScope.page = $location.path();
	});
})();