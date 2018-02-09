import { BootScript } from '@mean-expert/boot-script';
import { Logger } from '../utils/logger';

const logger = new Logger('InitRoles BootScript');

@BootScript()
class InitRoles {

  constructor(app: any) {
    const promises = ['admin', 'agent']
      .map(name => app.models.Role.findOrCreate({ where: { name } }, { name }));
    Promise.all(promises)
      .then(() => logger.info('Roles are initialized'))
      .catch(err => logger.error(err));
  }

}

module.exports = InitRoles;
