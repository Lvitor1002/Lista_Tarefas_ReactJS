import './Header.css'
import {Sidebar} from '../Sidebar'
import * as Fa from "react-icons/fa";
import * as Ai from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useState } from 'react';





export default function Header(){

    const [sidebar, setSidebar] = useState(false)

    const alternarSidebar = () => setSidebar(prev => !prev)

    return(
            <div className="controleHeader">

                <Link to="#" className="iconeMenu">

                    <Fa.FaBars onClick={alternarSidebar}/>

                </Link>

                <nav className={sidebar ? 'opcoesMenu ativo' : 'opcoesMenu'}>

                    <ul className='opcoesMenu-items'>

                        <li className='alternarIcone'>
                            
                            {/* Fechar menu ao clicar no "X" */}
                            <Link to="#" className="iconeMenu" onClick={alternarSidebar}>

                                <Ai.AiOutlineClose />

                            </Link>
                        </li>
                        
                        {Sidebar.map((item, index) => {

                            return(
                                <li key={index} className={item.classeNome}>
                                    
                                    <Link to={item.caminho} onClick={alternarSidebar}>

                                        {item.icone}
                                        <span>{item.titulo}</span>

                                    </Link>
                                </li>
                            )

                        })}
                    </ul>
                </nav>

                {sidebar && <div className="overlay" onClick={alternarSidebar} />}


            </div>
    )
}