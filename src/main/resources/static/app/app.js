// tạo ứng dụng angular: JWTDemoApp
angular.module('JWTDemoApp', ['ui.router'])

	// chạy method này khi initializing.có nghĩa là method này chỉ chạy một lần 
	.run(function (AuthService, $rootScope, $state) {
		// Để  thêm tính năng xác thực ta cần lắng nghe state
		// Mỗi thay đổi từ state, ui-router sẽ thông báo trên '$stateChangeStart'.
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			// =====================================
			// kiểm tra xem người dùng đăng nhập chưa?
			// =====================================
			if (!AuthService.user) {
				// chặn vòng lặp vô hạn của state
				if (toState.name != 'login' && toState.name != 'register') {
					event.preventDefault();
					$state.go('login');
				}
			} else {
				// kiểm tra xem ng dùng có quyền để xem?
				if (toState.data && toState.data.role) {
					var hasAccess = false;
					for (var i = 0; i < AuthService.user.roles.length; i++) {
						var role = AuthService.user.roles[i];
						if (toState.data.role == role) {
							hasAccess = true;
							break;
						}
					}
					if (!hasAccess) {
						event.preventDefault();
						$state.go('access-denied');
					}

				}
			}
		});
	});