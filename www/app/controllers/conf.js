(function() {
	angular.module('appponto').controller('ConfCtrl', function($location, $scope, $rootScope){
		$rootScope.page = $location.path();

		// Horas marcadas, para exibir no conf
		$scope.semana = $rootScope.configs.week;

		// Verifica se os botões estão ativos
		if ($rootScope.configs.dinner.active == 1){
			$scope.active_dinner = true; // Desativa visualmente
		}else{
			$scope.active_dinner = false; // Ativa visualmente
		}
			
		if ($rootScope.configs.end == 1){
			$scope.active_end = true; // Desativa visualmente
		}else{
			$scope.active_end = false; // Ativa visualmente
		}


		this.configurar = function(index){

			// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas = $rootScope.configs.week[index].substr(0,2);
			$scope.minutos = $rootScope.configs.week[index].substr(3,2);

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;

	    	// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');
	    }

	    // Notificações
		this.dinner = function(){

			if ($rootScope.configs.dinner.active == 1){
				
				$rootScope.configs.dinner.active = 0; // Desativa
				$scope.active_dinner = false; // Desativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}else{

				$rootScope.configs.dinner.active = 1; // Desativa
				$scope.active_dinner = true; // Ativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}

		}
		
		this.end = function(){
			
			if ($rootScope.configs.end == 1){
				
				$rootScope.configs.end = 0; // Desativa
				$scope.active_end = false; // Desativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}else{

				$rootScope.configs.end = 1; // Desativa
				$scope.active_end = true; // Ativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}

		}
		
		this.sms = function(){

			if ($rootScope.configs.sms.active == 1){
				
				$rootScope.configs.sms.active = 0; // Desativa
				$scope.active_sms = false; // Desativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}else{

				$rootScope.configs.sms.active = 1; // Desativa
				$scope.active_sms = true; // Ativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}
		}
	});
})();