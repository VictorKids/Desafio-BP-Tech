import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Logger } from '@nestjs/common';
import { ColaboradoresService } from './colaboradores.service';
import { Prisma } from '@prisma/client';

@Controller('colaboradores')
export class ColaboradoresController {
    logger: Logger;
    constructor(private readonly colaboradoresService: ColaboradoresService) {
        this.logger = new Logger();
    }

    /*
    Buscar por todos os colaboradores (filtrados ou não por um dado departamento) no Banco de Dados
     -> Query : {departamento} - filtragem opicional sobre as buscas de colaboradores
    */
    @Get()    
    findAll(@Query('departamento') departamento?: string){
        try{
            if(departamento){
                this.logger.log('GET request received - find all collaborators from a department')
            }else{
                this.logger.log('GET request received - find all collaborators')
            }
            return this.colaboradoresService.findAll(departamento)
        }catch(error){
            return "Failed Request"
        }

    }

    /* 
    Registrar um novo colaborador no Banco de Dados
     - Body: {colaborador} - um json contendo os campos "nome", "email" e opcionalmente "departamento"
    */  
    @Post()
    register(@Body() colaborador: Prisma.ColaboradorCreateInput){
        try{
            this.logger.log('POST request received - register a new collaborators')
            return this.colaboradoresService.register(colaborador)
        }catch(error){
            return "Failed Request"
        }
    }

    /* 
    Atualizar os dados de um colaborador no Banco de Dados
     -> Parametro :       {id}           - identificador do colaborador no Banco de Dados
     -> Body      : {updateColaborador}  - um json contendo opções de alterações entre "nome", "email" e/ou "departamento"
    */
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatedColaborador: Prisma.ColaboradorCreateInput){
        try{
            this.logger.log("PATCH request received - update a collaborator's data")
            return this.colaboradoresService.update(+id, updatedColaborador)                
        }catch(error){
            return "Failed Request"
        }
    }

    /* 
    Remover um colaborador do Banco de Dados
     -> Parametro: {id} - identificador do colaborador no Banco de Dados
    */
    @Delete(':id')
    remove(@Param('id') id: string){
        try{
        this.logger.log('DELETE request received - remove a collaborator')
        return this.colaboradoresService.remove(+id)            
        }catch(error){
            return "Failed Request"
        }
    }
}