(function() {
	angular.module('appponto').controller('TodosCtrl', function($scope, $location, $rootScope){
		$rootScope.page = $location.path();

		// Itens para mostrar na view
		$scope.checkpoints = $rootScope.itensLocal;

	});
})();