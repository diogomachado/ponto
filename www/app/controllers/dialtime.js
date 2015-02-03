(function() {
	angular.module('appponto').controller('DialtimeCtrl', function($scope){
			
		// function adicionaZero(){

		// 	if($scope.horas<10) {
		// 	  $scope.horas = '0' + $scope.horas
		// 	}

		// 	if($scope.minutos<10) {
		// 	  $scope.minutos ='0' + $scope.minutos
		// 	}
		// }


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

	});
})();