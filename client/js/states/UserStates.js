// modify folders in client/modules directory
// sample directory for this prefix would be client/modules/sample/
var modulePrefix = '/modules/user/';
var viewsPrefix = modulePrefix + 'views/';
var partialsPrefix = modulePrefix + 'partials/';

module.exports = [
  {
    name: 'dashboard',
    state: {
      url: '/dashboard',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'dashboard.html',
          controller: 'DashboardCtrl',
        },
      }
    }
  },
  {
    name: 'new-device',
    state: {
      url: '/new-device',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'new-device.html',
          controller: 'NewDeviceCtrl',
        },
      }
    }
  },
  {
    name: 'edit-device',
    state: {
      url: '/edit-device',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'edit-device.html',
          // controller: 'LoginCtrl',
        },
      }
    }
  },
  {
    name: 'edit-widget',
    state: {
      url: '/edit-widget',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'edit-widget.html',
          // controller: 'LoginCtrl',
        },
      }
    }
  }
]
