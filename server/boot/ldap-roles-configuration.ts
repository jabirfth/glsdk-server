import { BootScript } from '@mean-expert/boot-script';
import { LdapRoleResolver } from '../utils/ldap-role-resolver';
import { Logger } from '../utils/logger';

const logger = new Logger('LdapRolesConfiguration BootScript');

@BootScript()
class LdapRolesConfiguration {

  private app: any;
  private ldapRoleResolver: LdapRoleResolver;

  constructor(app: any) {
    this.app = app;
    this.ldapRoleResolver = new LdapRoleResolver(app);
    this.addAfterUserIdentitySaveHook();
  }

  private addAfterUserIdentitySaveHook() {
    logger.info('Registering after save hook on UserIdentity...');
    const UserIdentity = this.app.models.UserIdentity;
    const Role = this.app.models.Role;
    const RoleMapping = this.app.models.RoleMapping;
    UserIdentity.observe('after save', (ctx, next) => {
      const userIdentity = ctx.instance;
      if (userIdentity.provider === 'ldap') {
        logger.info(`User ${userIdentity.userId} is an LDAP user. Updating roles...`);
        this.ldapRoleResolver.getUserRoles(userIdentity.userId).subscribe((roleNames) => {
          logger.info(`User ${userIdentity.userId} is eligible for roles: ${roleNames.join(', ')}`);
          const promises = roleNames.map((name) => {
            let role;
            return Role.findOrCreate({ where: { name } }, { name }).then((result, created) => {
              role = result[0];
              if (created) {
                logger.info(`Role ${name} was created with ID: ${role.id}`);
              } else {
                logger.info(`Role ${name} found in database with ID: ${role.id}`);
              }
              logger.info(`Removing previous user's RoleMappings`);
              return RoleMapping.destroyAll({
                userId: userIdentity.userId,
                roleId: userIdentity.roleId,
              });
            }).then(() => {
              logger.info(`Creating new user's RoleMappings`);
              return RoleMapping.create({
                principalType: this.app.models.RoleMapping.USER,
                principalId: userIdentity.userId,
                roleId: role.id,
              });
            });
          });
          Promise.all(promises).then(() => {
            next();
          }).catch((err) => {
            next(err);
          });
        });
      }
    });
  }
}

module.exports = LdapRolesConfiguration;
