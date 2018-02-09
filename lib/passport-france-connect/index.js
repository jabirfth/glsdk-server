const util = require('util');
const passportOAuth = require('passport-oauth2');

const OAuth2Strategy = passportOAuth.Strategy;

function FranceConnectStrategy(options, verify) {
  OAuth2Strategy.call(this, options, verify);
  if (!options.userProfileURL) {
    throw new TypeError('FranceConnectStrategy requires a userProfileURL option');
  }
  this.userProfileURL = options.userProfileURL;
}

util.inherits(FranceConnectStrategy, OAuth2Strategy);

FranceConnectStrategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._oauth2.get(this.userProfileURL, accessToken, (err, body) => {
    if (err) {
      done(err);
    } else {
      try {
        const json = JSON.parse(body);
        const profile = {
          provider: this.name,
          id: json.ID,
          username: json.preferred_username || json.email,
          displayName: json.display_name,
          emails: [json.email],
          json,
        };
        done(null, profile);
      } catch (e) {
        done(e);
      }
    }
  });
};

module.exports = Object.assign({}, passportOAuth, { Strategy: FranceConnectStrategy });
