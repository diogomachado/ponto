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
  .run(function($rootScope){
    
    // Menu bar
    // ---------------------------------------------------
    function menu(){
      navigator.notification.beep(4);

      // Abre o menu
    }
    document.addEventListener('menubutton', menu, false);    
    // ---------------------------------------------------

    // Verifica se tem uma lista armazenada offline
    function checkLocal(){
        if (localStorage.getItem("dblocal") !== null){
            // Retorna a lista em formato array
            var itens = JSON.parse(localStorage["dblocal"]);
        }else{
            // Se não recebe um array vazio
            var itens = {};
        }

      // Armazeno no local storage
      localStorage.setItem("dblocal", JSON.stringify(itens));

      // Associo o array a uma variavel do angular
      $rootScope.itensLocal = itens;
    }

    checkLocal();

    // Definindo métodos globais para serem acessados pelos controllers
    $rootScope.salvarData = function(){

      checkLocal();

      // Encontra a data de hoje
      // -------------
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      var H = today.getHours();
      var i = today.getMinutes();
      var s = today.getSeconds();

      if(dd<10) {
          dd='0'+dd
      } 

      if(mm<10) {
          mm='0'+mm
      } 

      if(H<10) {
          H='0'+H
      }

      if(i<10) {
          i='0'+i
      }

      if(s<10) {
          s='0'+s
      }

      today = dd+'/'+mm+'/'+yyyy;
      time = H + ':' + i + ':' + s;

      // Verifica se existe essa data dentro do objeto
      if (today in $rootScope.itensLocal){
        
        // Beleza, adiciona a hora
        $rootScope.itensLocal[today].push(time);

      }else{
        // Se não tinha nenhum item, esse é o primeiro registro
        $rootScope.itensLocal[today] = [time];        
      }

      // Salvo as alterações no localStorage
      localStorage.setItem("dblocal", angular.toJson($rootScope.itensLocal));
      
    }

  });

})();