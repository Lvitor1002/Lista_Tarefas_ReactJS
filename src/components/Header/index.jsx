import { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'



export default function Header(){

    const [barraAberta, setBarraAberta] = useState(true)

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

                    

                    </ul>
                </nav>

            </div>
        </>
    )
}