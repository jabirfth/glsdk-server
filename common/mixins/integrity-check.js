function getModelRelations(Model) {
  return Object.getOwnPropertyNames(Model.definition.settings.relations)
    .map(propertyName =>
      Object.assign({}, Model.definition.settings.relations[propertyName], { propertyName }),
    );
}

function getModelPrimaryKey(Model) {
  return Object.getOwnPropertyNames(Model.definition.properties)
    .find(property => !!Model.definition.properties[property].id);
}

function addForeignKeyIntegrityCheckHookOnCreate(Model) {
  Model.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      const relations = getModelRelations(ctx.Model);
      const promises = relations
        .filter(relation => relation.type === 'belongsTo')
        .filter(relation => !!ctx.instance[relation.foreignKey])
        .map(relation => new Promise((resolve, reject) => {
          const parentModelName = relation.model;
          const parentModel = ctx.Model.app.models[parentModelName];
          const parentId = ctx.instance[relation.foreignKey];
          return parentModel.findById(parentId).then((parentInstance) => {
            if (!parentInstance) {
              reject(
                new Error(
                  `No ${parentModelName} with ID=${parentId}`
                  + ` for property ${relation.propertyName}`,
                ),
              );
            } else {
              resolve();
            }
          });
        }));
      Promise.all(promises).then(() => {
        next();
      }).catch((err) => {
        next(err);
      });
    }
  });
}

function addForeignKeyIntegrityCheckHookOnRemove(Model) {
  Model.observe('before delete', (ctx, next) => {
    if (ctx.where) {
      const relations = getModelRelations(ctx.Model);
      const promises = relations
        .filter(relation => ['hasMany', 'hasOne'].indexOf(relation.type) >= 0)
        .map(relation => new Promise((resolve, reject) => {
          const childrenModelName = relation.model;
          const childrenModel = ctx.Model.app.models[childrenModelName];
          const parentId = ctx.where[getModelPrimaryKey(ctx.Model)];
          return childrenModel.find({
            where: { [relation.foreignKey]: parentId },
          }).then((children) => {
            if (children.length > 0) {
              reject(
                new Error(
                  `${ctx.Model.modelName} with ID=${parentId}`
                  + ` has ${children.length} ${relation.propertyName} and can't be deleted`,
                ),
              );
            } else {
              resolve();
            }
          });
        }));
      Promise.all(promises).then(() => {
        next();
      }).catch((err) => {
        next(err);
      });
    }
  });
}

module.exports = function (Model) {
  addForeignKeyIntegrityCheckHookOnCreate(Model);
  addForeignKeyIntegrityCheckHookOnRemove(Model);
};
