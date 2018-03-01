const applicationBaseUrl = process.env.BASE_URL || 'http://localhost:3000';

function requireEnvironmentVariables(varNames) {
  varNames.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Env ${varName} is needed`);
    }
  });
}

const providers = {};

if (process.env.LDAP_SERVER_URL) {
  requireEnvironmentVariables([
    'LDAP_SERVER_URL',
    'LDAP_SERVER_BIND_DN',
    'LDAP_SERVER_BIND_CREDENTIALS',
    'LDAP_SERVER_AGENT_GROUPS',
    'LDAP_SERVER_ADMIN_GROUPS',
  ]);

  providers['ldap'] = {
    provider: 'ldap',
    authScheme: 'ldap',
    module: 'passport-ldapauth',
    authPath: '/auth/ldap',
    json: true,
    rolesMapping: {
      agent: JSON.parse(process.env.LDAP_SERVER_AGENT_GROUPS),
      admin: JSON.parse(process.env.LDAP_SERVER_ADMIN_GROUPS),
    },
    profileAttributesFromLDAP: {
      login: 'cn',
      username: 'uid',
      displayName: 'displayName',
      memberOf: 'memberOf',
    },
    server: {
      url: process.env.LDAP_SERVER_URL,
      bindDn: process.env.LDAP_SERVER_BIND_DN,
      bindCredentials: process.env.LDAP_SERVER_BIND_CREDENTIALS,
      searchBase: process.env.LDAP_SERVER_SEARCH_BASE,
      searchFilter: process.env.LDAP_SERVER_SEARCH_FILTER
        || '(&(cn={{username}})(objectclass=user))',
    },
  };
}

if (process.env.FRANCE_CONNECT_BASE_URL) {
  requireEnvironmentVariables([
    'FRANCE_CONNECT_CLIENT_ID',
    'FRANCE_CONNECT_CLIENT_SECRET',
  ]);

  providers['france-connect'] = {
    provider: 'france-connect',
    module: 'passport-france-connect',
    authorizationURL: `${process.env.FRANCE_CONNECT_BASE_URL}/authorize?state=123&nonce=123`,
    tokenURL: `${process.env.FRANCE_CONNECT_BASE_URL}/token`,
    userProfileURL: `${process.env.FRANCE_CONNECT_BASE_URL}/userinfo?schema=openid`,
    clientID: process.env.FRANCE_CONNECT_CLIENT_ID,
    clientSecret: process.env.FRANCE_CONNECT_CLIENT_SECRET,
    callbackURL: `${applicationBaseUrl}/auth/france-connect/callback`,
    callbackPath: '/auth/france-connect/callback',
    successRedirect: process.env.FRANCE_CONNECT_SUCCESS_URL || '//localhost:4200',
    scope: ['email', 'openid', 'profile', 'address', 'phone'],
  };
}

module.exports = providers;
