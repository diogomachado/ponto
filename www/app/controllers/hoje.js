(function() {
	angular.module('appponto').controller('HojeCtrl', function($scope, $rootScope, $location, Tool, $interval){

		$rootScope.page = $location.path();
		
		$rootScope.checkpoints = [];
		$scope.editar = false;

		$scope.saldoBase        = $rootScope.configs.week[Tool.dia0a6()];
		$scope.saldo            = $rootScope.configs.week[Tool.dia0a6()]; // Será decrementado
		$scope.horasTrabalhadas = "00:00";
		$scope.horaIr           = false;
		$scope.saldoFinal       = -(parseInt($scope.saldoBase.substr(0,2)) * 60) + parseInt($scope.saldoBase.substr(3,2));

		var inicio, fim, diferenca, horaVoltarConf, horas, horaVoltar, horasVoltar, minutosVoltar, trabalhou, tinhaTrabalhar, arrayHoraVoltar;

		// alert(navigator.globalization);

		// Atualiza a cada 15 segundos
		$interval(function(){
			calcular();
			atualiza_saldo();
			console.log("Verifica");
		}, 15000);

		function calcular(){
			// Faço um loop pelos checkpoints
			angular.forEach($rootScope.itensLocal[$rootScope.today].horas, function(value, key){
				
				// verifica se é par
				if (key % 2 == 0){
					
					// verifica se existe o proximo elemento
					if ($rootScope.itensLocal[$rootScope.today].horas[key + 1] !== undefined)
					{
						// Calcula a diferença de horas
						diferenca = Tool.diferencaHoras($rootScope.itensLocal[$rootScope.today].horas[key].substr(0,5), $rootScope.itensLocal[$rootScope.today].horas[key + 1].substr(0,5));

					}else{

						if (key == 0)
						{
							diferenca = Tool.diferencaHoras($rootScope.itensLocal[$rootScope.today].horas[key].substr(0,5), $rootScope.time.substr(0,5));
						}else{
							diferenca = Tool.diferencaHoras($rootScope.itensLocal[$rootScope.today].horas[key].substr(0,5), $rootScope.itensLocal[$rootScope.today].horas[key].substr(0,5));	
						}
					
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

					$rootScope.itensLocal[$rootScope.today].total = $scope.horasTrabalhadas;
				}
			});
		}

		function atualiza_saldo(){

			// Aqui eu vejo se o saldo foi positivo ou negativo
        	trabalhou = (parseInt($scope.horasTrabalhadas.substr(0,2)) * 60) + (parseInt($scope.horasTrabalhadas.substr(3,2)));
        	tinhaTrabalhar = (parseInt($scope.saldoBase.substr(0,2)) * 60) + (parseInt($scope.saldoBase.substr(3,2)));

        	console.log(trabalhou);
        	console.log(tinhaTrabalhar);

        	// Acho o saldo final
        	$scope.saldoFinal = trabalhou - tinhaTrabalhar;
        	console.log($scope.saldoFinal);

        	// Atualiza o que já trabalhou
    		$rootScope.itensLocal[$rootScope.today].total = trabalhou;

	        // Atualiza o saldo
        	$scope.saldo = Tool.diferencaHoras($scope.horasTrabalhadas, $scope.saldoBase);
        	$rootScope.itensLocal[$rootScope.today].saldo = $scope.saldoFinal;
		}

		// "Escuto" toda mudança em itensLocal e faça uma atualização nos dados
		$rootScope.$watchCollection('itensLocal["'+ $rootScope.today + '"].horas', function(){

			// Verifica se existe essa data dentro do objeto
	      	if ($rootScope.today in $rootScope.itensLocal){

				// Itens para mostrar na view
	        	$scope.checkpoints = $rootScope.itensLocal[$rootScope.today].horas;

	        	// Se existir a primeira hora marcada
				if ($rootScope.itensLocal[$rootScope.today].horas[0] !== undefined){

					if ($rootScope.itensLocal[$rootScope.today].horas.length === 2){

						horaVoltarConf = $rootScope.configs.dinner.hour + ':' + $rootScope.configs.dinner.minutes;

						// Calculo a hora que tem que voltar do almoço baseado no tempo configurado
						horaVoltar = Tool.somaHora(horaVoltarConf,$rootScope.itensLocal[$rootScope.today].horas[1]);

						// Crio um array com horas e minutos
						var arrayHoraVoltar = horaVoltar.split(':');

						// Verifico se posso criar uma schedule para avisar saida
						// -------------------------------------------------
						if ($rootScope.configs.dinner.active == 1 && $rootScope.itensLocal[$rootScope.today].dinner == 0){

							// Crio um objeto date
							var d = new Date();

							// Pego hora e minutos
							horasVoltar = parseInt(arrayHoraVoltar[0]);
							minutosVoltar = parseInt(arrayHoraVoltar[1]) - $rootScope.itensLocal[$rootScope.today].dinner.minutesbefore; // Pode ser (15, 10, 5) é definido na configuracao

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

							$rootScope.itensLocal[$rootScope.today].dinner = 1; // Pronto, já marcou, agora chega

							// Salva local
							localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
						}
					}
				
					// Verifica o intervalo de almoço
					// -------------------------------------------------
					if ($rootScope.itensLocal[$rootScope.today].horas.length >= 3){
						
						// Calculo quanto tempo de almoço
						$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[$rootScope.today].horas[1].substr(0,5),$rootScope.itensLocal[$rootScope.today].horas[2].substr(0,5));

					}

					calcular();

				}else{

					// Inicializando dados
					$scope.saldoBase = $rootScope.configs.week[Tool.dia0a6()]; 
					$scope.saldo = $rootScope.configs.week[Tool.dia0a6()]; // Será decrementado
					$scope.horasTrabalhadas = "00:00";
					$scope.horaIr = false;
					$scope.saldoFinal = -(parseInt($scope.saldoBase.substr(0,2)) * 60) + parseInt($scope.saldoBase.substr(3,2));
					
					// Zera saldo e total do dia
					$rootScope.itensLocal[$rootScope.today].saldo = 0;
					$rootScope.itensLocal[$rootScope.today].total = 0;

				}

	        	atualiza_saldo();

	        	// Calculo da hora de ir
				if ($rootScope.itensLocal[$rootScope.today].horas.length === 3){
					
					// Passo a exibir a hora de ir
					$scope.horaIr = true;

					// Aqui eu calculo a hora de ir
					$scope.horasHoraIr = Tool.somaHora($rootScope.itensLocal[$rootScope.today].horas[2].substr(0,5), $scope.saldo, true);

					// Calculo quanto tempo de almoço
					$scope.interval = Tool.diferencaHoras($rootScope.itensLocal[$rootScope.today].horas[1].substr(0,5),$rootScope.itensLocal[$rootScope.today].horas[2].substr(0,5));

					// Crio um array com horas e minutos
					var horas = $scope.horasHoraIr.split(':');

					// Verifico se posso criar uma schedule para avisar saida
					// -------------------------------------------------
					if ($rootScope.itensLocal[$rootScope.today].end == 0 && $rootScope.configs.end == 1){

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

						$rootScope.itensLocal[$rootScope.today].end = 1; // Pronto, já agendou, agora chega

						// Salva local
						localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal)); 
					}
					// -------------------------------------------------

					// Verifico se já mandei sms
					// -------------------------------------------------
					if ($rootScope.itensLocal[$rootScope.today].sms == 0 && $rootScope.configs.sms.active == 1){
						
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

						$rootScope.itensLocal[$rootScope.today].sms = 1; // Pronto, já mandou sms, agora chega

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
							console.error("Você tentou adicionar uma data menor que o último checkin");
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