(function() {
	angular.module('appponto').factory('Tool', function(){
		
		return{
			
			formatarDia: function(d) {
			
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

			formatarHora: function(h) {
				
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

			diferencaHoras: function(horaInicial, horaFinal) {

				// Tratamento se a hora inicial é menor que a final	
				if( ! this.isHoraInicialMenorHoraFinal(horaInicial, horaFinal) ){
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
				
			    horaFinal = this.completaZeroEsquerda(horasTotal) + ":" + this.completaZeroEsquerda(minutosTotal);
			    return horaFinal;
			},

			/**
			* Soma duas horas.
			* Exemplo:  12:35 + 07:20 = 19:55.
			*/
			somaHora: function(horaInicio, horaSomada, virarHoras) {
				
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
				
			    horaFinal = this.completaZeroEsquerda(horasTotal) + ":" + this.completaZeroEsquerda(minutosTotal);
			    return horaFinal;
			},

			/**
			 * Verifica se a hora inicial é menor que a final.
			 */
			isHoraInicialMenorHoraFinal: function(horaInicial, horaFinal){
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
			completaZeroEsquerda: function( numero ){
				return ( numero < 10 ? "0" + numero : numero);
			},

			// Retorna o dia (0 a 6)
			dia0a6: function(){	
				var today = new Date();
				return today.getDay();
			}

		}
	});

})();