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

			$scope.edit = false;
		}

		function atualizarHoras(day){
			console.log("Atualizando hora!");
			// Atualiza com os valores do scopo
			if ($scope.index == undefined){
				
				// Puxa a hora para dentro do array
				$rootScope.itensLocal[day].horas.push($scope.horas + ":" + $scope.minutos + ":00");

			}else{
				$rootScope.itensLocal[day].horas[$scope.index] = $scope.horas + ":" + $scope.minutos + ":00"; // Segundos não importam
			}

		}

		this.salvar = function(){

			if ($scope.conf !== undefined){
				
				// Seta
	    		$rootScope.configs.semana[$scope.index] = $scope.horas + ":" + $scope.minutos;

	    		// Grava
	    		localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

		    	// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');

			}else{				

				today = $rootScope.today;
				time = $scope.horas + ":" + $scope.minutos;

				// Verifica se existe essa data dentro do objeto
				if (today in $rootScope.itensLocal){
					
					// Só deixa salvar se a hora for maior que a ultima
					if ($rootScope.itensLocal[today].horas.length === 0){	

						// Puxa a hora para dentro do array
						atualizarHoras(today);

					}else{						
						
						// Se tiver mais que 3 registros
						if ($rootScope.itensLocal[today].horas.length >= 2){

							// Variavel de ajuda
							inicio = time.substr(0,5);

							// Se for edição de uma hora, então eu pego o penultimo item, e não o último para comparar
							if ($scope.edit === true){
								fim = $rootScope.itensLocal[today].horas[($rootScope.itensLocal[today].horas.length - 2)].substr(0,5);
							}else{
								fim = $rootScope.itensLocal[today].horas[($rootScope.itensLocal[today].horas.length - 1)].substr(0,5);
							}

							// Verifico se pode cadastrar a hora, se ela não é menor que o ultimo checkin
							if (!(isHoraInicialMenorHoraFinal(inicio, fim)) && (inicio !== fim)){
								// Puxa a hora para dentro do array
								atualizarHoras(today);
							}else{
								console.error("Você tentou adicionar uma data menor que o último checkin");
							}

						}else{
							
							// Puxa a hora para dentro do array
							atualizarHoras(today);
						}
					}

				}else{
					// Se não tinha nenhum item, esse é o primeiro registro
					$rootScope.itensLocal[today] = {'horas':[time], 'saldo':0, 'total':0};
				}

		    	// Re-salvo no local
		    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
				
				// Retiro a janela de exibir
				angular.element(document.querySelector('#dialog')).removeClass('show');

			}
		}

		/**
		 * Verifica se a hora inicial é menor que a final.
		 */
		function isHoraInicialMenorHoraFinal(horaInicial, horaFinal){
			horaIni = horaInicial.split(':');
		    horaFim = horaFinal.split(':');

			// Verifica as horas. Se forem diferentes, é só ver se a inicial 
			// é menor que a final.
			hIni = parseInt(horaIni[0], 10);
			hFim = parseInt(horaFim[0], 10);
			if(hIni != hFim)
				return hIni < hFim;
			
			// Se as horas são iguais, verifica os minutos então.
		    mIni = parseInt(horaIni[1], 10);
			mFim = parseInt(horaFim[1], 10);
			if(mIni != mFim)
				return mIni < mFim;
		}

	});
})();