(function() {
	angular.module('appponto').controller('SemanaCtrl', function($location, $scope, $rootScope, Tool){
		
		$rootScope.page = $location.path();
		$scope.objsemana = [];

		function calcular(){

			// Variaveis usadas para contar
			var totalHora = 0;
			var totalMinutos = 0;
			var restoTotalHoras = 0;
			var restoTotalMinutos = 0;
			var totalExecutado = 0;
			$scope.objsemana = [];

			// ----------------------------------------------------------------
			// Instancio um obj data atual
			var dt = new Date();

			// Capturo o número do dia (vai de 0..6) começando 0 por domingo
			var dayNumber = dt.getDay() - 1;

			// Capturo o dia mesmo (1..31)
			var day = dt.getDate();

			// Agora acho o primeiro dia da semana
			dt.setDate(day - dayNumber);

			n = 1;

			// Agora eu vou percorrer a semana
			while(n <= 7)
			{
				var day = dt.getDate(); // Atualiza day
				var horas = 0;
				var minutos = 0;

				console.log(Tool.formatarDia(dt));

				// Verifica se está nos objetos salvos
				if (Tool.formatarDia(dt) in $rootScope.itensLocal){

					if ($rootScope.itensLocal[Tool.formatarDia(dt)].horas.length != 0){

						var saldo = parseInt($rootScope.itensLocal[Tool.formatarDia(dt)].saldo);
						var total = parseInt($rootScope.itensLocal[Tool.formatarDia(dt)].total);

						totalExecutado += total;

						// Divido para achar as horas
						// ---------------------------------
						horas = parseInt(saldo/60);
						minutos = saldo%60;

						// Calcula o total
						totalHora = totalHora + horas;
						totalMinutos = totalMinutos + minutos;

						// Muda sinal caso seja positivo
						if (horas < 0){
							horas = horas * -1;
						}

						if (minutos < 0){
							minutos = minutos * -1;
						}

						if (minutos > 60){	
							restoMinutos = minutos % 60;
							minutos = minutos + restoMinutos;
						}

						if (horas <= 9){
							horas = "0"+horas;
						}

						if (minutos <= 9){
							minutos = "0"+minutos;
						}
						// ---------------------------------

						diaUrl = Tool.formatarDia(dt);
						var re = new RegExp('/', 'g');
						var diaUrl = diaUrl.replace(re, '-');

						// Crio objeto com as informações
						objsemana = { 	'dia'            : Tool.formatarDia(dt).substr(0,5),
						                'diaUrl'         : diaUrl,
									 	'diaNumero'      : $rootScope.globalization.dias[dt.getDay()],
									 	'diaKey'         : Tool.formatarDia(dt),
										'totalTrabalhado': $rootScope.itensLocal[Tool.formatarDia(dt)].total,
										'saldo'          : saldo,
										'saldoFmt'       : horas + ":" + minutos };

						// Adiciono no array
						$scope.objsemana.push(objsemana);
					}
				}

				dt.setDate(day + 1); // Seta próxima data
				n++; // Incrementa
			}

			// ----------------------------------------------------------------
			
			// Horas que ficaram nos minutos totais
			if (totalMinutos > 60){	
				restoTotalHoras = parseInt(totalMinutos/60);
				totalMinutos = totalMinutos % 60;
			}

			// Soma o total com o resto das horas
			totalHora = totalHora + restoTotalHoras;

			// Saldo total em int
			$scope.saldoTotal = (totalHora * 60) + totalMinutos;

			// Muda sinal caso seja positivo
			if (totalHora < 0){
				totalHora = totalHora * -1;
			}

			if (totalMinutos < 0){
				totalMinutos = totalMinutos * -1;
			}

			// Se o total de minutos for maior que 60, extraimos as horas
			if (totalMinutos >= 60)
			{
				totalHora = totalHora + parseInt(totalMinutos/60);
				totalMinutos = totalMinutos % 60;
			}

			// Aqui é apenas para formatação
			if (totalHora <= 9){
				totalHora = "0"+totalHora;
			}

			if (totalMinutos <= 9){
				totalMinutos = "0"+totalMinutos;
			}

			// Seta na view
			$scope.totalExecutado = Tool.formatarHora(totalExecutado);
			$scope.saldoTotalFmt = totalHora + ":" + totalMinutos;
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

			$scope.objsemana.splice(index, 1);
			delete $rootScope.itensLocal[key];

			calcular();

			// Salva local
			localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
		}

	});
})();