(function() {
	angular.module('appponto').controller('HojeCtrl', function($scope, $rootScope, $location){
		
		$rootScope.page = $location.path();

		// Encontra a data de hoje
		// -------------
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		var H = today.getHours();
		var i = today.getMinutes();
		var s = today.getSeconds();

		if(dd<10) {
		  dd='0'+dd
		} 

		if(mm<10) {
		  mm='0'+mm
		} 

		if(H<10) {
		  H='0'+H
		}

		if(i<10) {
		  i='0'+i
		}

		if(s<10) {
		  s='0'+s
		}

		today = dd+'/'+mm+'/'+yyyy;
		time = H + ':' + i + ':' + s;


		function atualizar(){

			// Verifica se existe essa data dentro do objeto
	      	if (today in $rootScope.itensLocal){
				// Itens para mostrar na view
	        	$scope.checkpoints = $rootScope.itensLocal[today];
	        }
		}

		atualizar();

		// Definindo métodos globais para serem acessados pelos controllers
	    this.salvarData = function(){

	      	// GAMBIARRA, posso refatorar
	      	// Encontra a data de hoje
			// -------------
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			var H = today.getHours();
			var i = today.getMinutes();
			var s = today.getSeconds();

			if(dd<10) {
			  dd='0'+dd
			} 

			if(mm<10) {
			  mm='0'+mm
			} 

			if(H<10) {
			  H='0'+H
			}

			if(i<10) {
			  i='0'+i
			}

			if(s<10) {
			  s='0'+s
			}

			today = dd+'/'+mm+'/'+yyyy;
			time = H + ':' + i + ':' + s;

			$rootScope.checkLocal();

			// Verifica se existe essa data dentro do objeto
			if (today in $rootScope.itensLocal){

				// Beleza, adiciona a hora (antes verifico se existe)
				if ($rootScope.itensLocal[today].indexOf(time) == -1){
					$rootScope.itensLocal[today].push(time);
				}

				// Itens para mostrar na view
				$scope.checkpoints = $rootScope.itensLocal[today];

				atualizar();

			}else{
				// Se não tinha nenhum item, esse é o primeiro registro
				$rootScope.itensLocal[today] = [time];        
			
				atualizar();
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

	    	// Experimento
	    	var my_media = new Media("/android_asset/www/ping.mp3",
			function() {
			  console.log('Beleza, deu certo ping');
			},
			function(err) {
				console.log('Opa, deu erro');
			});

			my_media.play();
	    }

	});
})();