// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    // ~cb-read-start~
    {
      name: { type: String, required: true },
      email: { type: String, unique: true, lowercase: true, required: true },
      password: { type: String },
      phone: { type: String, default: '' },
      isAdmin: { type: Boolean, default: false },
      auth0Id: { type: String },
    }
    // ~cb-read-end~
    ,
    {
      timestamps: true
    });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};