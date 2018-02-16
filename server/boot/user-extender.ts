import { BootScript } from '@mean-expert/boot-script';
import { Logger } from '../utils/logger';

const logger = new Logger('UserExtender BootScript');

@BootScript()
class UserExtender {

  constructor(app: any) {
    const { RoleMapping, User, Role } = app.models;

    User.replaceRoles = async (userId, roleIds, cb) => {
      try {
        logger.info(`Replacing User[id=${userId}] roles with ${roleIds}`);
        await RoleMapping.deleteAll({ where: { principalId: userId } });
        const roles = await Role.find({ where: { id: { inq: roleIds } } });
        const roleMappings = roles.map(role => ({
          roleId: role.id,
          principalId: userId,
          principalType: 'USER',
        }));
        await RoleMapping.create(roleMappings);
        cb();
      } catch (e) {
        logger.info(`Error while replacing User[id=${userId}] roles with ${roleIds}: ${e.message}`);
        cb(e);
      }
    };

    User.remoteMethod(
      'replaceRoles', {
        accepts: [
          {
            arg: 'id',
            type: 'number',
            required: true,
          },
          {
            arg: 'roles',
            type: 'array',
            http: { source: 'body' },
          },
        ],
        http: {
          path: '/:id/roles',
          verb: 'put',
          status: 204,
        },
      },
    );
  }

}

module.exports = UserExtender;
