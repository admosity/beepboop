// modify folders in client/modules directory
// sample directory for this prefix would be client/modules/sample/
var modulePrefix = '/modules/sample/';
var viewsPrefix = modulePrefix + 'views/';

module.exports = [
  {
    name: 'sample-state',
    state: {
      url: '/',
      views: {
        content: {
          templateUrl: viewsPrefix + 'sample.html',
          controller: 'SampleCtrl',
        },
      }
    }
  }
]