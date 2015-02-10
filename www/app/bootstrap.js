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
      'semana'      : {
                        0:'00:00',
                        1:'00:00',
                        2:'00:00',
                        3:'00:00',
                        4:'00:00',
                        5:'00:00',
                        6:'00:00',
                      },
    }

    // Menu bar
    function menu(){
      $location.path('/conf');
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
    
    // Configurações
    // ------------------------------------------------------
    if (localStorage.getItem("ponto-conf") !== null){
        // Retorna a lista em formato array
        var conf_local = JSON.parse(localStorage["ponto-conf"]);
    }else{
        // Se não recebe um array vazio
        var conf_local = conf;
    }  

    localStorage.setItem("ponto-conf", JSON.stringify(conf_local));
    
    $rootScope.configs = conf_local;

    if (conf_local.default === 0){
      console.log("Usuário ainda não configurou");
    }
    // ------------------------------------------------------

  });

})();