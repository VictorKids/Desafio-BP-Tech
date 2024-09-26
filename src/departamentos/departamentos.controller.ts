import { Body, Controller, Delete, Get, Param, Patch, Post, Logger } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { Prisma } from '@prisma/client';

@Controller('departamentos')
export class DepartamentosController {
    logger: Logger;
    constructor(private readonly depatamentosService: DepartamentosService) {
        this.logger = new Logger();
    }

    @Get()    
    findAll(){
        this.logger.log('GET request received - find all departments')
        return this.depatamentosService.findAll()
    }

    @Post()
    register(@Body() departamento: Prisma.DepartamentoCreateInput){
        this.logger.log('POST request received - register a new department')
        return this.depatamentosService.register(departamento)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatedDepartamento: Prisma.DepartamentoCreateInput){
        this.logger.log("PATCH request received - update a department's data")
        return this.depatamentosService.update(+id, updatedDepartamento)
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        this.logger.log('DELETE request received - remove a department')
        return this.depatamentosService.remove(+id)
    }

}
