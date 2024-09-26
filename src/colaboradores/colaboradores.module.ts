import { Module } from '@nestjs/common';
import { ColaboradoresController } from './colaboradores.controller';
import { ColaboradoresService } from './colaboradores.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [ColaboradoresController],
    providers: [ColaboradoresService],
})
export class ColaboradoresModule {}
