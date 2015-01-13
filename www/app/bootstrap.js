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
    .when('/conf', {
      templateUrl : 'app/views/conf.html',
      controller  : 'ConfCtrl',
      controllerAs: 'conf'
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
  .run(function($rootScope){
    
    // Registra o evento menubutton
    document.addEventListener('menubutton', menu, false);

    // Inicializando variaveis
    var conf = {

      'default'     : 0,
      'notificacao' : 0,
      'segunda'     :'00:00',
      'terca'       :'00:00', 
      'quarta'      :'00:00', 
      'quinta'      :'00:00', 
      'sexta'       :'00:00',
      'sabado'      :'00:00', 
      'domingo'     :'00:00', 
    }

    // Menu bar
    function menu(){
      navigator.notification.beep(4);
    }

    // Verifica se tem uma lista armazenada offline
    $rootScope.checkLocal = function(){
        if (localStorage.getItem("ponto-horarios") !== null){
            // Retorna a lista em formato array
            var itens = JSON.parse(localStorage["ponto-horarios"]);
        }else{
            // Se não recebe um array vazio
            var itens = {};
        }

      // Armazeno no local storage
      localStorage.setItem("ponto-horarios", JSON.stringify(itens));

      // Associo o array a uma variavel do angular
      $rootScope.itensLocal = itens;
    }

    $rootScope.checkLocal(); // inicializa localStorage

    // Configuração inicial
    localStorage.setItem("ponto-conf", JSON.stringify(conf));
    
    var conf_local = JSON.parse(localStorage["ponto-conf"]);

    if (conf_local.default === 0){
      console.log("Usuário ainda não configurou");
    }

  });

})();