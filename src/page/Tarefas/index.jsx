import './Tarefas.css'
import Swal from 'sweetalert2'
import { ApiRepository } from '../../services/ApiRepository'
import { useEffect, useState, useMemo } from 'react'

export default function Tarefas() {

    const [tarefas, setTarefas] = useState([])
    const [exibirFormulario, setExibirFormulario] = useState(false) 
    const [editando, setEditando] = useState(null)
    const [inputsFormularios,setInputsFormularios] = useState({tarefa:'',categoria:''})
    const [termoPesquisa, setTermoPesquisa] = useState('') 

    const [filtroAtivo, setFiltroAtivo] = useState('todas')
    const [tarefasConcluidas, setTarefasConcluidas] = useState({})

    const fecharFormulario = () => {
        setExibirFormulario(false)
    }


    async function carregarTarefas(){
        try{
            const dados = await new ApiRepository().buscarTarefas()
            const dadosArray = Array.isArray(dados) ? dados : []
            
            setTarefas(dadosArray)

            // Atualiza o estado 'tarefasConcluidas'. Recebe o estado anterior (prev) como argumento.
            setTarefasConcluidas(prev => {


                // Cria uma cópia do estado anterior para não modificar o original diretamente (imutabilidade).
                const novasConclusoes = {...prev}

                
                dadosArray.forEach(t => {

                    // Se a tarefa com o id 't.id' ainda não existir no estado (não tiver valor de conclusão registrado):
                    if(novasConclusoes[t.id] === undefined){

                        // Adiciona a tarefa ao estado com valor inicial 'false' (indicando que ainda não foi concluída).
                        novasConclusoes[t.id] = false
                    }
                })
                
                // Retorna o novo objeto de tarefas concluídas, que o React usará para atualizar o estado.
                return novasConclusoes
            })

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
                const tarefaTratada = inputsFormularios.tarefa?.trim()
                if(!tarefaTratada){
                    Swal.fire({
                        icon: "info",
                        title: "Oops...",
                        text: `Campo tarefa vazio ou incorreto..`,
                    })
                    return
                }
                if(!inputsFormularios.categoria || inputsFormularios.categoria.trim() === ""){
                    Swal.fire({
                        icon: "info",
                        title: "Oops...",
                        text: `Selecione uma categoria..`,
                    })
                    return
                }
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
            const tarefaTratada = inputsFormularios.tarefa?.trim();

            if(!tarefaTratada){
                Swal.fire({
                    icon: "info",
                    title: "Oops...",
                    text: `Campo tarefa vazio ou incorreto..`,
                })
                return
            }
            if(!inputsFormularios.categoria || inputsFormularios.categoria.trim() === ""){
                Swal.fire({
                    icon: "info",
                    title: "Oops...",
                    text: `Selecione uma categoria..`,
                })
                return
            }

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
    
    }

    // Função para alternar o estado de conclusão de uma tarefa
    function alternarConclusao (id){

        // Atualiza o estado 'tarefasConcluidas' de forma funcional (baseado no valor anterior)
        setTarefasConcluidas(prev => ({

            // Mantém o estado atual para todas as outras tarefas
            ...prev,   

            // Inverte o estado (true/false) da tarefa com o id fornecido
            [id]: !prev[id]
        }))
    }

    // Calcula as tarefas a serem exibidas com base nos filtros
    const tarefasExibidas  = useMemo(()=>{

        // Filtra a lista de tarefas de acordo com os critérios
        return tarefas.filter(t => {

            // Converte o termo de pesquisa para minúsculo (para busca case-insensitive)
            const termo = termoPesquisa.toLowerCase()
            
            // Verifica se o nome da tarefa ou a categoria contém o termo pesquisado
            const correspondeTermo = t.nomeTarefa.toLowerCase().includes(termo) || 
                                    t.categoria.toLowerCase().includes(termo)
            
            // Verifica se a tarefa está marcada como concluída (busca no estado tarefasConcluidas)
            const estaConcluida = tarefasConcluidas[t.id] || false

            if (filtroAtivo === 'pendentes') 
            {
                return correspondeTermo && !estaConcluida;
            } 

            else if (filtroAtivo === 'finalizadas') 
            {
                return correspondeTermo && estaConcluida;
            }

            // Caso o filtro seja "todas", exibe qualquer tarefa que corresponda ao termo
            return correspondeTermo
        })

    // Dependências do useMemo: recalcula só quando algum destes mudar
    },[tarefas, termoPesquisa, filtroAtivo, tarefasConcluidas])



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

                            <button 
                                type='button'
                                className={filtroAtivo === 'todas' ? 'ativo' : ''}
                                onClick={() => setFiltroAtivo('todas')}
                            
                            >   Todas
                            </button>

                            <button 
                                type='button'
                                className={filtroAtivo === 'finalizadas' ? 'ativo' : ''}
                                onClick={() => setFiltroAtivo('finalizadas')}
                            
                            >   Finalizadas
                            </button>

                            <button 
                                type='button'
                                className={filtroAtivo === 'pendentes' ? 'ativo' : ''}
                                onClick={() => setFiltroAtivo('pendentes')}
                            
                            >   Pendentes
                            </button>

                        </div>
                    </div>
                    
                        {tarefasExibidas.map((t)=>{

                            const estaConcluida = tarefasConcluidas[t.id] || false

                            return(

                                <div 
                                    className={`campoTarefas ${estaConcluida ? 'concluida' : '' }`} 

                                    key={t.id}>


                                    <div className="checkNome">
                                        <input 
                                            type="checkbox" 
                                            name="tarefa" 
                                            id={`tarefa-${t.id}`}
                                            checked={estaConcluida}
                                            onChange={() => alternarConclusao(t.id)}
                                            
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
                            )

                        })}

                    
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
                    
                        value={inputsFormularios.tarefa}
                        onChange={(e) => setInputsFormularios(prev => ({
                            ...prev,
                            tarefa: e.target.value
                        }))}
                    />

                    <select 
                        name="categoria" 
                        
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

