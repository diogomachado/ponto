(function() {
	angular.module('appponto').controller('HojeCtrl', function($scope, $rootScope, $location, Tool){
		
		$rootScope.page = $location.path();
		$rootScope.checkpoints = [];

		$scope.editar = false;

		// ------------------------------------------------------------------------
		$scope.saldoBase = $rootScope.configs.week[Tool.dia0a6()];
		$scope.saldo = $rootScope.configs.week[Tool.dia0a6()]; // Será decrementado
		$scope.horasTrabalhadas = "00:00";
		$scope.horaIr = false;
		$scope.saldoFinal = -(parseInt($scope.saldoBase.substr(0,2)) * 60) + parseInt($scope.saldoBase.substr(3,2));
		// ------------------------------------------------------------------------

		// Pego dia de hoje e a hora atual
		today = $rootScope.today;
		time  = $rootScope.time;

		// "Escuto" toda mudança em itensLocal e faça uma atualização nos dados
		$rootScope.$watchCollection('itensLocal["'+ today + '"].horas', function(){

			// Verifica se existe essa data dentro do objeto
	      	if (today in $rootScope.itensLocal){

				// Itens para mostrar na view
	        	$scope.checkpoints = $rootScope.itensLocal[today].horas;

	        	// Se existir a primeira hora marcada
				if ($rootScope.itensLocal[today].horas[0] !== undefined){

					if ($rootScope.itensLocal[today].horas.length === 1){

						// Reseto as horas trabalhadas porque eu tenho que pensar tb na exclusão
						$scope.horasTrabalhadas = "00:00";

						// Calcula a diferença de horas com a hora de agora (time)
						diferenca = Tool.diferencaHoras($rootScope.itensLocal[today].horas[0].substr(0,5), time.substr(0,5));

						// Soma as horas com a diferença
						$scope.horasTrabalhadas = Tool.somaHora($scope.horasTrabalhadas, diferenca);

						$rootScope.itensLocal[today].total = $scope.horasTrabalhadas;

					// Acabou de sair para almoçar
					// ---------------------------------------------------------------------------
					}else{

						if ($rootScope.itensLocal[today].horas.length === 2){

							horaVoltarConf = $rootScope.configs.dinner.hour + ':' + $rootScope.configs.dinner.minutes;

							// Calculo a hora que tem que voltar do almoço baseado no tempo configurado
							horaVoltar = Tool.somaHora(horaVoltarConf,$rootScope.itensLocal[today].horas[1]);

							// Crio um array com horas e minutos
							var arrayHoraVoltar = horaVoltar.split(':');

							// Verifico se posso criar uma schedule para avisar saida
							// -------------------------------------------------
							if ($rootScope.configs.dinner.active == 1 && $rootScope.itensLocal[today].dinner == 0){

								// Crio um objeto date
								var d = new Date();

								// Pego hora e minutos
								horasVoltar = parseInt(arrayHoraVoltar[0]);
								minutosVoltar = parseInt(arrayHoraVoltar[1]) - $rootScope.itensLocal[today].dinner.minutesbefore; // Pode ser (15, 10, 5) é definido na configuracao

								// Atualizo o objeto
								d.setHours(horasVoltar,minutosVoltar);

								// Defino um alarme programado para 10 minutos antes de dar aquela hora
								window.plugin.notification.local.add({
								    id:      2,
								    title:   'Intervalo terminando',
								    message: 'Horário de almoço termina em ' + $rootScope.configs.dinner.minutesbefore + ' minutos',
								    date:    d,
								    sound: 'TYPE_ALARM'
								});

								$rootScope.itensLocal[today].dinner = 1; // Pronto, já marcou, agora chega

								// Salva local
								localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
							}
						}
					
						// Verifica o intervalo de almoço
						// -------------------------------------------------
						if ($rootScope.itensLocal[today].horas.length >= 3){
							
							// Calculo quanto tempo de almoço
							$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[today].horas[1].substr(0,5),$rootScope.itensLocal[today].horas[2].substr(0,5));

						}
						
						if ($rootScope.itensLocal[today].horas.length > 1){
							
							// Faço um loop pelos checkpoints
							angular.forEach($rootScope.itensLocal[today].horas, function(value, key){
								
								// verifica se é par
								if (key % 2 == 0){
									
									// verifica se existe o proximo elemento
									if ($rootScope.itensLocal[today].horas[key + 1] !== undefined)
									{
										// Calcula a diferença de horas
										diferenca = Tool.diferencaHoras($rootScope.itensLocal[today].horas[key].substr(0,5), $rootScope.itensLocal[today].horas[key + 1].substr(0,5));

									}else{

										diferenca = Tool.diferencaHoras($rootScope.itensLocal[today].horas[key].substr(0,5), time.substr(0,5));
									
									}

									// Se as horas trabalhadas estão zeradas
									if ($scope.horasTrabalhadas !== "00:00"){

										if (key ===0){

											$scope.horasTrabalhadas = diferenca;	

										}else{

											$scope.horasTrabalhadas = Tool.somaHora($scope.horasTrabalhadas, diferenca);
											
										}

									}else{

										// Soma as horas com a diferença
										$scope.horasTrabalhadas = Tool.somaHora($scope.horasTrabalhadas, diferenca);

									}

									$rootScope.itensLocal[today].total = $scope.horasTrabalhadas;
								}
							});
						}
					}
				}else{

					// Inicializando dados
					// ------------------------------------------------------------------------
					$scope.saldoBase = $rootScope.configs.week[Tool.dia0a6()]; 
					$scope.saldo = $rootScope.configs.week[Tool.dia0a6()]; // Será decrementado
					$scope.horasTrabalhadas = "00:00";
					$scope.horaIr = false;
					$scope.saldoFinal = -(parseInt($scope.saldoBase.substr(0,2)) * 60) + parseInt($scope.saldoBase.substr(3,2));
					// ------------------------------------------------------------------------
					
					// Zera saldo e total do dia
					$rootScope.itensLocal[today].saldo = 0;
					$rootScope.itensLocal[today].total = 0;

				}

	        	// Aqui eu vejo se o saldo foi positivo ou negativo
	        	trabalhou = (parseInt($scope.horasTrabalhadas.substr(0,2)) * 60) + (parseInt($scope.horasTrabalhadas.substr(3,2)));
	        	tinhaTrabalhar = (parseInt($scope.saldoBase.substr(0,2)) * 60) + (parseInt($scope.saldoBase.substr(3,2)));

	        	// Acho o saldo final
	        	$scope.saldoFinal = trabalhou - tinhaTrabalhar;

	        	// Atualiza o que já trabalhou
        		$rootScope.itensLocal[today].total = trabalhou;

		        // Atualiza o saldo
	        	$scope.saldo = Tool.diferencaHoras($scope.horasTrabalhadas, $scope.saldoBase);
	        	$rootScope.itensLocal[today].saldo = $scope.saldoFinal;

	        	// Calculo da hora de ir
				if ($rootScope.itensLocal[today].horas.length === 3){
					
					// Passo a exibir a hora de ir
					$scope.horaIr = true;

					// Aqui eu calculo a hora de ir
					$scope.horasHoraIr = Tool.somaHora(time.substr(0,5), $scope.saldo, true);

					// Calculo quanto tempo de almoço
					$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[today].horas[1].substr(0,5),$rootScope.itensLocal[today].horas[2].substr(0,5));

					// Crio um array com horas e minutos
					var horas = $scope.horasHoraIr.split(':');

					// Verifico se posso criar uma schedule para avisar saida
					// -------------------------------------------------
					if ($rootScope.itensLocal[today].end == 0 && $rootScope.configs.end == 1){

						// Crio um objeto date com as horas de sair
						var d = new Date();
						d.setHours(parseInt(horas[0]),parseInt(horas[1]));

						// Agora vamos notificar o cara na hora de ir
						window.plugin.notification.local.add({
						    id:      1,
						    title:   'Hora de ir',
						    message: 'Seu dia de trabalho se encerrou, você já pode ir!',
						    date:    d
						});

						$rootScope.itensLocal[today].end = 1; // Pronto, já agendou, agora chega

						// Salva local
						localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
					}
					// -------------------------------------------------

					// Verifico se já mandei sms
					// -------------------------------------------------
					if ($rootScope.itensLocal[today].sms == 0 && $rootScope.configs.sms.active == 1){
						
						// Prepara mensagem
						var messageInfo = {
						    phoneNumber: $rootScope.configs.sms.number,
						    textMessage: "Estou liberado hoje as " + $scope.horasHoraIr
						};

						// Envio um SMS para mozão
						sms.sendMessage(messageInfo, function(message) {
						    console.log("success: " + message);
						}, function(error) {
						    console.log("code: " + error.code + ", message: " + error.message);
						});
						// -------------------------------------------------

						$rootScope.itensLocal[today].sms = 1; // Pronto, já mandou sms, agora chega

						// Salva local
						localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
					}

				}else{
					$scope.horaIr = false;
				}

				// Salvo tudo que eu fiz dentro de itensLocal no storage
				localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
	        }

		});

		// Definindo métodos globais para serem acessados pelos controllers
	    this.salvarData = function(){
	    	
	    	today = $rootScope.today;
			time  = $rootScope.time;
			
			$rootScope.checkLocal();

			// Verifica se existe essa data dentro do objeto
			if (today in $rootScope.itensLocal){

				// Beleza, adiciona a hora (antes verifico se existe)
				if ($rootScope.itensLocal[today].horas.indexOf(time) == -1){
					
					if ($rootScope.itensLocal[today].horas.length === 0){	

						// Puxa a hora para dentro do array
						$rootScope.itensLocal[today].horas.push(time);

					}else{						

						// Variavel de ajuda
						inicio = time.substr(0,5);
						fim = $rootScope.itensLocal[today].horas[($rootScope.itensLocal[today].horas.length - 1)].substr(0,5);

						if (!(Tool.isHoraInicialMenorHoraFinal(inicio, fim)) && (inicio !== fim)){
							
							// Puxa a hora para dentro do array
							$rootScope.itensLocal[today].horas.push(time);

						}else{
							console.error("Você tentou adicionar uma data menor que o último checkin");
						}
					}
				}

				// Itens para mostrar na view
				$scope.checkpoints = $rootScope.itensLocal[today].horas;

			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[today] = {'horas':[time], 'saldo':0, 'total':0, 'end':0, 'sms':0, 'dinner':0};
			}

			// Salvo as alterações no localStorage
			localStorage.setItem("ponto-horarios", angular.toJson($rootScope.itensLocal));
	    }

	    this.deletar = function(checkpoint){

	    	// Remove do array
	    	$rootScope.itensLocal[today].horas.splice(checkpoint, 1);

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
			$scope.horas = $rootScope.itensLocal[today].horas[index].substr(0,2);
			$scope.minutos = $rootScope.itensLocal[today].horas[index].substr(3,2);

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