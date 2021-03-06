var app = angular.module('WifiGoApp', []);
  
  app.controller('DropinController', ['$scope', '$http', function ($scope, $http) {
    $scope.amount=20;
    $scope.message = 'Please use the form below to pay:';
    $scope.showDropinContainer = true;
    $scope.isError = false;
    $scope.isPaid = false;

    $scope.getToken = function () {

      $http({
        method: 'POST',
        url:'/clientoken'
      }).success(function (data) {
        braintree.setup(data.client_token, 'dropin', {
          container: 'checkout',
          // Form is not submitted by default when paymentMethodNonceReceived is implemented
          paymentMethodNonceReceived: function (event, nonce) {

            $scope.message = 'Processing your payment...';
            $scope.showDropinContainer = false;

            $http({
              method: 'POST',
              url: '/process',
              data: {
                amount: $scope.amount,
                payment_method_nonce: nonce
              }
            }).success(function (data) {
              if (data.success) {
                $scope.message = 'Payment authorized, thanks.';
                $scope.showDropinContainer = false;
                $scope.isError = false;
                $scope.isPaid = true;
              } else {
                // implement your solution to handle payment failures
                $scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
                $scope.isError = true;
              }

            }).error(function (error) {
              $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
              $scope.showDropinContainer = false;
              $scope.isError = true;
            });

          }
        });

      }).error(function (error) {
        $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
        $scope.showDropinContainer = false;
        $scope.isError = true;
      });

    };

    $scope.getToken();

  }]);
  
  app.controller("UserInfoController", ['$scope', '$http', function ($scope, $http){
					$scope.userInfo = {};
					$scope.userInfoList = {};
					$scope.userInfo.submitUserInfo=function(item,event){
						console.log("form submit");
						var dataObject = {
							"shiplocation":$scope.userInfo.shiplocation,
							"firstName":$scope.userInfo.firstName,
							"lastName":$scope.userInfo.lastName,
							"address1":$scope.userInfo.address1,
							"address2":$scope.userInfo.address2,
							"city":$scope.userInfo.city,
							"state":$scope.userInfo.state,
							"postalcode":$scope.userInfo.postalcode,
							"country":$scope.userInfo.country
						}
						$http({
								method: 'POST',
								url: '/api/userInfo',
								data: dataObject
							  }).success(function (data) {
									$scope.getUsersList()
							   }).error(function (error) {
							  });
						console.log(dataObject);
					}
					
					$scope.getUsersList=function(){
						$http({
							method: 'GET',
							url:'/api/userInfo'
						  }).success(function (data) {
								$scope.userInfoList = data;
						  }).error(function (error) {
						  });
					}
					
					$scope.getUsersList();
				}]);
  
