(function() {
	angular.module('appponto').controller('HojeCtrl', function($rootScope, $location){
		
		$rootScope.page = $location.path();

	});
})();