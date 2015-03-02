(function() {
	angular.module('appponto').controller('TodosCtrl', function($scope, $location, $rootScope){
		$rootScope.page = $location.path();

		// Itens para mostrar na view
		$scope.checkpoints = $rootScope.itensLocal;

		var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

		this.mes = function(data){

			mes = parseInt(data.substr(3,2)) - 1;

			return meses[mes];

		}

	});
})();