
import {Navigate, Outlet} from 'react-root-dom'

export default function ProtectedRoute({children}){
{!window.localStorage.getItem("token") ? <Outlet /> : <Navigate to="login" />}
}