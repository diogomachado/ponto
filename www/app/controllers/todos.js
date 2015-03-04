(function() {
	angular.module('appponto').controller('TodosCtrl', function($scope, $location, $rootScope){
		$rootScope.page = $location.path();
		$scope.checkpoints = {};

		// Variavel apenas de apoio
		var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

		// Faz um loop
		angular.forEach($rootScope.itensLocal, function(value, key){

			// Verifica o mes
			mes = parseInt(key.substr(3,2)) - 1;

			value.dia = key;

			if ($scope.checkpoints[meses[mes]] !== undefined){
				$scope.checkpoints[meses[mes]].push(value);
			}else{
				$scope.checkpoints[meses[mes]] =[value];
			}

		});
	});
})();