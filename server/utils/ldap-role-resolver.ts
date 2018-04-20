import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { providers } from '../providers';

const ldapProviderOptions = providers ? providers.ldap : null;

export class LdapRoleResolver {

  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  getUserRoles(userId: number): Observable<string[]> {
    return this.resolveLdapUserRoles(userId);
  }

  private resolveLdapUserRoles(userId: number): Observable<string[]> {
    if (ldapProviderOptions) {
      const findOneUserIdentity: (filter) => Observable<string[]> =
      Observable.bindNodeCallback(this.app.models.UserIdentity.findOne)
        .bind(this.app.models.UserIdentity);
      return findOneUserIdentity({ where: { userId } }).map((userIdentity: any) => {
        if (userIdentity && userIdentity.provider === 'ldap') {
          const existingRoles = Object.getOwnPropertyNames(ldapProviderOptions.rolesMapping);
          return existingRoles.filter((role) => {
            const ldapGroups = ldapProviderOptions.rolesMapping[role];
            return this.isMemberOfAtLeastOneLdapGroup(userIdentity, ldapGroups);
          });
        }
      });
    }
    return Observable.of([]);
  }

  private isMemberOfAtLeastOneLdapGroup(userIdentity: any, ldapGroups: string[]) {
    return userIdentity.profile.memberOf.some(group => ldapGroups.indexOf(group) >= 0);
  }
}
