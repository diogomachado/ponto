(function() {
	angular.module('appponto').controller('HorasCtrl', function($location, $scope, $rootScope, $routeParams, Tool){
		$rootScope.page = '/horas';

		// Transforma dia
		var dia = $routeParams.dia;
		var d = dia.replace(/-/g, '/');

		$rootScope.dia_inner = d;

		// Itens para mostrar na view
		$scope.checkpoints = $rootScope.itensLocal[d].horas;

		if ($rootScope.itensLocal[d].horas.length >= 3){
			// Calculo quanto tempo de almoço
			$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[d].horas[1].substr(0,5),$rootScope.itensLocal[d].horas[2].substr(0,5));
		}

		// Definindo métodos globais para serem acessados pelos controllers
	    this.salvarData = function(){
	    				
			$rootScope.checkLocal();

			// Verifica se existe essa data dentro do objeto
			if ($rootScope.today in $rootScope.itensLocal){

				// Beleza, adiciona a hora (antes verifico se existe)
				if ($rootScope.itensLocal[$rootScope.today].horas.indexOf($rootScope.time) == -1){
					
					if ($rootScope.itensLocal[$rootScope.today].horas.length === 0){	

						// Puxa a hora para dentro do array
						$rootScope.itensLocal[$rootScope.today].horas.push($rootScope.time);

					}else{						

						// Variavel de ajuda
						inicio = $rootScope.time.substr(0,5);
						fim = $rootScope.itensLocal[$rootScope.today].horas[($rootScope.itensLocal[$rootScope.today].horas.length - 1)].substr(0,5);

						if (!(Tool.isHoraInicialMenorHoraFinal(inicio, fim)) && (inicio !== fim)){
							
							// Puxa a hora para dentro do array
							$rootScope.itensLocal[$rootScope.today].horas.push($rootScope.time);

						}else{
							console.log("Você tentou adicionar uma data menor que o último checkin");
						}
					}
				}

				// Itens para mostrar na view
				$scope.checkpoints = $rootScope.itensLocal[$rootScope.today].horas;

			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[$rootScope.today] = {'horas':[$rootScope.time], 'saldo':0, 'total':0, 'end':0, 'sms':0, 'dinner':0};
			}

			// Salvo as alterações no localStorage
			localStorage.setItem("ponto-horarios", angular.toJson($rootScope.itensLocal));
	    }

	    this.deletar = function(checkpoint){

	    	// Remove do array
	    	$rootScope.itensLocal[$rootScope.today].horas.splice(checkpoint, 1);

	    	// Re-salvo no local
	    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
	    }

	    this.novoCheckpoint = function(index){
	    	
	    	var dt = new Date();

	    	// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas = dt.getHours();
			$scope.minutos = dt.getMinutes();

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;
			
			// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');

	    	// Vibra rapidão
	    	navigator.vibrate(50);
	    }

	    this.editar = function(index){

			// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas = $rootScope.itensLocal[$rootScope.today].horas[index].substr(0,2);
			$scope.minutos = $rootScope.itensLocal[$rootScope.today].horas[index].substr(3,2);

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;

	    	// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');
	    }

	    this.abrirMenu = function(index){

	    	$scope.editar = true;

	    	// Remove todos show
	    	angular.element(document.querySelectorAll('.menu-box')).removeClass('show');

	    	// Adiciona classe para aparecer
	    	angular.element(document.querySelector('#menu-box-' + index)).addClass('show');
	    	
	    	// Vibra rapidão
	    	navigator.vibrate(50);
	    }

	});
})();