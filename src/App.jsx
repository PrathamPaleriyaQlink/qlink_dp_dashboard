import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router';
import Home from './pages/Home';
import RootLayout from './layout/RootLayout';

import "primereact/resources/themes/md-dark-deeppurple/theme.css"; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import Login from './pages/Login';
import Campaign from './pages/Campaign';



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route path='/' element={<Home/>}/>
        <Route path='/campaign' element={<Campaign/>}/>
      </Route>
      <Route path='/login' element={<Login/>}/>
    </>
  )
);

function App() {
  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App
