# Models

Documentation on loopback Doc (https://loopback.io/doc/en/lb3/Defining-models.html)
  
## Create new model
 * with model generator : 
 
   ```lb model MyModel```
   
 * manuel
 via documentation (https://loopback.io/doc/en/lb3/Model-definition-JSON-file.html)  
 
## Attach new model to datasource

 * Edit file  ```server/model-config.json``` and add
```
  "MyModel": {
    "dataSource": "[myDataSource]"
  },
``` 

 
## database schema update

for create or update BDD schema with this new model, you can add you model on this file ``` server/component-config.json```
```
"loopback-component-auto-migrate": {
    ...
    "models": [
      ...
      "MyModel"
    ]
  }
``` 
  
  
## Expose model on REST API

You must expose via REST with edit file  ```server/model-config.json```
```
  "MyModel": {
    "public": true
  },
``` 

You can visualize new REST endpoint on [Swagger](http://localhost:3000/explorer/)
 
## Relations 

see [documentation](https://loopback.io/doc/en/lb3/Creating-model-relations.html)

* many-to-one [=> belongsTo](https://loopback.io/doc/en/lb3/BelongsTo-relations.html)
```
// road.json
"relations": {
    "city": {
      "type": "belongsTo",
      "model": "City",
      "foreignKey": "cityCode"
    }
  },
```

* one-to-many [=> hasMany](https://loopback.io/doc/en/lb3/HasMany-relations.html)
``` 
// city.json
"relations": {
    "roads": {
      "type": "hasMany",
      "model": "Road",
      "foreignKey": "cityCode"
    }
  },
```

## Mixins

Mixin is like 'hook' for add logic on Listener Models.
see documentation (https://loopback.io/doc/en/lb3/Operation-hooks.html)

* Example of common models mixin
 
```common/mixins.integrity-checks.js```, this mixin verify constraint on relations.

You can active for a model with add this lines on your ```my-model.json``` 
```
  ...
  "mixins": {
    "IntegrityCheck": {}
  },
  ...
``` 

* Example of custom model mixin

```common/models.city.js```

```
module.exports = function (City) {

  City.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance.nameMin = ctx.instance.name.toLowerCase();
    } else {
      ctx.data.nameMin = ctx.data.name.toLowerCase();
    }
    next();
  });
};

```
 
## ACL model
  
  * edit file ```common/models/my-model.json```
  * add elements on section ACL (see [doc](https://loopback.io/doc/en/lb3/Controlling-data-access.html#acl-rule-precedence))
  * Sample
```
"acls": [      
    {  // All action Deny for All   
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    { // Read action Allow for 'agent' role   
      "accessType": "READ",
      "principalType": "ROLE",
      "principalId": "agent",
      "permission": "ALLOW"
    },
    { // Read/Write action Allow for 'admin' role  
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "admin",
      "permission": "ALLOW"
    }
    ...
  ],
```

