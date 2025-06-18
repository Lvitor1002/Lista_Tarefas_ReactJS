import Swal from 'sweetalert2';
import axios from 'axios'

export class ApiRepository{

    constructor(){

        this.api = axios.create({
            baseURL: "https://684c9cd1ed2578be881f3c14.mockapi.io/tarefa/texto"
        })
    }


    async buscarTarefas(){
        try{
            const respostaApi = await this.api.get() 
            
            return respostaApi.data

        }catch(erro){

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Erro inesperado ao buscar tarefa: ${erro}`,
            })
            throw erro
        }
    } 

    async criarTarefa(nomeTarefa,categoria){
        try{
            const respostaApi = await this.api.post('',{
                nomeTarefa: nomeTarefa, //< [Nome] vem do map [t.nome] em Tarefas.jsx
                categoria: categoria,
            })
            
            return respostaApi.data

        }catch(erro){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Erro inesperado ao criar tarefa: ${erro}`,
            })
            throw erro
        }
    }

    async removerTarefa(id){
        try{
            await  this.api.delete(`/${id}`)

        }catch(erro){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Erro inesperado ao remover tarefa: ${erro}`,
            })
            throw erro
        }
    }

    async atualizarTarefa(nomeTarefa,categoria,id){
        try{
            const respostaApi = await this.api.put(`/${id}`,{
                nomeTarefa,
                categoria,
            })

            return respostaApi.data

        }catch(erro){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Erro inesperado ao atualizar tarefa: ${erro}`,
            })
            throw erro
        }
    }
}

