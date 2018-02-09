module.exports = function (City) {
  /** https://loopback.io/doc/en/lb3/Operation-hooks.html */

  City.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance.nameMin = ctx.instance.name.toLowerCase();
    } else {
      ctx.data.nameMin = ctx.data.name.toLowerCase();
    }
    next();
  });
};
