// Add this directive where you keep your directives
angular.module('appponto').directive('increase', function ($interval) {
   return {
      restrict: 'A',
      scope: {
        quem: '@', // Deve estar definido lá como horas="horas"
        operacao: '@', // Deve estar definido lá como horas="horas"
        minutos: '=minutos', // Deve estar definido lá como horas="horas"
        horas  : '=horas' // Deve estar definido lá como horas="horas"
      },
      link: function($scope, $elm, $attrs) {
			
		$elm.bind('touchstart', function(evt) {
		
			// console.log("Começou touch");

			// Começa um interval
			promise = $interval(function () { 

				// Verifica quem (horas ou minutos)
				if ($scope.quem == "h")
				{
					// Transforma horas para int
					$scope.horas = parseInt($scope.horas);

					// Operação a = aumentar
					if ($scope.operacao == "a"){
						// Se for maior que 23
						if ($scope.horas >= 23){
							$scope.horas = 0;
						}else{

							// Incrementa
							$scope.horas = $scope.horas + 1; 
						}
					}

					// Operação d = dimunir
					if ($scope.operacao == "d"){
						// Se for menor que 00
						if ($scope.horas <= 0){
							$scope.horas = 23;
						}else{

							// Decrementa
							$scope.horas = $scope.horas - 1; 
						}
					}
				}

				// Verifica quem (horas ou minutos)
				if ($scope.quem == "m")
				{
					// Transforma minutos para int
					$scope.minutos = parseInt($scope.minutos);

					// Operação a = aumentar
					if ($scope.operacao == "a"){
						// Se for maior que 23
						if ($scope.minutos >= 59){
							$scope.minutos = 0;
						}else{

							// Incrementa
							$scope.minutos = $scope.minutos + 1; 
						}
					}

					// Operação d = dimunir
					if ($scope.operacao == "d"){
						// Se for menor que 00
						if ($scope.minutos <= 0){
							$scope.minutos = 59;
						}else{

							// Decrementa
							$scope.minutos = $scope.minutos - 1; 
						}
					}
				}

	        }, 300);

			$scope.$apply(function() {
				$scope.$eval($attrs.increase)
			});
		});

		$elm.bind('touchend', function(evt) {
			
			// console.log("Termina touch");

			// Cancela o intervalo
			$interval.cancel(promise);

			if ($attrs.mouseUp) {
				$scope.$apply(function() {
					$scope.$eval($attrs.mouseUp)
				});
			}
		});

    }
  };
});