import { AppModule } from './app.module';
import { APIServer } from 'common/server/ApiServer';
async function bootstrap() {
  const apiServer = new APIServer( 'frontAPi' , AppModule);
  await apiServer.startServer();
  console.log("Finshed Loading Server");
}
// http
bootstrap();
