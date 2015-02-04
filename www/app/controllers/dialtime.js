(function() {
	angular.module('appponto').controller('DialtimeCtrl', function($scope, $rootScope){
			
		$scope.$watch('horas', function(){

			// A hora chega aqui como string, então transformo ela em int antes de trabalhar
			$scope.horas = parseInt($scope.horas);

			if(parseInt($scope.horas) < 10) {
			  $scope.horas = '0' + $scope.horas;
			}			

		});

		$scope.$watch('minutos', function(){

			// A hora chega aqui como string, então transformo ela em int antes de trabalhar
			$scope.minutos = parseInt($scope.minutos);

			if(parseInt($scope.minutos) < 10) {
			  $scope.minutos = '0' + $scope.minutos;
			}			

		});

		this.aumentarHora = function(){

			// Limite 24 horas
			if ($scope.horas < 23){
				$scope.horas++;
			}else{
				$scope.horas = 0;
			}
		}

		this.diminuirHora = function(){

			// Limite 00 horas
			if ($scope.horas > 1){
				$scope.horas--;
			}else if ($scope.horas === 0){
				$scope.horas = 23;
			}else{
				$scope.horas = 0;
			}
		}

		this.aumentarMinuto = function(){

			// Limite 24 horas
			if ($scope.minutos < 59){
				$scope.minutos++;
			}else{
				$scope.minutos = 0;
			}
		}

		this.diminuirMinuto = function(){

			// Limite 00 horas
			if ($scope.minutos > 1){
				$scope.minutos--;
			}else if ($scope.minutos === 0){
				$scope.minutos = 59;
			}else{
				$scope.minutos = 0;
			}
		}

		this.fechar = function(){

			// Retiro a janela de exibir
			angular.element(document.querySelector('#dialog')).removeClass('show');
		}

		this.salvar = function(){

			// Pega o dia de hoje
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

			day = dd+'/'+mm+'/'+yyyy;

			// Atualiza com os valores do scopo
			$rootScope.itensLocal[day][$scope.index] = $scope.horas + ":" + $scope.minutos + ":00"; // Segundos não importam

	    	// Re-salvo no local
	    	localStorage.setItem("ponto-horarios", JSON.stringify($rootScope.itensLocal));
			
			// Retiro a janela de exibir
			angular.element(document.querySelector('#dialog')).removeClass('show');
		}

	});
})();