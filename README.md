# glsdk-server
Loopback (NodeJS) based server for Grand Lyon SDK

[![Build Status](https://travis-ci.org/grandlyon/glsdk-server.svg?branch=master)](https://travis-ci.org/grandlyon/glsdk-server)

## Description

The app is base on [LoopBack](http://loopback.io) v3.

See Loopback [Documentation](https://loopback.io/doc/en/lb3/)

LoopBack is a highly-extensible, open-source Node.js framework that enables you to:
- Create dynamic end-to-end REST APIs with little or no coding.
- Access data from major relational databases, MongoDB, SOAP and REST APIs.
- Incorporate model relationships and access controls for complex APIs.
- Separable components for file storage, third-party login, and OAuth 2.0


This app includes :
- User Management with muliples Role (agent, admin)
- Authentification mode : Database, LDAP, FranceConnect
- Models 

## Install

```
npm run install
npm run start
```

## Documentation

 * [How to add custom model ?](docs/models.md)
 * [How to add custom route ?](docs/routes.md)
 * [How to add custom code on startup ?](docs/bootinit.md)
 
#Configuration
 [Configuration](docs/configuration.md)
