import { Container } from 'semantic-ui-react'
import NavBar from './nav/NavBar'
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container className='main'>
            <Outlet />
          </Container>
        </>
      )}
    </>
  )
}

export default App
