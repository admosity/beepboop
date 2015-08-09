// modify folders in client/modules directory
// sample directory for this prefix would be client/modules/sample/
var modulePrefix = '/modules/sample/';
var viewsPrefix = modulePrefix + 'views/';
var partialsPrefix = modulePrefix + 'partials/';

module.exports = [
  {
    name: 'home',
    state: {
      url: '/',
      views: {
        header: {
          templateUrl: partialsPrefix + 'header.html',
        },
        content: {
          templateUrl: viewsPrefix + 'home.html',
          // controller: 'SampleCtrl',
        },
      }
    }
  },
  {
    name: 'marketplace',
    state: {
      url: '/marketplace',
      views: {
        header: {
          templateUrl: partialsPrefix + 'header.html',
        },
        content: {
          templateUrl: viewsPrefix + 'marketplace.html',
          // controller: 'SplashCtrl',
        },
      }
    }
  },
  {
    name: 'login',
    state: {
      url: '/login',
      views: {
        header: {
          templateUrl: partialsPrefix + 'header.html',
        },
        content: {
          templateUrl: viewsPrefix + 'login.html',
          controller: 'LoginCtrl',
        },
      }
    }
  },
]
