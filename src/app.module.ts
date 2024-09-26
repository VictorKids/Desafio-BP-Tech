import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DepartamentosModule, ColaboradoresModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
