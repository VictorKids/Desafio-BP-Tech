import { Injectable } from '@nestjs/common';
import { NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DepartamentosService {
    logger: Logger;
    constructor (private readonly databaseService: DatabaseService) {
        this.logger = new Logger();
    }


    /*
    Buscar por todos os departamentos no Banco de Dados
    */
    async findAll(){
        this.logger.log('Departments names list requested')
            return this.databaseService.departamento.findMany( {} )
    }


    /* 
    Registrar um novo departamento no Banco de Dados
     - caso o nome de departamento já esteja em uso, o registro será negado.
    */
    async register(departamento: Prisma.DepartamentoCreateInput){

        this.logger.log('Checking if department name already in use')
        const departamentosArray = await this.databaseService.departamento.findMany({
            where:{ 
                name: departamento.name,
            }})
        if(departamentosArray.length > 0){
            this.logger.error('Falied to create department, name already in use')
            throw new ConflictException('Department already exists')
        }
        this.logger.log('Valid name, creating new department')
        return this.databaseService.departamento.create( {data: departamento,} )
    }


    /* 
    Atualizar os dados de um departamento no Banco de Dados
     - caso o ID fornecido não existir na tabela de departamentos, a atualização será negada.
     - caso o novo nome de departamento já esteja em uso, o registro será negado.
    - caso algum colaborador esteja associado a este departamento, o nome associado será atualizado.

    */
    async update(id: number, updatedDepartamento: Prisma.DepartamentoCreateInput ){

        this.logger.log("Checking if ID is valid")
        const departamentosByIdArray   = await this.databaseService.departamento.findMany({
            where:{ 
                id: id,
            }})
        if(departamentosByIdArray.length <= 0){ 
            this.logger.error('Invalid ID')
            throw new NotFoundException('ID not found')
        }
        this.logger.log('Valid ID')

        this.logger.log('Checking if the new departiment name is valid')
        const departamentosByNameArray = await this.databaseService.departamento.findMany({
            where:{ 
                name: updatedDepartamento.name,
            }})
        if(departamentosByNameArray.length <= 0 ){ 
            this.logger.log('Valid department name')

            this.logger.log('Updating collaborators from department')  
            const renamedDepartmentColab = await this.databaseService.colaborador.updateMany({
                where: {
                    departamento: departamentosByIdArray[0].name,
                },
                data: {
                    departamento: updatedDepartamento.name
                },
            }) 

            this.logger.log('Updating department name')
            return this.databaseService.departamento.update({
                where: {
                    id: id,
                },
                data: updatedDepartamento,
            })
        }

        this.logger.error('Invalid department name, name already in use')
        throw new ConflictException('Department already exists')
    }


    /* 
    Remover um departamento do Banco de Dados
     - caso o ID fornecido não existir na tabela de departamentos, a remoção será negada.
     - caso algum colaborador esteja associado a este departamento, a associação será removida.
    */
    async remove(id: number){

        this.logger.log("Checking if ID is valid")
        const departamentosArray = await this.databaseService.departamento.findMany({
            where:{ 
                id: id,
            }})

        if(departamentosArray.length > 0){ 
            this.logger.log('Valid ID') 

            this.logger.log('Dissociating collaborators from department')  
            const renamedDepartmentColab = await this.databaseService.colaborador.updateMany({
                where: {
                    departamento: departamentosArray[0].name,
                },
                data: {
                    departamento: null
                },
            })         

            this.logger.log('Removing department')                
            return this.databaseService.departamento.delete( {where: {id: id,}} )
        }

        this.logger.error('Invalid ID')
        throw new NotFoundException('ID not found')
    }
}