// project-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'project';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  ObjectId = Schema.ObjectId;
  const schema = new Schema({
    user_id: { type: ObjectId, required: true },
    project_name: { type: String, required: true },
    project_description: { type: String, required: true },
    project_category: { type: String, required: true },
    project_price: { type: Number, required: true },
    project_duration: { type: Array, of: Date, required: true },
    project_terms: { type: String, required: true },
    project_platform: { type: JSON, required: true },
    project_status: { type: String, required: true, default: 'Pending' },
  },
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
