angular.module( 'comparativos.services.utils', ['lodash'])

.service('utils', function(lodash, config) {

	return {
		prepareUrl: function(uriSegments) {
			if (lodash.isNull(config.apiUrl)) {
				apiUrl = 'https://api.test';
			}
			else {
				apiUrl = config.apiUrl;
			}

			return apiUrl + "/" + uriSegments;
		},

		showDatetime: function(string, format) {
			return moment(string).fromNow();
		}

	};

})

// ESTO FUERA DE AQUÍ!!!
.controller( 'resetPassword', function ResetPasswordController( $scope, $http ) {
	$scope.submit= function(){
		$http.post('/reset/process', {email:$scope.email})
			.success(function(data, status){
				$scope.success = true;
				$scope.message="Si la dirección es válida el email será enviado ahora mismo. Revise su bandeja de entrada.";
			})
			.error(function(data, status){
				$scope.error = true;
				$scope.message="Ha ocurrido un error, por favor, inténtalo de nuevo.";
			})
	}
})
.controller( 'resetPasswordForm', function ResetPasswordFormController( $scope, $http ) {
	$scope.submit= function(){
		if($scope.pass1===$scope.pass2){
			$http.post('/reset/'+passResetToken, {password:$scope.pass1})
				.success(function(data, status){
					console.log(data)
					if(data.ok){
						$scope.success = true;
						$scope.message="Contraseña cambiada. Puedes iniciar sesión con la contraseña que acabas de establecer.";
					} else {
						$scope.message= data.message || "Ha ocurrido un error, por favor, inténtalo de nuevo.";
						$scope.error = true;
					}
				})
				.error(function(data, status){
					$scope.error = true;
					$scope.message="Ha ocurrido un error, por favor, inténtalo de nuevo.";
				})
		} else {
			alert("Las contraseñas no coinciden")
		}
	}
})