(function() {
	angular.module('appponto').controller('DialtimeCtrl', function($scope, $rootScope, Tool){
			
		$scope.globalization = $rootScope.globalization;

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

			$scope.edit = false;
		}

		function atualizarHoras(day){

			var podeSalvar = true;

			// Atualiza com os valores do scopo
			if ($scope.index == undefined){
				
				// Puxa a hora para dentro do array
				$rootScope.itensLocal[day].horas.push($scope.horas + ":" + $scope.minutos + ":00");

			}else{

				// Beleza, vamos ver a hora é menor que a key anterior
				if ($rootScope.itensLocal[day].horas[$scope.index - 1] != undefined)
				{
					if (Tool.isHoraInicialMenorHoraFinal($scope.horas + ":" + $scope.minutos, $rootScope.itensLocal[day].horas[$scope.index - 1])){
						console.log("Hora não pode ser MENOR que o checkin anterior");
						podeSalvar = false;
					}
				}

				// Beleza, vamos ver a hora é maior que a key superior
				if ($rootScope.itensLocal[day].horas[$scope.index + 1] != undefined)
				{
					if (Tool.isHoraInicialMenorHoraFinal($rootScope.itensLocal[day].horas[$scope.index + 1], $scope.horas + ":" + $scope.minutos)){
						console.log("Hora não pode ser MAIOR que o checkin superior");
						podeSalvar = false;
					}
				}

				// Podemos salvar Arnaldo César Coelho?
				if (podeSalvar)
				{
					console.log("Pode salvar");
					$rootScope.itensLocal[day].horas[$scope.index] = $scope.horas + ":" + $scope.minutos + ":00"; // Segundos não importam
				}
			}

		}

		this.salvar = function(){

			if ($scope.conf !== undefined){
				
				// Seta
	    		$rootScope.configs.week[$scope.index] = $scope.horas + ":" + $scope.minutos;

	    		// Grava
	    		localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

		    	// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');

			}else{				

				time = $scope.horas + ":" + $scope.minutos;

				// Verifica se existe essa data dentro do objeto
				if ($rootScope.today in $rootScope.itensLocal){

						// Manda atualizar :D
						atualizarHoras($rootScope.today);

				}else{
					// Se não tinha nenhum item, esse é o primeiro registro
					$rootScope.itensLocal[$rootScope.today] = {'horas':[time], 'saldo':0, 'total':0, 'end':0, 'sms':0, 'dinner':0};
				}

		    	// Re-salvo no local
		    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
				
				// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');
			}
		}
	});
})();