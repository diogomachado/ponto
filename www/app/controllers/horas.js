(function() {
	angular.module('appponto').controller('HorasCtrl', function($interval, $location, $scope, $rootScope, $routeParams, Tool){
		$rootScope.page = '/horas';

		// Transforma dia
		var dia = $routeParams.dia;
		var dt = dia.replace(/-/g, '/');

		// Importantissimo para saber qual data está visualizando e editando
		$scope.data = dt;

		// Atribui a data aberta, para mostrar na view
		$rootScope.dia_inner = dt;

		// Variaveis comuns
		$scope.saldoBase = $rootScope.configs.week[Tool.dia0a6()];
		$scope.saldoFinal = -(parseInt($scope.saldoBase.substr(0,2)) * 60) + parseInt($scope.saldoBase.substr(3,2));

		// Itens para mostrar na view
		$scope.checkpoints = $rootScope.itensLocal[dt].horas;

		// Calculo quanto tempo de almoço
		if ($rootScope.itensLocal[dt].horas.length >= 3){
			$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[dt].horas[1].substr(0,5),$rootScope.itensLocal[dt].horas[2].substr(0,5));
		}

		// Atualiza a cada 1s
		// :::::::::::::::::::::::::::::::::::::::::::::
		$interval(function(){
			$scope.horasTrabalhadas = Tool.calcular(dt);
			atualiza_saldo();
		}, 1000);
		// :::::::::::::::::::::::::::::::::::::::::::::

		function atualiza_saldo(){

			// Se data de hoje está no array
        	if (dt in $rootScope.itensLocal){

				// Aqui eu vejo se o saldo foi positivo ou negativo
	        	trabalhou      = (parseInt($scope.horasTrabalhadas.substr(0,2)) * 60) + (parseInt($scope.horasTrabalhadas.substr(3,2)));
	        	tinhaTrabalhar = (parseInt($scope.saldoBase.substr(0,2)) * 60) + (parseInt($scope.saldoBase.substr(3,2)));

	        	// Acho o saldo final
	        	$scope.saldoFinal = trabalhou - tinhaTrabalhar;
	        	$scope.saldo = Tool.formatarHora($scope.saldoFinal);
	        	console.log("Saldo final: "+$scope.saldoFinal);

	        	// Atualiza o que já trabalhou
	    		// $rootScope.itensLocal[dt].total = trabalhou;

		        // Atualiza o saldo na view e no localStorage
	        	// $scope.saldo = Tool.diferencaHoras($scope.horasTrabalhadas, $scope.saldoBase);
	        	// $rootScope.itensLocal[dt].saldo = $scope.saldoFinal;

	        	// Salva local
				localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
        	}

		}

		// Manda calcular com o dia
		$scope.horasTrabalhadas = Tool.calcular(dt);

		// Definindo métodos globais para serem acessados pelos controllers
	    this.salvarData = function(){
	    				
			$rootScope.checkLocal();

			// Verifica se existe essa data dentro do objeto
			if (dt in $rootScope.itensLocal){

				// Beleza, adiciona a hora (antes verifico se existe)
				if ($rootScope.itensLocal[dt].horas.indexOf($rootScope.time) == -1){
					
					if ($rootScope.itensLocal[dt].horas.length === 0){	

						// Puxa a hora para dentro do array
						$rootScope.itensLocal[dt].horas.push($rootScope.time);

					}else{						

						// Variavel de ajuda
						inicio = $rootScope.time.substr(0,5);
						fim = $rootScope.itensLocal[dt].horas[($rootScope.itensLocal[dt].horas.length - 1)].substr(0,5);

						if (!(Tool.isHoraInicialMenorHoraFinal(inicio, fim)) && (inicio !== fim)){
							
							// Puxa a hora para dentro do array
							$rootScope.itensLocal[dt].horas.push($rootScope.time);

						}else{
							console.log("Você tentou adicionar uma data menor que o último checkin");
						}
					}
				}

				// Itens para mostrar na view
				$scope.checkpoints = $rootScope.itensLocal[dt].horas;

			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[dt] = {'horas':[$rootScope.time], 'saldo':0, 'total':0, 'end':0, 'sms':0, 'dinner':0};
			}

			atualiza_saldo();

			// Salvo as alterações no localStorage
			localStorage.setItem("ponto-horarios", angular.toJson($rootScope.itensLocal));
	    }

	    this.deletar = function(checkpoint){

	    	// Remove do array
	    	$rootScope.itensLocal[dt].horas.splice(checkpoint, 1);

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
			$scope.horas = $rootScope.itensLocal[dt].horas[index].substr(0,2);
			$scope.minutos = $rootScope.itensLocal[dt].horas[index].substr(3,2);

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