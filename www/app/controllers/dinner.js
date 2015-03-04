(function() {
	angular.module('appponto').controller('DinnerCtrl', function($scope, $rootScope, Tool){
		
		// Configurações salvas
		$scope.horas = $rootScope.configs.dinner.hour;
		$scope.minutos = $rootScope.configs.dinner.minutes;
		$scope.minutosAlerta = $rootScope.configs.dinner.minutesbefore;

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
			}else if ($scope.horas == 0){
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
			}else if ($scope.minutos == 0){
				$scope.minutos = 59;
			}else{
				$scope.minutos = 0;
			}
		}

		this.aumentarMinutoAlerta = function(){

			// Limite 24 horas
			if ($scope.minutosAlerta < 59){
				$scope.minutosAlerta++;
			}else{
				$scope.minutosAlerta = 0;
			}
		}

		this.diminuirMinutoAlerta = function(){

			// Limite 00 horas
			if ($scope.minutosAlerta > 1){
				$scope.minutosAlerta--;
			}else if ($scope.minutosAlerta == 0){
				$scope.minutosAlerta = 59;
			}else{
				$scope.minutosAlerta = 0;
			}
		}

		this.save = function(){

			// Configura
			$rootScope.configs.dinner.hour = parseInt($scope.horas);
			$rootScope.configs.dinner.minutes = parseInt($scope.minutos);
			$rootScope.configs.dinner.minutesbefore = parseInt($scope.minutosAlerta);
			$rootScope.configs.dinner.active = 1;

			// Salva local
			localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));

			// Retiro a janela de exibir
			angular.element(document.querySelector('#dialog-dinner')).removeClass('show');
		}

		this.close = function(){

			// Retiro a janela de exibir
			angular.element(document.querySelector('#dialog-dinner')).removeClass('show');
		}

		this.disable = function(){

			$rootScope.configs.dinner.active = 0;

			// Salva local
			localStorage.setItem("ponto-conf", JSON.stringify($rootScope.configs));			

			// Retiro a janela de exibir
			angular.element(document.querySelector('#dialog-dinner')).removeClass('show');

		}

	});
})();