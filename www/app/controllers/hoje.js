(function() {
	angular.module('appponto').controller('HojeCtrl', function($scope, $rootScope, $location, Tool, $interval){

		$rootScope.page = $location.path();

		$rootScope.checkpoints = [];
		$scope.editar = false;

		$scope.saldoBase        = $rootScope.configs.week[Tool.dia0a6()];
		$scope.saldo            = $rootScope.configs.week[Tool.dia0a6()]; // Será decrementado
		$scope.horaIr           = false;

		var inicio, fim, diferenca, horas, horaVoltar, horasVoltar, minutosVoltar;

		// Manda calcular com o dia
		$scope.horasTrabalhadas = Tool.calcular($rootScope.today);

		function atualiza_saldo(){

			// Se data de hoje está no array
        	if ($rootScope.today in $rootScope.itensLocal){

	        	// Calculo da hora de ir
				if ($rootScope.itensLocal[$rootScope.today].horas.length === 3 && $scope.saldoFinal < 0){

					// Passo a exibir a hora de ir
					$scope.horaIr = true;

					// Verifico se posso criar uma schedule para avisar saida
					// -------------------–≠------------------------------
					if ($rootScope.itensLocal[$rootScope.today].end == 0 && $rootScope.configs.end == 1){

						// Crio um objeto date com as horas de sair
						var d = new Date();
						d.setHours(parseInt($scope.horasHoraIr / 60), parseInt($scope.horasHoraIr % 60));

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
						    console.log("SMS enviado");
						}, function(error) {
						    console.log("SMS não foi enviado");
						});
						// -------------------------------------------------

						$rootScope.itensLocal[$rootScope.today].sms = 1; // Pronto, já mandou sms, agora chega

						// Salva local
						localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
					}
				}else{
					$scope.horaIr = false;
				}

				// Horas trabalhadas
		        $scope.horasTrabalhadas  = Tool.calcular($rootScope.today);

				// Acho o saldo final
	        	$scope.saldoFinal = $scope.horasTrabalhadas - $scope.saldoBase;

		        // Atualiza o saldo na view e no localStorage
		        ($scope.saldoBase != 0) ? $scope.saldo = $scope.saldoBase - $scope.horasTrabalhadas : $scope.saldo = $scope.horasTrabalhadas;

                // Aqui eu calculo a hora de ir
                if ($rootScope.itensLocal[$rootScope.today].horas[2] != undefined){
                    $scope.horasHoraIr = {};
                    $scope.horasHoraIr = $rootScope.time + ($scope.saldoFinal * -1);
                }

	        	// Salva local
				localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
        	}
		}

		// Atualiza a cada minuto que passa
		$rootScope.$watch('time', function(){
			atualiza_saldo();
		});

		// Sempre que ocorre mudanças nas horas
		$rootScope.$watchCollection('itensLocal["'+ $rootScope.today + '"].horas', function(){

			var checks = [];

            // Verifica se existe essa data dentro do objeto
            if ($rootScope.today in $rootScope.itensLocal){

	      		// Faz for para formatar as datas
	      		angular.forEach($rootScope.itensLocal[$rootScope.today].horas, function(value, key) {

	      			// p = posição no arrray
	      			// v = valor

					checks[key] = {"p": key, "v": Tool.converter(value)};
				});

				// Itens para mostrar na view
	        	$scope.checkpoints = checks;

	        	// Se existir a primeira hora marcada
				if ($rootScope.itensLocal[$rootScope.today].horas[0] !== undefined){

					if ($rootScope.itensLocal[$rootScope.today].horas.length === 2){

						// Calculo a hora que tem que voltar do almoço baseado no tempo configurado
						horaVoltar = ($rootScope.configs.dinner.hour + $rootScope.itensLocal[$rootScope.today].horas[1]) - $rootScope.itensLocal[$rootScope.today].dinner.minutesbefore;

						// Verifico se posso criar uma schedule para avisar saida
						// -------------------------------------------------
						if ($rootScope.configs.dinner.active == 1 && $rootScope.itensLocal[$rootScope.today].dinner == 0){

							// Crio um objeto date
							var d = new Date();

							// Pego hora e minutos
							horasVoltar   = parseInt(horaVoltar / 60);
							minutosVoltar = (parseInt(horaVoltar % 60));

							// Atualizo o objeto
							d.setHours(horasVoltar,minutosVoltar);

							// Defino um alarme programado para 10 minutos antes de dar aquela hora
							window.plugin.notification.local.add({
							    id:      2,
							    title:   'Intervalo acabando',
							    message: 'Horário de almoço termina em ' + $rootScope.configs.dinner.minutesbefore + ' minutos',
							    date:    d,
							    // sound: 'TYPE_ALARM'
							    sound: '/android_asset/www/sound/siren.mp3'
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
						$scope.interval = $rootScope.itensLocal[$rootScope.today].horas[2] - $rootScope.itensLocal[$rootScope.today].horas[1];
					}

					Tool.calcular($rootScope.today);

				}

                atualiza_saldo();
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

                        // Puxa a hora para dentro do array
                        $rootScope.itensLocal[$rootScope.today].horas.push($rootScope.time);
                    }

                    // Reordenar as horas
                    $rootScope.itensLocal[$rootScope.today].horas = $rootScope.itensLocal[$rootScope.today].horas.sort(function(a, b){return a-b});

                    // Itens para mostrar na view
                    $scope.checkpoints = $rootScope.itensLocal[$rootScope.today].horas;
                }
                else{

                    // TODO: Exibir um alerta ao usuário
                    console.log("Já existia essa hora registrada");
                }
			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[$rootScope.today] = {'horas':[$rootScope.time], 'total':0, 'end':0, 'sms':0, 'dinner':0};
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
			$scope.horas   = Tool.getHours($rootScope.itensLocal[$rootScope.today].horas[index]);
			$scope.minutos = Tool.getMinutes($rootScope.itensLocal[$rootScope.today].horas[index]);

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