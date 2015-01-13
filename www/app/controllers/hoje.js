(function() {
	angular.module('appponto').controller('HojeCtrl', function($rootScope, $location){
		
		$rootScope.page = $location.path();

		// Encontra a data de hoje
		// -------------
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

		today = dd+'/'+mm+'/'+yyyy;
		// -------------

		// Json teste
		var json = [{
			'22/12/2014' : ['15:30:00', '18:22:00'],
			'21/12/2014' : ['12:00:00', '18:22:00']
		}];

		console.log(json);

	});
})();