import { Body, Controller, Delete, Get, Param, Patch, Post, Logger } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { Prisma } from '@prisma/client';

@Controller('departamentos')
export class DepartamentosController {
    logger: Logger;
    constructor(private readonly depatamentosService: DepartamentosService) {
        this.logger = new Logger();
    }

    /* 
    Buscar dados dos departamentos no Banco de Dados
    */
    @Get()    
    findAll(){
        try{
        this.logger.log('[GET] request received - find all departments')
        return this.depatamentosService.findAll()
        }catch(error){
            return "Failed Request"
        }
    }

    /* 
    Registrar um novo departamento no Banco de Dados
     - Body: {departamento} - um json contendo o campo "nome"
    */
    @Post()
    register(@Body() departamento: Prisma.DepartamentoCreateInput){
        try{
            this.logger.log('[POST] request received - register a new department')
            return this.depatamentosService.register(departamento)
        }catch(error){
            return "Failed Request"
        }
    }

    /* 
    Atualizar os dados de um departamento no Banco de Dados
     -> Parametro :       {id}           - identificador do departamento no Banco de Dados
     -> Body      : {updateDepartamento} - um json contendo o campo "nome"
    */
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatedDepartamento: Prisma.DepartamentoCreateInput){
        try{
        this.logger.log("[PATCH] request received - update a department's data")
        return this.depatamentosService.update(+id, updatedDepartamento)            
        }catch(error){
            return "Failed Request"
        }

    }

    /* 
    Remover um departamento do Banco de Dados
     -> Parametro: {id} - identificador do departamento no Banco de Dados
    */
    @Delete(':id')
    remove(@Param('id') id: string){
        try{
        this.logger.log('[DELETE] request received - remove a department')
        return this.depatamentosService.remove(+id)            
        }catch(error){
            return "Failed Request"
        }

    }

}
