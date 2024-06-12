import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { dataSource } from './ormconfig';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        await dataSource.initialize();
        return dataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
