# Configuration

List of all environnement variables used on this APP 

## Datasources

Environnement variable use on file ```server/datasources.local.ts```

 1.1 database for federal data (cities, roads, ... )
```
      - FEDERAL_DB_HOST=federal-db
      - FEDERAL_DB_NAME=${FEDERAL_DB_NAME}
      - FEDERAL_DB_USER=${FEDERAL_DB_USER}
      - FEDERAL_DB_PASSWORD=${FEDERAL_DB_PASSWORD}
```
 1.2 database for custom app data (users, app data, ... )
      
```
      - APP_DB_HOST=app-db
      - APP_DB_NAME=${APP_DB_NAME}
      - APP_DB_USER=${APP_DB_USER}
      - APP_DB_PASSWORD=${APP_DB_PASSWORD}
```
 1.3 shared folder
```
      - FILE_STORAGE_PATH=${FILE_STORAGE_PATH}
```

## Providers

Environnement variable use on file ```server/providers.ts```

 * France Connect provider
```
      - FRANCE_CONNECT_BASE_URL=${FRANCE_CONNECT_BASE_URL}
      - FRANCE_CONNECT_CLIENT_ID=${FRANCE_CONNECT_CLIENT_ID}
      - FRANCE_CONNECT_CLIENT_SECRET=${FRANCE_CONNECT_CLIENT_SECRET}
      - BASE_URL=https://${BASE_URL}/lb
      - FRANCE_CONNECT_SUCCESS_URL=//${BASE_URL}
```
 * LDAP provider
```      
      - LDAP_SERVER_URL=${LDAP_SERVER_URL}
      - LDAP_SERVER_BIND_DN=${LDAP_SERVER_BIND_DN}
      - LDAP_SERVER_BIND_CREDENTIALS=${LDAP_SERVER_BIND_CREDENTIALS}
      - LDAP_SERVER_SEARCH_BASE=${LDAP_SERVER_SEARCH_BASE}
      - LDAP_SERVER_SEARCH_FILTER=${LDAP_SERVER_SEARCH_FILTER}
      - LDAP_SERVER_AGENT_GROUPS=${LDAP_SERVER_AGENT_GROUPS}
      - LDAP_SERVER_ADMIN_GROUPS=${LDAP_SERVER_ADMIN_GROUPS}
```

## Usage example

To define the environment variables:
```
LDAP_SERVER_URL="ldap://myldapserver" \
LDAP_SERVER_BIND_DN="CN=administrator,DC=mycompany,DC=com" \
LDAP_SERVER_BIND_CREDENTIALS="admin" \
LDAP_SERVER_AGENT_GROUPS='["CN=Agents,CN=Builtin,DC=MyDomain,DC=com"]' \
LDAP_SERVER_ADMIN_GROUPS='["CN=Administrators,CN=Builtin,DC=MyDomain,DC=com"]' \
npm start
```

You can check your confirguration in the startup logs of the application:
```
info: Application Configuration - {"federalDB":{"connector":"mysql","host":"localhost","port":3306,"database":"grandlyon","user":"db_user","password":"********"},"fileStorage":{"connector":"loopback-component-storage","provider":"filesystem","root":"/tmp/storage"},"appDB":{"connector":"mysql","host":"localhost","port":3306,"database":"grandlyon","user":"db_user","password":"********"}}

info: Application Providers - {"ldap":{"provider":"ldap","authScheme":"ldap","module":"passport-ldapauth","authPath":"/auth/ldap","json":true,"rolesMapping":{"agent":["CN=Agents,CN=Builtin,DC=MyDomain,DC=com"],"admin":["CN=Administrators,CN=Builtin,DC=MyDomain,DC=com"]},"profileAttributesFromLDAP":{"login":"cn","username":"uid","displayName":"displayName","memberOf":"memberOf"},"server":{"url":"ldap://myldapserver","bindDn":"CN=administrator,DC=mycompany,DC=com","bindCredentials":"admin","searchFilter":"(&(cn={{username}})(objectclass=user))"}}}
```