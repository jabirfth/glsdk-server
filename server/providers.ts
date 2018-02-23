const { Logger } = require('./utils/logger');

const logger = new Logger('Provider Configuration');

const franceConnectBaseUrl = process.env.FRANCE_CONNECT_BASE_URL
    || 'https://fcp.integ01.dev-franceconnect.fr/api/v1';
const applicationBaseUrl = process.env.BASE_URL || 'http://localhost:3000';

let providersBuild = {};
if (process.env.FRANCE_CONNECT_CLIENT_ID) {
  providersBuild = Object.assign(
        {},
        providersBuild, {
          'france-connect': {
            provider: 'france-connect',
            module: 'passport-france-connect',
            authorizationURL: `${franceConnectBaseUrl}/authorize?state=123&nonce=123`,
            tokenURL: `${franceConnectBaseUrl}/token`,
            userProfileURL: `${franceConnectBaseUrl}/userinfo?schema=openid`,
            clientID: process.env.FRANCE_CONNECT_CLIENT_ID
              || 'REPLACE THIS',
            clientSecret: process.env.FRANCE_CONNECT_CLIENT_SECRET
              || 'REPLACE THAT',
            callbackURL: `${applicationBaseUrl}/auth/france-connect/callback`,
            callbackPath: '/auth/france-connect/callback',
            successRedirect: process.env.FRANCE_CONNECT_SUCCESS_URL || '//localhost:4200',
            scope: ['email', 'openid', 'profile', 'address', 'phone'],
          },
        },
    );
}

if (process.env.LDAP_SERVER_URL) {
  providersBuild = Object.assign(
        {},
        providersBuild,{
          ldap: {
            provider: 'ldap',
            authScheme: 'ldap',
            module: 'passport-ldapauth',
            authPath: '/auth/ldap',
            json: true,
            rolesMapping: {
              agent: ['CN=Utilisateurs du Bureau à distance,CN=Builtin,DC=adam,DC=net'],
              admin: ['CN=Admins du domaine,CN=Users,DC=adam,DC=net'],
            },
            profileAttributesFromLDAP: {
              login: 'cn',
              username: 'uid',
              displayName: 'displayName',
              memberOf: 'memberOf',
            },
            server: {
              url: process.env.LDAP_SERVER_URL || 'ldap://REPLACETHIS:38018',
              bindDn: process.env.LDAP_SERVER_BIND_DN || 'REPLACE HERE',
              bindCredentials: process.env.LDAP_SERVER_BIND_CREDENTIALS || 'REPLACE THAT',
              searchBase: process.env.LDAP_SERVER_SEARCH_BASE || 'REPLACE',
              searchFilter: process.env.LDAP_SERVER_SEARCH_FILTER
              || '(&(cn={{username}})(objectclass=user))',
            },
          },
        },
    );
}

logger.info(JSON.stringify(providersBuild));

export const providers = providersBuild;
