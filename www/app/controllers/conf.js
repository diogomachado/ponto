(function() {
	angular.module('appponto').controller('ConfCtrl', function($location, $scope, $rootScope, Tool){
		$rootScope.page = $location.path();

		// Trás os horários da semana
		function semana(){
			$scope.semana = [];
			// Horas marcadas, para exibir no conf
			angular.forEach($rootScope.configs.week, function(minutos, key){
				$scope.semana.push(Tool.converter(minutos));
			});
		}

		// Toda vez que configura semana, atualiza
		$rootScope.$watchCollection('configs.week', function(){
			semana();
		});

		// Verifica se os botões estão ativos
		$rootScope.$watch('configs.dinner.active', function(){
			($rootScope.configs.dinner.active == 1) ? $scope.active_dinner = true : $scope.active_dinner = false;
		});

		($rootScope.configs.end == 1)           ? $scope.active_end    = true : $scope.active_end    = false;
		($rootScope.configs.sms.active == 1)    ? $scope.active_sms    = true : $scope.active_sms    = false;

		this.configurar = function(index){

			// Recolho a hora pegando do index do array do dia de hoje
			$scope.horas   = parseInt($rootScope.configs.week[index] / 60);
			$scope.minutos = parseInt($rootScope.configs.week[index] % 60);

	    	// Scope é passado como modelo para a directiva de tempo (index é a ID do array de horas registradas)
	    	$scope.indexSelecionado = index;

	    	// Exibe o dialog
	    	angular.element(document.querySelector('#dialog')).addClass('show');
	    }

	    // Notificações
		this.dinner = function(){

			// Verifica se está ativado
			if ($rootScope.configs.dinner.active == 1){

				// Desativa visualmente
				$scope.active_dinner = false;

				// Seta como desativado
				$rootScope.configs.dinner.active = 0;

				// Salva local
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}else{

				// Exibe o dialog
	    		angular.element(document.querySelector('#dialog-dinner')).addClass('show');

	    		// Vibra rapidão
	    		navigator.vibrate(50);
			}

		}

		this.end = function(){

			if ($rootScope.configs.end == 1){

				$rootScope.configs.end = 0; // Desativa
				$scope.active_end = false; // Desativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}else{

				$rootScope.configs.end = 1; // Desativa
				$scope.active_end = true; // Ativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}

		}

		this.sms = function(){

			if ($rootScope.configs.sms.active == 1){

				$rootScope.configs.sms.active = 0; // Desativa
				$scope.active_sms = false; // Desativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}else{

				$rootScope.configs.sms.active = 1; // Desativa
				$scope.active_sms = true; // Ativa visualmente
				localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			}
		}

		this.export = function(){

			var saveData = (function () {
			    var a = document.createElement("a");
			    document.body.appendChild(a);
			    a.style = "display: none";
			    return function (data, fileName) {
			        var json = JSON.stringify(data),
			            blob = new Blob([json], {type: "octet/stream"}),
			            url = window.URL.createObjectURL(blob);
			        a.href = url;
			        a.download = fileName;
			        a.click();
			        window.URL.revokeObjectURL(url);
			    };
			}());

			var data = localStorage.getItem('ponto-horarios'),
			    fileName = "ponto-horarios.json";

			saveData(data, fileName);
		}
	});
})();