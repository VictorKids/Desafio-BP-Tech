import { Injectable } from '@nestjs/common';
import { NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ColaboradoresService {
    logger: Logger;
    constructor (private readonly databaseService: DatabaseService) {
        this.logger = new Logger();
    }


    /*
    Buscar por todos os colaboradores (filtrados ou não por um dado departamento) no Banco de Dados
     - caso o departamento não esteja registrado, a busca será negada.
    */
    async findAll(departamento?: string){

        if(departamento){

            this.logger.log('Checking if department name is valid')
            const departamentosArray = await this.databaseService.departamento.findMany({
                where: {
                    name: departamento
                }})
            if(departamentosArray.length <= 0){
                this.logger.error('Invalid department')
                throw new NotFoundException('Department not found')
            }
            this.logger.log('Valid department')

            this.logger.log('Collaborators list requested')
            return this.databaseService.colaborador.findMany({
                where: {
                    departamento: departamento,
                }})
        }
        
        this.logger.log('Departments names list requested')
        return this.databaseService.colaborador.findMany()   
    }


    /* 
    Registrar um novo colaborador no Banco de Dados
     - caso o email do colaborador já esteja em uso, o registro será negado.
     - caso o departamento associado ao colaborador não existir, o registro será negado.
    */    
    async register(colaborador: Prisma.ColaboradorCreateInput){

        this.logger.log('Checking if email already in use...')
        const colaboradoresByEmailArray = await this.databaseService.colaborador.findMany({
            where:{ 
                email: colaborador.email,
            }})
        if(colaboradoresByEmailArray.length > 0){  
            this.logger.error('Falied to create collaborator, email already in use')
            throw new ConflictException('Email already in use')
        }

        if(colaborador.departamento){
            this.logger.log('Checking if department name is valid...')
            const colaboradoresByDepartamentoArray = await this.databaseService.departamento.findMany({
                where:{
                    name: colaborador.departamento,
                }})
            if(colaboradoresByDepartamentoArray.length <= 0){
                this.logger.error('Invalid department')
                throw new NotFoundException('Department not found')
            }
        }

        this.logger.log('Valid email and department, creating new collaborator')
        return this.databaseService.colaborador.create( {data: colaborador,} )
    }


    /* 
    Atualizar os dados de um colaborador no Banco de Dados
     - caso o ID fornecido não existir na tabela de colaboradores, a atualização será negada.
     - caso o novo email do colaborador já esteja em uso, o registro será negado.
     - caso o departamento associado ao colaborador não existir, o registro será negado.
    */
    async update(id: number, updatedColaborador: Prisma.ColaboradorCreateInput){

        this.logger.log("Checking if ID is valid...")
        const colaboradoresByIdArray = await this.databaseService.colaborador.findMany({
            where:{ 
                id: id,
            }})
        if(colaboradoresByIdArray.length <= 0){ 
            this.logger.error('Invalid ID')
            throw new NotFoundException('ID not found')
        }
        this.logger.log('Valid ID')

        if(updatedColaborador.email){ 
            this.logger.log('Checking if email already in use...')
            const colaboradoresByEmailArray = await this.databaseService.colaborador.findMany({
                where:{ 
                email: updatedColaborador.email,
            }})
            if(colaboradoresByEmailArray.length > 0){ 
                this.logger.error('Falied to update collaborator, email already in use')
                throw new ConflictException('Email already in use')
            }
            this.logger.log('Valid email')
        }

        if(updatedColaborador.departamento){
            this.logger.log('Checking if department name is valid...')
            const colaboradoresByDepartamentoArray = await this.databaseService.departamento.findMany({
                where:{
                    name: updatedColaborador.departamento,
                }})
            if(colaboradoresByDepartamentoArray.length <= 0){ 
                this.logger.error('Invalid department')
                throw new NotFoundException('Department not found')
            }
            this.logger.log('Valid department')
        }

        this.logger.log('Updating data')
        return this.databaseService.colaborador.update({
            where: {
                id: id,
            },
            data: updatedColaborador,
        })
    }


    /* 
    Remover um colaborador do Banco de Dados
     - caso o ID fornecido não existir na tabela de colaboradores, a remoção será negada.
    */
    async remove(id: number){

        this.logger.log("Checking if ID is valid...")
        const colaboradoresArray = await this.databaseService.colaborador.findMany({
            where:{ 
                id: id,
            }})
        if(colaboradoresArray.length > 0){     
            this.logger.log('Valid ID')  
            this.logger.log('Removing collaborator')                                              
            return this.databaseService.colaborador.delete( {where:{id: id,}} )
        }

        this.logger.error('Invalid ID')
        throw new NotFoundException('ID not found')
    }
}