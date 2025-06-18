import { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'



export default function Header(){

    const [opcoesAbertas,setOpcoesAbertas] = useState(false)
    const [barraAberta, setBarraAberta] = useState(true)

    const alternarOpcoes = () =>{
        setOpcoesAbertas(!opcoesAbertas)
    }

    const alternarBarra  = () => {
        setBarraAberta(!barraAberta)
    }

    return(
        <>
            
            <div className={`controleHeader ${barraAberta ? '' : 'recolhido'}`}>
                
                {barraAberta ? (
                    <i className="bi bi-chevron-left fechar" onClick={alternarBarra}></i>
                ) : (
                    <i className="bi bi-chevron-right abrir" onClick={alternarBarra}></i>
                )}

                


                <div className="controleMenu">

                    <Link to="/">
                        <img src="./logo.png" alt="Logo Image" />
                    </Link>

                </div>

                <nav>
                    <ul>
                            <li className="controleGrupos">
                                <i className="bi bi-clipboard2-check-fill"></i>
                                <Link to="tarefas">
                                    <h2>Tarefas</h2>
                                </Link>
                            </li>

                        
                        <div className="controleOpcoes" onClick={alternarOpcoes}>

                            <div className="controleGrupos">

                                <i className='bi bi-folder-fill'></i>

                                <h2>Categorias</h2>

                                <i className={`${opcoesAbertas ? 'bi bi-chevron-up' : 'bi bi-chevron-down'}`}></i>
                            </div>

                            {opcoesAbertas && (
                                <ul className="opcoes">
                                    <li>Esporte</li>
                                    <li>Casa</li>
                                    <li>Construção</li>
                                    <li>Estudos</li>
                                    <li>Lazer</li>
                                </ul>
                            )}
                        </div>

                    </ul>
                </nav>

            </div>
        </>
    )
}