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

		function dayNumber(){
			
			var today = new Date();

			// Retorna o dia (0 a 6)
			return today.getDay();
		}

		today = day();
		time  = now();

		// "Escuto" toda mudança em itensLocal e faça uma atualização nos dados
		$rootScope.$watchCollection('itensLocal["'+ today + '"].horas', function(){

			console.log("Atualizando...");

			// Verifica se existe essa data dentro do objeto
	      	if (today in $rootScope.itensLocal){

				// Itens para mostrar na view
	        	$scope.checkpoints = $rootScope.itensLocal[today].horas;

	        	// Primeira verificação de horas trabalhadas
				// -----------------------------------------------------------------------------------------------------
				if ($rootScope.itensLocal[today].horas[0] !== undefined){

					if ($rootScope.itensLocal[today].horas.length === 1){

						// Reseto as horas trabalhadas porque eu tenho que pensar tb na exclusão
						$scope.horasTrabalhadas = "00:00";

						// Calcula a diferença de horas
						diferenca = diferencaHoras($rootScope.itensLocal[today].horas[0].substr(0,5), time.substr(0,5));
						$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);

					}else{

						// Faço um loop pelos checkpoints
						angular.forEach($rootScope.itensLocal[today].horas, function(value, key){
							
							// verifica se é par
							if (key % 2 == 0){

								// verifica se existe o proximo elemento
								if ($rootScope.itensLocal[today].horas[key + 1] !== undefined)
								{
									console.log(key);

									// Calcula a diferença de horas
									diferenca = diferencaHoras($rootScope.itensLocal[today].horas[key].substr(0,5), $rootScope.itensLocal[today].horas[key + 1].substr(0,5));

									// Se as horas trabalhadas estão zeradas
									if ($scope.horasTrabalhadas !== "00:00"){

										console.log(diferenca);
										console.log($scope.horasTrabalhadas);

										if (key ===0){

											$scope.horasTrabalhadas = diferenca;	

										}else{

											$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);
											
										}

									}else{

										// Soma as horas com a diferença
										$scope.horasTrabalhadas = somaHora($scope.horasTrabalhadas, diferenca);

									}

									$rootScope.itensLocal[today].total = $scope.horasTrabalhadas;
								}
							}
						});
					}
				}else{

					// Reset dos valores
					$scope.saldoBase = "08:48"; // Não pode ser mudado, vem das configurações
					$scope.saldo = "08:48"; // Será decrementado
					$scope.horasTrabalhadas = "00:00";
					$scope.horaIr = false;
					$scope.saldoFinal = -9000;
					$rootScope.itensLocal[today].saldo = 0;
					$rootScope.itensLocal[today].total = 0;

				}
				// -----------------------------------------------------------------------------------------------------

	        	// Se tem 4 registros ou mais
		        if ($rootScope.itensLocal[today].horas.length >= 1)
		        {
		        	// Aqui eu vejo se o saldo foi positivo ou negativo
		        	trabalhou = (parseInt($scope.horasTrabalhadas.substr(0,2)) * 60) + (parseInt($scope.horasTrabalhadas.substr(3,2)));
		        	tinhaTrabalhar = (parseInt($scope.saldoBase.substr(0,2)) * 60) + (parseInt($scope.saldoBase.substr(3,2)));

		        	// Acho o saldo final
		        	$scope.saldoFinal = trabalhou - tinhaTrabalhar;
		        }

		        // Atualiza o saldo
	        	$scope.saldo = diferencaHoras($scope.horasTrabalhadas, $scope.saldoBase);
	        	$rootScope.itensLocal[today].saldo = $scope.saldoFinal;

	        	// Calculo da hora de ir
				if ($rootScope.itensLocal[today].horas.length === 3){
					$scope.horaIr = true;

					// Aqui eu calculo a hora de ir
					$scope.horasHoraIr = somaHora($scope.saldo, $rootScope.itensLocal[today].horas[2].substr(0,5));
				}else{
					$scope.horaIr = false;
				}
	        }

		});

		// Definindo métodos globais para serem acessados pelos controllers
	    this.salvarData = function(){

	    	// atualiza dia e hora
	      	today = day();
			time  = now();

			$rootScope.checkLocal();

			// Verifica se existe essa data dentro do objeto
			if (today in $rootScope.itensLocal){

				// Beleza, adiciona a hora (antes verifico se existe)
				if ($rootScope.itensLocal[today].horas.indexOf(time) == -1){
					
					if ($rootScope.itensLocal[today].horas.length === 0){	

						// Puxa a hora para dentro do array
						$rootScope.itensLocal[today].horas.push(time);

					}else{						

						if (!(isHoraInicialMenorHoraFinal(time, $rootScope.itensLocal[today].horas[($rootScope.itensLocal[today].horas.length - 1)]))){
							
							// Puxa a hora para dentro do array
							$rootScope.itensLocal[today].horas.push(time);
						}
					}
				}

				// Itens para mostrar na view
				$scope.checkpoints = $rootScope.itensLocal[today].horas;

			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[today] = {'horas':[time], 'saldo':0, 'total':0};
			}

			// Salvo as alterações no localStorage
			localStorage.setItem("ponto-horarios", angular.toJson($rootScope.itensLocal));
	    }

	    this.deletar = function(checkpoint){

	    	// Remove do array
	    	$rootScope.itensLocal[today].horas.splice(checkpoint, 1);
	    	// delete $rootScope.itensLocal[today].horas[checkpoint];

	    	// Re-salvo no local
	    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
	    }

	    this.novoCheckpoint = function(index){

	    	var today = new Date();

	    	// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas = today.getHours();
			$scope.minutos = today.getMinutes();

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;
			
			// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');

	    	// Vibra rapidão
	    	navigator.vibrate(50);
	    }

	    this.editar = function(index){

			// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas = $rootScope.itensLocal[today].horas[index].substr(0,2);
			$scope.minutos = $rootScope.itensLocal[today].horas[index].substr(3,2);

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;

	    	// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');
	    }

	    this.abrirMenu = function(index){

	    	// Remove todos show
	    	angular.element(document.querySelectorAll('.menu-box')).removeClass('show');

	    	// Adiciona classe para aparecer
	    	angular.element(document.querySelector('#menu-box-' + index)).addClass('show');
	    	
	    	// Vibra rapidão
	    	navigator.vibrate(50);
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