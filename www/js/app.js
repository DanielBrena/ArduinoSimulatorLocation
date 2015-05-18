
var module = ons.bootstrap('my-app', ['onsen']);

module.controller('PrincipalCtrl',function($scope,$interval){
	Parse.initialize("feN1oQBjjIwhAm17ssUClGit9YzUGe3otyBQnuCu", "WCjSy03NpDIHs73xifL91RVAggGFajB7KetQLOKm");

	$scope.activo = false;
	$scope.tiempo = 5;
	$scope.ubicacion = {};
	$scope.codigo = "arduino";

	$scope.ubicaciones = [];

	var promise;

	$scope.start = function(){
		$scope.stop();
		$scope.activo = true;
		promise = $interval(enviando,parseInt($scope.tiempo) * 1000);
	}

	$scope.stop = function(){
		$interval.cancel(promise);
		$scope.activo = false;
		$scope.ubicacion = {};
		$scope.ubicaciones = [];


	}

	$scope.$on('$destroy', function() {
      $scope.stop();
    });

	function enviando(){

		navigator.geolocation.getCurrentPosition(function(position) {
      		$scope.ubicacion.lat = position.coords.latitude;
	    	$scope.ubicacion.lng = position.coords.longitude;
	    	$scope.ubicaciones.push($scope.ubicacion);
      	});

      	var Arduino = Parse.Object.extend('ArduinoSim');
        var Ubicacion = Parse.Object.extend('Ubicacion');


        var ubicacion_temporal;
        var ubicacion = new Ubicacion();

        ubicacion.set('coordenada',new Parse.GeoPoint({latitude:$scope.ubicacion.lat,longitude:$scope.ubicacion.lng}));
        ubicacion.save(null,{
            success:function(ubicacion){
                ubicacion_temporal = ubicacion;
            }
        });

        var query = new Parse.Query(Arduino);
        query.equalTo("num_serie", $scope.codigo);
        query.find({
        	success:function(arduino){
        		console.log(arduino[0].id);
        		var relation = arduino[0].relation('ubicaciones');
        		console.log(ubicacion_temporal.id);
                relation.add(ubicacion_temporal);
                arduino[0].save();
        	},
            error:function(){
                console.log("Error");
            }
        });


        



		console.log("Enviado");
	}
});