(function() {
	angular.module('appponto').controller('SemanaCtrl', function($location, $rootScope){
		$rootScope.page = $location.path();
	});
})();