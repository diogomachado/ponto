(function() {
	angular.module('appponto').controller('TodosCtrl', function($scope, $location, $rootScope){
		$rootScope.page = $location.path();
		$scope.checkpoints = {};

		// Faz um loop
		angular.forEach($rootScope.itensLocal, function(value, key){

			// Verifica o mes
			mes = parseInt(key.substr(3,2));
			console.log(value + " Mês: " + mes);

			$scope.checkpoints[mes] = $rootScope.itensLocal[value];

		});

		// Itens para mostrar na view
		// $scope.checkpoints = $rootScope.itensLocal;

		var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

	});
})();