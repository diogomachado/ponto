(function() {
	angular.module('appponto').controller('SemanaCtrl', function($location, $scope, $rootScope){
		
		$rootScope.page = $location.path();
		$scope.objsemana = [];
		
		// Representação escrita de dias
		dias_semana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

		// Pego dia de hoje e a hora atual
		today = $rootScope.today;
		time  = $rootScope.time;

		// Variaveis usadas para contar
		var totalHora = 0;
		var totalMinutos = 0;
		var restoTotalHoras = 0;
		var restoTotalMinutos = 0;
		var totalExecutado = 0;

		function formatar(day){
			
			var dd = day.getDate();
			var mm = day.getMonth()+1; //January is 0!
			var yyyy = day.getFullYear();

			if(dd<10) {
			  dd='0'+dd
			} 

			if(mm<10) {
			  mm='0'+mm
			}

			return dd+'/'+mm+'/'+yyyy;
		}

		function formatarHora(h){
			
			if (h <= 0){
				
				return "00:00";

			}else{

				horas = parseInt(h/60);
				minutos = h%60;

				if (minutos > 60){	
					restoMinutos = minutos % 60;
					minutos = minutos + restoMinutos;
				}

				if (horas < 9){
					horas = "0"+horas;
				}

				if (minutos < 9){
					minutos = "0"+minutos;
				}

				return horas + ":" + minutos;
			}
		}

			
		// ----------------------------------------------------------------
		// Instancio um obj data atual
		var dt = new Date();

		if ($rootScope.itensLocal[formatar(dt)].horas.length != 0)
		{
			// Capturo o número do dia (vai de 0..6) começando 0 por domingo
			var dayNumber = dt.getDay();

			// Capturo o dia mesmo (1..31)
			var day = dt.getDate();

			// Agora acho o primeiro dia da semana
			dt.setDate(day - (dayNumber-1));

			n = dayNumber;

			// Agora eu vou percorrer a semana
			while(n <= 7)
			{
				var day = dt.getDate(); // Atualiza day

				console.log(formatar(dt));
				// Verifica se está nos objetos salvos
				if (formatar(dt) in $rootScope.itensLocal){

					var saldo = parseInt($rootScope.itensLocal[formatar(dt)].saldo);
					var total = parseInt($rootScope.itensLocal[formatar(dt)].total);

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

					if (horas < 9){
						horas = "0"+horas;
					}

					if (minutos < 9){
						minutos = "0"+minutos;
					}
					// ---------------------------------

					// Crio objeto com as informações
					objsemana = { 	'dia'            : formatar(dt).substr(0,5),
								 	'diaNumero'      : dias_semana[dt.getDay()],
									'totalTrabalhado': $rootScope.itensLocal[formatar(dt)].total,
									'saldo'          : saldo,
									'saldoFmt'       : horas + ":" + minutos };

					// Adiciono no array
					$scope.objsemana.push(objsemana);

				}

				dt.setDate(day + 1); // Seta próxima data
				n++; // Incrementa
				horas = 0;
				minutos = 0;
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

			if (totalMinutos >= 60)
			{
				totalHora = totalMinutos/60;
				totalMinutos = totalMinutos % 60;
			}

			if (totalHora < 9){
				totalHora = "0"+totalHora;
			}

			if (totalMinutos < 9){
				totalMinutos = "0"+totalMinutos;
			}

			$scope.totalExecutado = formatarHora(totalExecutado);
			$scope.saldoTotalFmt = totalHora + ":" + totalMinutos;
		}

	});
})();