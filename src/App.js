import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Home/Home'
import Roles from './pages/Roles/Roles'
import Orders from './pages/Orders/Orders'
import OrderDetails from './pages/Orders/OrderDetails'
import Create from './pages/Create/Create'
import ItemDetails from './pages/ItemDetails/ItemDetails'
import Login from './pages/Login/Login'
import { useAuthContext } from './hooks/useAuthContext'

function App() {
  const { authIsReady, user } = useAuthContext()
  return (
    <div className='App'>
      {authIsReady && (
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route path='/' 
              element={user ? <Home /> : <Navigate replace to='/login' />} 
            />
            <Route path='/roles' 
              element={user ? <Roles /> : <Navigate replace to='/login' />} 
            />
            <Route path='/create' 
              element={user ? <Create /> : <Navigate replace to='/login' />} 
            />
            <Route path='/orders' 
              element={user ? <Orders /> : <Navigate replace to='/login' />} 
            />
            <Route path='/orders/details' 
              element={user ? <OrderDetails /> : <Navigate replace to='/login' />} 
            />
            <Route path='/items' 
              element={<Navigate replace to='/' />} 
            />
            <Route path='/items/:id' 
              element={user ? <ItemDetails /> : <Navigate replace to='/login' />} 
            />
            <Route path='/*' element={<Navigate replace to='/' />} />
            <Route path='/login' 
              element={!user ? <Login /> : <Navigate replace to='/'/>}  
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
