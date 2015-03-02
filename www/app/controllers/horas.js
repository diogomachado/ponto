(function() {
	angular.module('appponto').controller('HorasCtrl', function($location, $scope, $rootScope, $routeParams){
		$rootScope.page = '/horas';

		// Transforma dia
		var dia = $routeParams.dia;
		var d = dia.replace(/-/g, '/');

		// Itens para mostrar na view
		$scope.checkpoints = $rootScope.itensLocal[d].horas;

	});
})();