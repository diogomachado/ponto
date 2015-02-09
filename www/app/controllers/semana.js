(function() {
	angular.module('appponto').controller('SemanaCtrl', function($location, $scope, $rootScope){
		
		$rootScope.page = $location.path();
		$scope.objsemana = {};
		var totalHora = 0;
		var totalMinutos = 0;
		var restoTotalHoras = 0;
		var restoTotalMinutos = 0;

		// Representação escrita de dias
		dias_semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

		// Retorna a hora de agora
		function now(){
			
			var today = new Date();

			var H = today.getHours();
			var i = today.getMinutes();
			var s = today.getSeconds();

			if(H<10) {
			  H='0'+H
			}

			if(i<10) {
			  i='0'+i
			}

			if(s<10) {
			  s='0'+s
			}

			return H + ':' + i + ':' + s;
		}

		// Retorna o dia de hoje
		function day(){
			
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

			return dd+'/'+mm+'/'+yyyy;
		}

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

		this.calcularSaldo = function(saldo){

			return 100;

		}

		today = day();
		time  = now();

		// ----------------------------------------------------------------
		// Instancio um obj data atual
		var dt = new Date();

		// Capturo o número do dia (vai de 0..6) começando 0 por domingo
		var dayNumber = dt.getDay();

		// Capturo o dia mesmo (1..31)
		var day = dt.getDate();

		// Agora acho o primeiro dia da semana
		dt.setDate(day - (dayNumber-1));
		console.log(formatar(dt));

		n = dayNumber + 1;

		// Agora eu vou percorrer a semana
		while(n < 6)
		{
			var day = dt.getDate(); // Atualiza day

			// Verifica se está nos objetos salvos
			if (formatar(dt) in $rootScope.itensLocal){

				saldo = $rootScope.itensLocal[formatar(dt)].saldo;

				// Divido para achar as horas
				// ---------------------------------
				horas = parseInt(saldo/60);

				if (horas < 0){
					horas = horas * -1;
				}

				minutos = saldo%60 * -1;

				if (minutos < 0){
					minutos = minutos * -1;
				}

				if (minutos > 60){	
					restoMinutos = minutos % 60;
					minutos = minutos + restoMinutos;
				}
				// ---------------------------------

				// Crio objeto com as informações
				$scope.objsemana = [{
										'dia': formatar(dt).substr(0,5),
										'diaNumero': dias_semana[dt.getDay()],
										'totalTrabalhado': $rootScope.itensLocal[formatar(dt)].total,
										'saldo': $rootScope.itensLocal[formatar(dt)].saldo,
										'saldoFmt': horas + ":" + minutos
									}];

				totalHora = totalHora + horas;
				totalMinutos = totalMinutos + minutos;
			}

			// Horas que ficaram nos minutos totais
			if (totalMinutos > 60){	
				restoTotalHoras = parseInt(totalMinutos/60);
				totalMinutos = totalMinutos % 60;
			}


			$scope.saldoTotalFmt = (totalHora + restoTotalHoras) + ":" + totalMinutos;

			dt.setDate(day + 1); // Seta próxima data
			n++; // Incrementa
		}
		// ----------------------------------------------------------------

	});
})();