import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import './PageBase.css'



export default function PageBase(){
    return(
        <main>
            <Header/>
            <Outlet/>
        </main>
    )
}