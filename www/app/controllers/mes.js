(function() {
	angular.module('appponto').controller('MesCtrl', function($location, $scope, $rootScope, Tool){

		$rootScope.page = $location.path();
		$scope.objmes = [];
		var totalExecutado = 0, saldoTotal = 0;

		sessionStorage.setItem("ponto-redirect", '/mes');

		function calcular(){

			// ----------------------------------------------------------------
			// Instancio um obj data atual
			var dt = new Date();

			// Primeiro dia
			dt.setDate(1);

			// Pego último dia do mês
			var lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
			lastDay = lastDay.getDate();

			// Variavel de apoio while
			n = 1;

			// Agora eu vou percorrer a semana
			while(n <= lastDay)
			{
				var day = dt.getDate(); // Atualiza day
				var horas = 0;
				var minutos = 0;

				// Verifica se está nos objetos salvos
				if (Tool.formatarDia(dt) in $rootScope.itensLocal){

					if ($rootScope.itensLocal[Tool.formatarDia(dt)].horas.length != 0){

						// Percorro calculando o total
						angular.forEach($rootScope.itensLocal[Tool.formatarDia(dt)].horas, function(value, key){

							// verifica se é par
							if (key % 2 == 0){

								// verifica se existe o proximo elemento
								if ($rootScope.itensLocal[Tool.formatarDia(dt)].horas[key + 1] !== undefined)
								{
									// Calcula a diferença de horas
									diferenca = $rootScope.itensLocal[Tool.formatarDia(dt)].horas[key + 1] - $rootScope.itensLocal[Tool.formatarDia(dt)].horas[key];
								}else{

									if (key == 0){
										diferenca = $rootScope.time - $rootScope.itensLocal[Tool.formatarDia(dt)].horas[key];
									}else if($rootScope.itensLocal[Tool.formatarDia(dt)].horas[key + 1] !== undefined){
										diferenca = $rootScope.time - $rootScope.itensLocal[Tool.formatarDia(dt)].horas[key];
									}
								}

								// Calcula as horas trabalhadas
								if (key == 0){
									horasTrabalhadas = diferenca;
								}else if($rootScope.itensLocal[Tool.formatarDia(dt)].horas[key + 1] !== undefined){
									horasTrabalhadas = horasTrabalhadas + diferenca;
								}
							}
						});

						totalExecutado += horasTrabalhadas;
						saldo = horasTrabalhadas - $rootScope.configs.week[Tool.dia0a6()];
						saldoTotal += saldo;

						diaUrl = Tool.formatarDia(dt);
						var re = new RegExp('/', 'g');
						var diaUrl = diaUrl.replace(re, '-');

						// Crio objeto com as informações
						objmes = { 	'dia'            : Tool.formatarDia(dt).substr(0,5),
						                'diaUrl'         : diaUrl,
									 	'diaNumero'      : $rootScope.globalization.dias[dt.getDay()],
									 	'diaKey'         : Tool.formatarDia(dt),
										'totalTrabalhado': horasTrabalhadas,
										'totalTrabalhadoFmt': Tool.converter(horasTrabalhadas),
										'saldo'          : saldo,
										'saldoFmt'       : Tool.converter(saldo)};

						// Adiciono no array
						$scope.objmes.push(objmes);
					}
				}

				dt.setDate(day + 1); // Seta próxima data
				n++; // Incrementa
			}

			// Seta na view
			$scope.totalExecutado = Tool.converter(totalExecutado);
			$scope.saldoTotal     = saldoTotal;
			$scope.saldoTotalFmt  = Tool.converter(saldoTotal);
		}

		calcular();

		this.abrirDia = function(dia){

			$rootScope.dia_inner = dia.replace(/-/g, '/');
			$location.path('/horas/' + dia);
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

		this.deletar = function(index, key){

			$scope.objmes.splice(index, 1);
			delete $rootScope.itensLocal[key];

			calcular();

			// Salva local
			localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
		}

	});
})();