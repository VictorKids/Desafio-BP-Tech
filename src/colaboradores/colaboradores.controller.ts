import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Logger } from '@nestjs/common';
import { ColaboradoresService } from './colaboradores.service';
import { Prisma } from '@prisma/client';

@Controller('colaboradores')
export class ColaboradoresController {
    logger: Logger;
    constructor(private readonly colaboradoresService: ColaboradoresService) {
        this.logger = new Logger();
    }

    @Get()    
    findAll(@Query('departamento') departamento?: string){
        if(departamento){
            this.logger.log('GET request received - find all collaborators from a department')
        }else{
            this.logger.log('GET request received - find all collaborators')
        }
        return this.colaboradoresService.findAll(departamento)
    }

    @Post()
    register(@Body() colaborador: Prisma.ColaboradorCreateInput){
        this.logger.log('POST request received - register a new collaborators')
        return this.colaboradoresService.register(colaborador)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatedColaborador: Prisma.ColaboradorCreateInput){
        this.logger.log("PATCH request received - update a collaborator's data")

        return this.colaboradoresService.update(+id, updatedColaborador)
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        this.logger.log('DELETE request received - remove a collaborator')
        return this.colaboradoresService.remove(+id)
    }

}