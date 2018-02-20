# Configuration

List of all environnement variables used on this APP 

## datasources

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
      - AUTH_DB_HOST=auth-db
      - AUTH_DB_NAME=${AUTH_DB_NAME}
      - AUTH_DB_USER=${AUTH_DB_USER}
      - AUTH_DB_PASSWORD=${AUTH_DB_PASSWORD}
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
```
