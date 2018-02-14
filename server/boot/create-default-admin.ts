import { BootScript } from '@mean-expert/boot-script';
import { Logger } from '../utils/logger';

const logger = new Logger('CreateDefaultAdmin BootScript');

@BootScript()
class CreateDefaultAdmin {

  constructor(app: any) {
    this.createAdmin(app);
  }

  async createAdmin(app: any) {
    try {
      await app.dataSources.authDB.transaction(async (models) => {
        const { User, Role, RoleMapping } = models;
        const results = await User.findOrCreate(
          {
            where: {
              username: 'admin',
            },
          },
          {
            username: 'admin',
            email: 'admin@admin.com',
            password: 'admin',
          },
        );
        const user = results[0];
        const created = results[1];
        if (created) {
          const results = await Role.findOrCreate(
            {
              where: {
                name: 'admin',
              },
            },
            {
              name: 'admin',
            },
          );
          await RoleMapping.findOrCreate(
            {
              where: {
                principalId: user.id,
                roleId: results[0].id,
              },
            },
            {
              principalType: app.models.RoleMapping.USER,
              principalId: user.id,
              roleId: results[0].id,
            },
          );
          logger.info('Admin user created');
        } else {
          logger.info('Admin user already exists');
        }
      });
    } catch (e) {
      logger.error(e);
    }
  }

}

module.exports = CreateDefaultAdmin;
