import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

// const getMongoString = (configService: ConfigService) =>
//   'mongodb://' +
//   configService.get('DB_LOGIN') +
//   ':' +
//   configService.get('DB_PASSWORD') +
//   '@' +
//   configService.get('DB_HOST') +
//   ':' +
//   configService.get('DB_PORT') +
//   '/' +
//   configService.get('DB_AUTHDATABASE');

const getMongoString = (configService: ConfigService) =>
  'mongodb://admin:admin@localhost:27017/todos';

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  console.log(getMongoString(configService));
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};
