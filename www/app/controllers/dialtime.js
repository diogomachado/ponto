(function() {
	angular.module('appponto').controller('DialtimeCtrl', function($scope, $rootScope){
			
		$scope.$watch('horas', function(){

			// A hora chega aqui como string, então transformo ela em int antes de trabalhar
			$scope.horas = parseInt($scope.horas);

			if(parseInt($scope.horas) < 10) {
			  $scope.horas = '0' + $scope.horas;
			}			

		});

		$scope.$watch('minutos', function(){

			// A hora chega aqui como string, então transformo ela em int antes de trabalhar
			$scope.minutos = parseInt($scope.minutos);

			if(parseInt($scope.minutos) < 10) {
			  $scope.minutos = '0' + $scope.minutos;
			}			

		});

		this.aumentarHora = function(){

			// Limite 24 horas
			if ($scope.horas < 23){
				$scope.horas++;
			}else{
				$scope.horas = 0;
			}
		}

		this.diminuirHora = function(){

			// Limite 00 horas
			if ($scope.horas > 1){
				$scope.horas--;
			}else if ($scope.horas == 0){
				$scope.horas = 23;
			}else{
				$scope.horas = 0;
			}
		}

		this.aumentarMinuto = function(){

			// Limite 24 horas
			if ($scope.minutos < 59){
				$scope.minutos++;
			}else{
				$scope.minutos = 0;
			}
		}

		this.diminuirMinuto = function(){

			// Limite 00 horas
			if ($scope.minutos > 1){
				$scope.minutos--;
			}else if ($scope.minutos == 0){
				$scope.minutos = 59;
			}else{
				$scope.minutos = 0;
			}
		}

		this.fechar = function(){

			// Remove todos show
	    	angular.element(document.querySelectorAll('.menu-box')).removeClass('show');
			
			// Retiro a janela de exibir
			angular.element(document.querySelector('#dialog')).removeClass('show');
		}

		this.salvar = function(){

			if ($scope.conf !== undefined){
				
				// Seta
	    		$rootScope.configs.semana[$scope.index] = $scope.horas + ":" + $scope.minutos; // TESTE

	    		// Grava
	    		localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

		    	// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');

			}else{				

				// Pega o dia de hoje
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();

				if(dd<10) {
				  dd='0'+dd
				} 

				if(mm<10) {
				  mm='0'+mm
				} 

				day = dd+'/'+mm+'/'+yyyy;

				// Atualiza com os valores do scopo
				if ($scope.index == undefined){
					
					// Puxa a hora para dentro do array
					$rootScope.itensLocal[day].horas.push($scope.horas + ":" + $scope.minutos + ":00");

				}else{

					$rootScope.itensLocal[day].horas[$scope.index] = $scope.horas + ":" + $scope.minutos + ":00"; // Segundos não importam

				}

		    	// Re-salvo no local
		    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
				
				// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');

			}
		}

	});
})();