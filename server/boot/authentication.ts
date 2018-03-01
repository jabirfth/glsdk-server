import { BootScript } from '@mean-expert/boot-script';
import { PassportConfigurator } from 'loopback-component-passport';
import { providers } from '../providers';
import { Logger } from '../utils/logger';

const logger = new Logger('Authentication BootScript');

@BootScript()
class Authentication {

  constructor(app: any) {
    app.enableAuth();
    if (providers) {
      this.initPassportAuthentication(app);
    }
  }

  private patchPassportConfiguratorForLdap(passportConfigurator): void {
    logger.info('Patching passport configurator for LDAP...');
    passportConfigurator.buildUserLdapProfile = function (user, options) {
      const profile: any = {};
      for (const profileAttributeName in options.profileAttributesFromLDAP) {
        const ldapAttributeName = options.profileAttributesFromLDAP[profileAttributeName];
        const values = [].concat(user[ldapAttributeName]);
        if (values.length > 0) {
          profile[profileAttributeName] = values.length > 1 ? values : values[0];
        }
      }
      if (!profile.username) {
        profile.username = [].concat(user['cn'])[0];
      }
      if (!profile.id) {
        profile.id = user['uid'];
      }
      if (!profile.emails) {
        const email = [].concat(user['mail'])[0];
        if (!!email) {
          profile.emails = [{ value: email }];
        }
      }
      return profile;
    };
  }

  private initPassportAuthentication(app: any): void {
    logger.info('Initializing passport authentication...');
    const passportConfigurator = new PassportConfigurator(app);

    this.patchPassportConfiguratorForLdap(passportConfigurator);

    passportConfigurator.init();

    passportConfigurator.setupModels({
      userModel: app.models.user,
      userIdentityModel: app.models.userIdentity,
      userCredentialModel: app.models.userCredential,
    });

    Object.getOwnPropertyNames(providers).forEach((provider: string) => {
      const config = providers[provider];
      config.session = config.session !== false;
      passportConfigurator.configureProvider(provider, config);
    });
  }

}

module.exports = Authentication;
