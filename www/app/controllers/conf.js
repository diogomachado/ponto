(function() {
	angular.module('appponto').controller('ConfCtrl', function($location, $scope, $rootScope){
		$rootScope.page = $location.path();

		// Horas marcadas, para exibir no conf
		$scope.semana = $scope.horas = $rootScope.configs.semana;

		this.configurar = function(index){

			// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas = $rootScope.configs.semana[index].substr(0,2);
			$scope.minutos = $rootScope.configs.semana[index].substr(3,2);

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;

	    	// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');
	    }
	});
})();