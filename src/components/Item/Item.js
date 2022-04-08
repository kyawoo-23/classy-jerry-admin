import React from 'react'
import './Item.css'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'

export default function Item({ doc }) {
  return (
    <Col xs={6} lg={4} key={doc.id}>
      <Link to={`/items/${doc.id}`}>
        <Card className="bg-white text-dark mb-4">
          <Card.Img 
            variant='top' 
            src={doc.primaryImgURL.url} 
            alt={`${doc.name} img`} 
          />
          <Card.Body className='d-flex justify-content-between'>
            <Card.Text className='me-1'>
              {doc.name}
            </Card.Text>
            <Card.Text>
              <span>$</span>
              <b>{doc.price}</b>
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  )
}
