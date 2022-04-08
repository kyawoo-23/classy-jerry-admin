import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext' 

export default function NavBar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href='/'>{user ? user.email : 'Admin'}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='ms-auto'>
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/orders">
              <Nav.Link>Orders</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/roles">
              <Nav.Link>Roles</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/create">
              <Nav.Link>Create</Nav.Link>
            </LinkContainer>
            {user && 
              <Nav.Link onClick={logout} disabled={isPending}>
                <span className='menu-title'>{isPending ? 'Logging out' : 'Logout'}</span>
              </Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
