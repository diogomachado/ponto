(function(){

	angular.module('appponto').directive('dialtime', function(){
		return {
			restrict: 'E',
			scope: {
				index : '=',
				horas : '=horas',
				minutos : '=minutos',
			},
			templateUrl: 'app/views/template/dialogTime.html',
			controller: 'DialtimeCtrl',
			controllerAs: 'dialtime'
		};
	});
		
})();