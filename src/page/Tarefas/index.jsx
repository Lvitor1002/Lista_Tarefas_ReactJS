import './Tarefas.css'
import Swal from 'sweetalert2'
import { ApiRepository } from '../../services/ApiRepository'
import { useEffect, useState } from 'react'

export default function Tarefas() {

    const [tarefas, setTarefas] = useState([])
    const [exibirFormulario, setExibirFormulario] = useState(false) 
    const [editando, setEditando] = useState(null)
    const [inputsFormularios,setInputsFormularios] = useState({tarefa:'',categoria:''})
    const [tarefasFiltradas, setPesquisadas] = useState([])
    const [termoPesquisa, setTermoPesquisa] = useState('') 

    const fecharFormulario = () => {
        setExibirFormulario(false)
    }


    async function carregarTarefas(){
        try{
            const dados = await new ApiRepository().buscarTarefas()
            const dadosArray = Array.isArray(dados) ? dados : []
            
            setTarefas(dadosArray)
            setPesquisadas(dadosArray)

        }catch(erro){

            throw new Error("Erro ao buscar dados",erro)
            
        }
    }
    
    useEffect(()=>{
        carregarTarefas()
        fecharFormulario()
    },[])

    async function enviar() {

        const { tarefa, categoria } =  inputsFormularios

        if(editando){
            await editar(editando)
            return
        }
        else{

            try{
    
                await new ApiRepository().criarTarefa(tarefa,categoria)
    
                await carregarTarefas()
    
                // Limpar campos e fechar formulário
                setInputsFormularios({ tarefa: '', categoria: '' })
    
                setExibirFormulario(false)
    
            }catch(erro){
    
                throw new Error("Erro ao criar tarefa",erro)
    
            }
        }


    }
    

    async function remover(id) {

        const swalWithBootstrapButtons = Swal.mixin({

        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        })
        
        const resultado = await swalWithBootstrapButtons.fire({
            title: `Deseja apagar o usuário?`,
            text: "Esta ação não poderá ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, remover!",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        })

        if(resultado.isConfirmed){
            try{

                await new ApiRepository().removerTarefa(id)

                await carregarTarefas()

            }catch(erro){
                throw new Error(`Erro ao remover tarefa: ${erro.message}`);
            }
        }
    }

    function iniciarEdicao(tarefa){

        setInputsFormularios({
            tarefa: tarefa.nomeTarefa,
            categoria: tarefa.categoria
        })

        setEditando(tarefa.id)
        setExibirFormulario(true)
    }

    async function editar(editando_id){
        try{

            await new ApiRepository().atualizarTarefa(inputsFormularios.tarefa,inputsFormularios.categoria,editando_id)

            await carregarTarefas()
            setEditando(null)

            // Limpar campos e fechar formulário
            setInputsFormularios({ tarefa: '', categoria: '' })
            setExibirFormulario(false);
            

        }catch(erro){
                throw new Error(`Erro ao atualizar tarefa: ${erro.message}`);

        }
    }

    function pesquisarTarefa(termo){
        
        setTermoPesquisa(termo)

        if(!termo.trim()){
            // Mostra todas se o campo estiver vazio
            setPesquisadas(tarefas)
            return
        }

        const termoLower = termo.toLowerCase()
        const filtradas = tarefas.filter(tarefa=>
            tarefa.nomeTarefa.toLowerCase().includes(termoLower) ||
            tarefa.categoria.toLowerCase().includes(termoLower)
        )
        setPesquisadas(filtradas)

    }



    return (
        <>
            <div className="controleTarefas">

                <div className="tarefas">

                    <h2>Todas as tarefas</h2>

                    <div className="topoTarefas">
                        <input 
                            type="text"
                            placeholder='Busque por uma tarefa' 
                            value={termoPesquisa}
                            onChange={(e) => pesquisarTarefa(e.target.value)}
                        />

                        <div className="grupoFiltros">
                            <button type='button'>Todas</button>
                            <button type='button'>Finalizadas</button>
                            <button type='button'>Pendentes</button>
                        </div>
                    </div>
                    
                        {tarefasFiltradas.map((t)=>(

                            <div className="campoTarefas" key={t.id}>


                                <div className="checkNome">
                                    <input 
                                        type="checkbox" 
                                        name="tarefa" 
                                        id={`tarefa-${t.id}`}
                                        
                                    />
                                    
                                    
                                    <label htmlFor={`tarefa-${t.id}`}>
                                        Categoria: {t.categoria}
                                    </label>

                                    <label htmlFor={`tarefa-${t.id}`}>
                                        Tarefa: {t.nomeTarefa}
                                    </label>
                                    
                                </div>

                                <div className="acoes">
                                    <i className="bi bi-pen-fill editar" onClick={()=>{
                                        setExibirFormulario(true)
                                        iniciarEdicao(t)
                                    }}></i>
                                    <i className="bi bi-trash2-fill remover" onClick={() => remover(t.id)}></i>
                                </div>

                            </div>

                        ))}

                    
                    <button 
                        type='submit' 
                        className='btnAdd'
                        onClick={()=> {
                            setEditando(null);
                            setExibirFormulario(true)
                        }}
                    >
                        Adicionar Tarefa
                    </button>
                    
                </div>

            </div>

            {exibirFormulario && (
                
                <div className="controleFormulario">

                <form className='formulario' onSubmit={(e) => {
                    e.preventDefault()
                    enviar()
                    }}>

                    {editando ? <h3>Editando Tarefa</h3> : <h3>Cadastre a sua tarefa</h3>}
                    
                    <input 
                        type="text" 
                        placeholder='Digite uma tarefa..'
                        required
                        value={inputsFormularios.tarefa}
                        onChange={(e) => setInputsFormularios(prev => ({
                            ...prev,
                            tarefa: e.target.value
                        }))}
                    />

                    <select 
                        name="categoria" 
                        required
                        value={inputsFormularios.categoria}
                        onChange={(e) => setInputsFormularios(prev => ({
                            ...prev,
                            categoria: e.target.value
                        }))}
                    >
                        <option value="">Categoria</option>
                        <option value="Esporte">Esporte</option>
                        <option value="Casa">Casa</option>
                        <option value="Construção">Construção</option>
                        <option value="Estudos">Estudos</option>
                        <option value="Lazer">Lazer</option>
                    </select>

                    <div className="botoes">

                        <button 
                            type='submit'
                            className='btnEnviar'
                        >
                            Enviar
                        </button>

                        <button 
                            type='button'
                            className='btnCancelar'
                            onClick={()=> {
                                setExibirFormulario(false)
                                setEditando(null) // Resetar edição
                            }}
                        >
                            Cancelar
                        </button>

                    </div>
                </form>

            </div>)}
        
        </>

    )
}