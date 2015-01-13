(function() {
  
  // Inicializa phonegap.js
  var conf = {

      initialize: function() {
          this.bindEvents();
      },
      bindEvents: function() {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      
      onDeviceReady: function() {
        console.log('Phonegap inicializado!');
        navigator.notification.beep(2);
      },
  };

  // Inicializa o Angular.js
  angular.module('appponto',['ngRoute', 'ngTouch'])
  .config(function($routeProvider)
  {

    // Rotas
    $routeProvider
    .when('/', {
      templateUrl : 'app/views/hoje.html',
      controller  : 'HojeCtrl',
      controllerAs: 'hoje'
    })
    .when('/semana', {
      templateUrl : 'app/views/semana.html',
      controller  : 'SemanaCtrl',
      controllerAs: 'semana'
    })
    .when('/mes', {
      templateUrl : 'app/views/mes.html',
      controller  : 'MesCtrl',
      controllerAs: 'mes'
    })
    .when('/todos', {
      templateUrl : 'app/views/todos.html',
      controller  : 'TodosCtrl',
      controllerAs: 'todos'
    })
    .otherwise ({ redirectTo: '/' });
  })
  .run(function(){

    function menu(){
      navigator.notification.beep(4);

      // Abre o menu
    }

    document.addEventListener('menubutton', menu, false);    
  });

})();