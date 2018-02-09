import { BootScript } from '@mean-expert/boot-script';

@BootScript()
class HelloWorld {

  constructor(app: any) {
    const router = app.loopback.Router();
    router.get('/hello/world', (req, res) => {
      res.end(`Hello! It's ${new Date().toISOString()}`);
    });
    router.post('/hello/world', (req, res) => {
      const name = req.body.name;
      res.end(`Hello ${name}! It's ${new Date().toISOString()}`);
    });
    app.use(router);
  }

}

module.exports = HelloWorld;
