import { Link } from 'react-router-dom'
import './Home.css'
export default function Home(){
    return(
        <div className="controleHome">

            <div className="textos">
                <h1>To Do</h1>
                <h2>Lista de Tarefas</h2>

                <Link to="tarefas">
                    <p>Começar</p>
                </Link>
            </div>
            
        </div>
    )
}