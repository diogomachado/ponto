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

			// Atualiza com os valores do scopo
			if ($scope.index == undefined){

				// Puxa a hora para dentro do array
				$rootScope.itensLocal[day].horas.push((parseInt($scope.horas) * 60) + parseInt($scope.minutos));

			}else{
				$rootScope.itensLocal[day].horas[$scope.index] = (parseInt($scope.horas) * 60) + parseInt($scope.minutos); // Segundos não importam
			}

			// Reordenar as horas
			$rootScope.itensLocal[day].horas = $rootScope.itensLocal[day].horas.sort(function(a, b){return a-b});

		}

		this.salvar = function(){

			if ($scope.conf !== undefined){

				// Agora define que configurou
				$rootScope.configs.default = 1;

				// Seta
	    		$rootScope.configs.week[$scope.index] = (parseInt($scope.horas) * 60) + parseInt($scope.minutos);

	    		console.log("Atualizar");

	    		// Grava
	    		localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

		    	// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');

			}else{

				time = (parseInt($scope.horas) * 60) + parseInt($scope.minutos);

				($scope.data != undefined) ? dataSelecionada = $scope.data : dataSelecionada = $rootScope.today;

				// Verifica se existe essa data dentro do objeto
				if (dataSelecionada in $rootScope.itensLocal){

						// Manda atualizar :D
						atualizarHoras(dataSelecionada);

				}else{
					// Se não tinha nenhum item, esse é o primeiro registro
					$rootScope.itensLocal[dataSelecionada] = {'horas':[time], 'end':0, 'sms':0, 'dinner':0};
				}

		    	// Re-salvo no local
		    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));

				// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');
			}
		}
	});
})();