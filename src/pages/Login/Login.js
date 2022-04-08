import React, { useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import loginPic from '../../icons/undraw_security_re_a2rk.svg'
import eye from '../../icons/eye.png'
import hidden from '../../icons/hidden.png'
import InputGroup from 'react-bootstrap/InputGroup'
import { useLogin } from '../../hooks/useLogin'
import { useViewport } from '../../hooks/useViewport'
import Error from '../../components/Error/Error'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const { login, error, isPending } = useLogin()
  const { width } = useViewport()
  const breakpoint = 992
  let isSmall = width < breakpoint ? true : false

  const handleSubmit = e => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <Container>
      <Stack className='login-form'>
        <img className='mx-auto mb-3' style={{width: '110px', height: '110px'}} src={loginPic} alt='login-pic' />
        <h4 className='text-white text-center'>Login to your Account</h4>
        <Form className='w-75 pt-3 p-md-3 mx-auto' onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className='text-white'>Email address</Form.Label>
            <Form.Control 
              size={isSmall ? 'sm' : 'md'}
              type="email" 
              placeholder="Enter email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className='text-white'>Password</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                size={isSmall ? 'sm' : 'md'}
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text style={{cursor: 'pointer'}} onClick={() => setShowPwd(!showPwd)}>
                <img 
                  className='eye-icon' 
                  src={showPwd ? eye : hidden} 
                  alt={showPwd ? 'show' : 'hidden'}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <div className='d-flex justify-content-end'>
            {!isPending && 
              <Button className='px-md-4' variant="outline-warning" type="submit">
                <span style={{whiteSpace: 'nowrap'}}>Login</span>
              </Button>
            }
            {isPending && 
              <Button className='px-md-4' variant="outline-warning" disabled type="submit">
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className='me-1'
                />
                <span style={{whiteSpace: 'nowrap'}}>Loading</span>
              </Button>
            }
          </div>
          {error && <Error err={error} />}
        </Form>
      </Stack>
    </Container>
  )
}
