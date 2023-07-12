import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const ssl = process.env.SSL === 'true' ? true : false;
  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, keyPath)),
      cert: fs.readFileSync(path.join(__dirname, certPath)),
    };
  }
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const allowList = [
    'https://willws--botafogo.myvtex.com',
    'https://luigui--botafogo.myvtex.com',
    'https://jonas--botafogo.myvtex.com',
    'https://victoriamedeiros--botafogo.myvtex.com',
    'https://homolog--botafogo.myvtex.com',
    'https://store.botafogo.com.br/',
  ];

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const hostname = process.env.HOSTNAME || 'localhost';

  app.enableCors({
    origin: allowList,
  });

  await app.listen(port, hostname, () => {
    const address =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + address);
  });
}
bootstrap();
