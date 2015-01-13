(function() {
	angular.module('appponto').controller('ConfCtrl', function($location, $rootScope){
		$rootScope.page = $location.path();
	});
})();