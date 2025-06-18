import Tarefas from "./page/Tarefas";
import PageBase from "./page/PageBase";
import Home from "./page/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<PageBase/>}>

                    <Route index element={<Home/>}/>

                    <Route path='tarefas' element={<Tarefas/>}/>
                    
                    {/* <Route path='*' element={<Pagina404/>}></Route> */}
                
                </Route>
            </Routes>
        </BrowserRouter>
    )
}