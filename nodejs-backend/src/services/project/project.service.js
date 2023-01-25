// Initializes the `project` service on path `/project`
const { Project } = require('./project.class');
const createModel = require('../../models/project.model');
const hooks = require('./project.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/project', new Project(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('project');

  service.hooks(hooks);
};
