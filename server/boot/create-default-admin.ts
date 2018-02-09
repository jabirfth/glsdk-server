import { BootScript } from '@mean-expert/boot-script';
import { Logger } from '../utils/logger';

const logger = new Logger('CreateDefaultAdmin BootScript');

@BootScript()
class CreateDefaultAdmin {

  constructor(app: any) {
    app.models.User.findOrCreate(
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
    ).then((result) => {
      const user = result[0];
      const created = result[1];
      if (created) {
        logger.info('Admin user does not exist');
        return new Promise((resolve, reject) => {
          app.models.Role.findOrCreate(
            {
              where: {
                name: 'admin',
              },
            },
            {
              name: 'admin',
            },
          ).then((result) => {
            return app.models.RoleMapping.findOrCreate(
              {
                where: {
                  principalId: user.id,
                  roleId: result[0].id,
                }
              },
              {
                principalType: app.models.RoleMapping.USER,
                principalId: user.id,
                roleId: result[0].id,
              }
            );
          }).then((result) => {
            resolve(!!result);
          }).catch((err) => {
            reject(err);
          });
        });
      } else {
        logger.info('Admin user already exists');
      }
    }).then((created) => {
      if (created) {
        logger.info('Admin user created');
      }
    }).catch((err) => {
      logger.error(err);
    });
  }

}

module.exports = CreateDefaultAdmin;
