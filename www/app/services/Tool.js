(function() {
	angular.module('appponto').factory('Tool', function($rootScope){

		var Tool = {};

		Tool.formatarDia = function(d) {

			var dd = d.getDate();
			var mm = d.getMonth()+1; //January is 0!
			var yyyy = d.getFullYear();

			if(dd<10) {
			  dd='0'+dd
			}

			if(mm<10) {
			  mm='0'+mm
			}

			return dd+'/'+mm+'/'+yyyy;
		},

		Tool.formatarHora = function(h) {

			if (h < 0){
				h = h * (-1);
			}

			horas = parseInt(h/60);
			minutos = h%60;

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

			return horas + ":" + minutos;
		},

		Tool.diferencaHoras = function(horaInicial, horaFinal) {

			// Tratamento se a hora inicial é menor que a final
			if( ! Tool.isHoraInicialMenorHoraFinal(horaInicial, horaFinal) ){
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

		    horaFinal = Tool.completaZeroEsquerda(horasTotal) + ":" + Tool.completaZeroEsquerda(minutosTotal);
		    return horaFinal;
		},

		/**
		* Soma duas horas.
		* Exemplo:  12:35 + 07:20 = 19:55.
		*/
		Tool.somaHora = function(horaInicio, horaSomada, virarHoras) {

		    horaIni = horaInicio.split(':');
		    horaSom = horaSomada.split(':');

		    horasTotal = parseInt(horaIni[0], 10) + parseInt(horaSom[0], 10);
			minutosTotal = parseInt(horaIni[1], 10) + parseInt(horaSom[1], 10);

		    if(minutosTotal >= 60){
		        minutosTotal -= 60;
		        horasTotal += 1;
		    }

			// virarHoras é apenas para se a soma der mais que 23 horas ele começar a contar do 0 de novo
			if (virarHoras){
				if (horasTotal > 24){
					horasTotal = horasTotal - 24;
				}
			}

		    horaFinal = Tool.completaZeroEsquerda(horasTotal) + ":" + Tool.completaZeroEsquerda(minutosTotal);
		    return horaFinal;
		},

		/**
		 * Verifica se a hora inicial é menor que a final.
		 */
		Tool.isHoraInicialMenorHoraFinal = function(horaInicial, horaFinal){
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
		},

		/**
		 * Completa um número menor que dez com um zero à esquerda.
		 * Usado aqui para formatar as horas... Exemplo: 3:10 -> 03:10 , 10:5 -> 10:05
		 */
		Tool.completaZeroEsquerda = function( numero ){
			return ( numero < 10 ? "0" + numero : numero);
		},

		// Retorna o dia (0 a 6)
		Tool.dia0a6 = function(day){

			// Se passou uma data de parametro, retorno o dia referente a data
			if (day){
				var dt = day.split('/');
				var today = new Date(dt[2] + '-' + parseInt(dt[1]) + '-' + dt[0]);
			}else{
				var today = new Date();
			}

			return today.getDay();
		},

		// Calcula as horas trabalhas
		Tool.calcular = function(dia){

			var horasTrabalhadas = 0;

			// Se tem aquela data no array
			if (dia in $rootScope.itensLocal){

				// Se tem horas naquela data
				if ($rootScope.itensLocal[dia].horas.length != 0)

					// Faço um loop pelos checkpoints
					angular.forEach($rootScope.itensLocal[dia].horas, function(value, key){

						// verifica se é par
						if (key % 2 == 0){

							// verifica se existe o proximo elemento
							if ($rootScope.itensLocal[dia].horas[key + 1] !== undefined)
							{
								// Calcula a diferença de horas
								diferenca = $rootScope.itensLocal[dia].horas[key + 1] - $rootScope.itensLocal[dia].horas[key];

							}else{

								if (key == 0)
								{
									diferenca = $rootScope.time - $rootScope.itensLocal[dia].horas[key];
								}else if(key != 2){
									diferenca = $rootScope.time - $rootScope.itensLocal[dia].horas[key];
								}
							}

							// Calcula as horas trabalhadas
							if (key == 0){
								horasTrabalhadas = diferenca;
							}else if(key != 2 || $rootScope.itensLocal[dia].horas[key + 1] !== undefined){
								horasTrabalhadas = horasTrabalhadas + diferenca;
							}

							// Salva
							localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
						}
					});
			}

			// Retorno as horas trabalhadas para mostrar na view
			return horasTrabalhadas;
		}

		Tool.converter = function(minutos){

			var horas        = parseInt(minutos/60);
			var restoMinutos = minutos%60;

			return this.completaZeroEsquerda(horas) + ":" + this.completaZeroEsquerda(restoMinutos);
		}

		Tool.getHours = function(minutos){
			return parseInt(minutos/60);
		}

		Tool.getMinutes = function(minutos){
			return parseInt(minutos%60);
		}

		return Tool;
	});

})();