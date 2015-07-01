(function() {
	angular.module('appponto').controller('TodosCtrl', function($scope, $location, $rootScope, Tool){
		$rootScope.page = $location.path();
		$scope.checkpoints = {};

		// Variavel apenas de apoio
		meses = $rootScope.globalization.meses;

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

		this.converter = function(v){
			return Tool.converter(v);
		}
	});
})();