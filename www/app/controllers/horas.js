(function() {
	angular.module('appponto').controller('HorasCtrl', function($location, $scope, $rootScope, $routeParams, Tool){
		$rootScope.page = '/horas';

		// Transforma dia
		var dia = $routeParams.dia;
		var d = dia.replace(/-/g, '/');

		// Itens para mostrar na view
		$scope.checkpoints = $rootScope.itensLocal[d].horas;

		if ($rootScope.itensLocal[d].horas.length >= 3){
			// Calculo quanto tempo de almoço
			$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[d].horas[1].substr(0,5),$rootScope.itensLocal[d].horas[2].substr(0,5));
		}

	});
})();