(function() {
	angular.module('appponto').controller('HojeCtrl', function($scope, $rootScope, $location){
		
		$rootScope.page = $location.path();

		// Inicializando
		$scope.saldoBase = "08:48"; // Não pode ser mudado, vem das configurações
		$scope.saldo = "08:48"; // Será decrementado
		$scope.horasTrabalhadas = "00:00";
		$scope.horaIr = false;
		$scope.saldoFinal = -9000;


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

		today = day();
		time  = now();

		// Atualiza total executado
		if (today in $rootScope.itensLocal){
			// Primeira verificação de horas trabalhadas
			if ($rootScope.itensLocal[today][0] !== undefined){

				if ($rootScope.itensLocal[today].length === 1){
					// Calcula a diferença de horas
					diferenca = diferencaHoras($rootScope.itensLocal[today][0].substr(0,5), time.substr(0,5));
					$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);
				}else{
					angular.forEach($rootScope.itensLocal[today], function(value, key){
						
						// verifica se é par
						if (key % 2 == 0){
							// verifica se existe o proximo elemento
							if ($rootScope.itensLocal[today][key + 1] !== undefined)
							{
								// Calcula a diferença de horas
								diferenca = diferencaHoras($rootScope.itensLocal[today][key].substr(0,5), $rootScope.itensLocal[today][key + 1].substr(0,5));

								// Se as horas trabalhadas estão zeradas
								if ($scope.horasTrabalhadas == "00:00"){
									$scope.horasTrabalhadas = diferenca;	
								}else{
									// Soma as horas com a diferença
									$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);
								}
							}
						}
					});
				}
			}
		}

		atualizar();

		function atualizar(){

			// Verifica se existe essa data dentro do objeto
	      	if (today in $rootScope.itensLocal){
				// Itens para mostrar na view
	        	$scope.checkpoints = $rootScope.itensLocal[today];

	        	// Se tem 4 registros ou mais
		        if ($rootScope.itensLocal[today].length >= 1)
		        {
		        	// Aqui eu vejo se o saldo foi positivo ou negativo
		        	trabalhou = (parseInt($scope.horasTrabalhadas.substr(0,2)) * 60) + (parseInt($scope.horasTrabalhadas.substr(3,2)));
		        	tinhaTrabalhar = (parseInt($scope.saldoBase.substr(0,2)) * 60) + (parseInt($scope.saldoBase.substr(3,2)));

		        	$scope.saldoFinal = trabalhou - tinhaTrabalhar;
		        }

	        	$scope.saldo = diferencaHoras($scope.horasTrabalhadas, $scope.saldoBase);
	        }
		}

		// Definindo métodos globais para serem acessados pelos controllers
	    this.salvarData = function(){

	    	// atualiza dia e hora
	      	today = day();
			time  = now();

			$rootScope.checkLocal();

			// Verifica se existe essa data dentro do objeto
			if (today in $rootScope.itensLocal){

				// Beleza, adiciona a hora (antes verifico se existe)
				if ($rootScope.itensLocal[today].indexOf(time) == -1){

					// Se já tenho 3 registros, mostro a hora de ir
					if ($rootScope.itensLocal[today].length === 2){
						$scope.horaIr = true;
					}

					// Puxa a hora para dentro do array
					$rootScope.itensLocal[today].push(time);
				}

				// Itens para mostrar na view
				$scope.checkpoints = $rootScope.itensLocal[today];

			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[today] = [time];        
			}

			atualizar();

			// Atualiza total executado
			if (today in $rootScope.itensLocal){
				// Primeira verificação de horas trabalhadas
				if ($rootScope.itensLocal[today][0] !== undefined){

					if ($rootScope.itensLocal[today].length === 1){
						// Calcula a diferença de horas
						diferenca = diferencaHoras($rootScope.itensLocal[today][0].substr(0,5), time.substr(0,5));
						$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);
					}else{
						angular.forEach($rootScope.itensLocal[today], function(value, key){
							
							// verifica se é par
							if (key % 2 == 0){
								// verifica se existe o proximo elemento
								if ($rootScope.itensLocal[today][key + 1] !== undefined)
								{
									// Calcula a diferença de horas
									diferenca = diferencaHoras($rootScope.itensLocal[today][key].substr(0,5), $rootScope.itensLocal[today][key + 1].substr(0,5));

									// Se as horas trabalhadas estão zeradas
									if ($scope.horasTrabalhadas == "00:00"){
										$scope.horasTrabalhadas = diferenca;	
									}else{
										// Soma as horas com a diferença
										$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);
									}
								}
							}
						});
					}
				}
			}

			// Salvo as alterações no localStorage
			localStorage.setItem("ponto-horarios", angular.toJson($rootScope.itensLocal));
	      
	    }

	    this.deletar = function(checkpoint){

	    	// Remove do array
	    	$rootScope.itensLocal[today].splice(checkpoint, 1);

	    	var itens = $rootScope.itensLocal;

	    	// Re-salvo no local
	    	localStorage.setItem("ponto-horarios", JSON.stringify(itens));

	    	atualizar();
	    }


	    /**
		 * Realiza os cálculos dos horários, com base nas horas informadas.
		 */
		function calculaHoras(){
			
			// valores inseridos
			totalHorasDia = "08:48"; // Default ainda
			
			// Entrada e saida
			horaEntrada = $("#horaEntrada").val();
			horaIdaAlmoco = $("#horaIdaAlmoco").val();
			horaVoltaAlmoco = $("#horaVoltaAlmoco").val();	
			horaSaida = $("#horaSaida").val();	
			
			// Limpa os campos calculados
			$("#diferencaPrimeiroTurno").html('');
			$("#tempoRestante").html('');
			$("#horaSaidaMinima").html('');
			$("#saldoHoras").html('');
			
			if( possuiValor(horaEntrada) && possuiValor(horaIdaAlmoco) ) {
				
				// Calcula o intervalo entre a entrada e o almoco
				diffEntradaAlmoco = diferencaHoras( horaEntrada, horaIdaAlmoco );
				$("#diferencaPrimeiroTurno").html(diffEntradaAlmoco);
				
				if( possuiValor(totalHorasDia) ){
				
					// A partir do tempo que ja passou entre a entrada e o almoco,
					// calcula o tempo que falta para completar o total de horas do dia
					tempoRestante = diferencaHoras( diffEntradaAlmoco, totalHorasDia);
					$("#tempoRestante").html(tempoRestante);
					
					if( possuiValor(horaVoltaAlmoco) ){
					
						// Calcula, a partir da hora do retorno do almoço e do tempo restante
						// para completar as horas, qual o horário ideal para ir embora
						horaSaidaCerta = somaHora(horaVoltaAlmoco, tempoRestante);
						$("#horaSaidaMinima").html(horaSaidaCerta);
						
						if( possuiValor(horaSaida) ){
					
							// Caso a pessoa vá embora antes ou depois do horário ideal, calcula
							// o tempo q mais ou a menos que ela trabalhou do total que ela devia
							// trabalhar
							saldoHoras = diferencaHoras(horaSaidaCerta, horaSaida);
							$("#saldoHoras").html(saldoHoras);
							
							// Se ela ficou tempo a mais, o saldo é positivo; se a pessoa
							// saiu mais cedo do que devia, o saldo é negativo
							if( isHoraInicialMenorHoraFinal(horaSaida, horaSaidaCerta) )
								$("#saldoHoras").html("-"+ $("#saldoHoras").html());
						}
					}
				}
			}
		}

		/**
		* Código fonte: http://www.sistemaseweb.com.br/computacaoemfoco/CalculadorHoras.html
		* Retona a diferença entre duas horas.
		* Exemplo: 14:35 a 17:21 = 02:46
		* Adaptada de http://stackoverflow.com/questions/2053057/doing-time-subtraction-with-jquery
		*/
		function diferencaHoras(horaInicial, horaFinal) {

			// Tratamento se a hora inicial é menor que a final	
			if( ! isHoraInicialMenorHoraFinal(horaInicial, horaFinal) ){
			 	aux = horaFinal;
				horaFinal = horaInicial;
				horaInicial = aux;
			}

		    hIni = horaInicial.split(':');
		    hFim = horaFinal.split(':');

			horasTotal = parseInt(hFim[0], 10) - parseInt(hIni[0], 10);
			minutosTotal = parseInt(hFim[1], 10) - parseInt(hIni[1], 10);
			
		    if(minutosTotal < 0){
		        minutosTotal += 60;
		        horasTotal -= 1;
		    }
			
		    horaFinal = completaZeroEsquerda(horasTotal) + ":" + completaZeroEsquerda(minutosTotal);
		    return horaFinal;
		}

		/**
		* Soma duas horas.
		* Exemplo:  12:35 + 07:20 = 19:55.
		*/
		function somaHora(horaInicio, horaSomada) {
			
		    horaIni = horaInicio.split(':');
		    horaSom = horaSomada.split(':');

		    horasTotal = parseInt(horaIni[0], 10) + parseInt(horaSom[0], 10);
			minutosTotal = parseInt(horaIni[1], 10) + parseInt(horaSom[1], 10);
			
		    if(minutosTotal >= 60){
		        minutosTotal -= 60;
		        horasTotal += 1;
		    }
			
		    horaFinal = completaZeroEsquerda(horasTotal) + ":" + completaZeroEsquerda(minutosTotal);
		    return horaFinal;
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

		/**
		 * Verifica se o usuário informou todos os campos da hora (hh:mm).
		 */
		function preencheuHoraCompleta( horario ){
			var hora = horario.replace(/[^0-9:]/g ,''); // deixa só números e o ponto
			return hora.length == 5;
		}

		/**
		 * Verifica se a hora é válidas. Exemplo: 12:34 é válido, 03:89 é inválido.
		 */
		function isHoraValida( horario ) {
			var regex = new RegExp("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$");
			return regex.exec( horario ) != null;
		}

		/**
		 * Verifica se um campo está vazio.
		 */
		function possuiValor( valor ){
			return valor != undefined && valor != '';
		}

		/**
		 * Completa um número menor que dez com um zero à esquerda.
		 * Usado aqui para formatar as horas... Exemplo: 3:10 -> 03:10 , 10:5 -> 10:05
		 */
		function completaZeroEsquerda( numero ){
			return ( numero < 10 ? "0" + numero : numero);
		}





	});
})();