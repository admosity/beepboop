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
    name: 'buy-key',
    state: {
      url: '/buy-key',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'buy-key.html',
          controller: 'BuyKeyCtrl',
        },
      }
    }
  },
  {
    name: 'buy-thanks',
    state: {
      url: '/buy-thanks',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'buy-thanks.html',
          controller: 'BuyKeyCtrl',
        },
      }
    }
  },
  {
    name: 'edit-device',
    state: {
      url: '/edit-device/:id',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'edit-device.html',
          controller: 'EditDeviceCtrl'
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
  },

  {
    name: 'single-widget',
    state: {
      url: '/widget/:id',
      views: {
        // sidebar: {
        //   templateUrl: partialsPrefix + 'sidebar.html',
        // },
        content: {
          templateUrl: viewsPrefix + 'single-widget.html',
          controller: 'SingleWidgetCtrl',
        },
      }
    }
  },


  {
    name: 'demo',
    state: {
      url: '/demo',
      views: {
        content: {
          templateUrl: viewsPrefix + 'demo.html',
          controller: 'DemoCtrl',
        },
      }
    }
  }
]
