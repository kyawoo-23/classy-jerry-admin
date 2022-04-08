import React, { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

export default function ItemImg({ img, updateItemImg, deleteItemImg, itemId, isItemImgUpdating }) {
  const [chgImg, setChgImg] = useState(undefined)

  const handleChange = e => {
    setChgImg(undefined)
    let selected = e.target.files[0]
    setChgImg(selected)
  }

  return (
    <Col className='mb-3' xs={12} md={4}>
      <Card style={{cursor: 'default'}}>
        <Card.Img 
          variant="top" 
          src={chgImg === undefined ? img.url : URL.createObjectURL(chgImg)} 
        />
        <Card.Body>
          <Form.Control 
            type="file" 
            placeholder="Input image" 
            accept='image/*'
            size="sm"
            onChange={handleChange}
          />
          <div className='d-flex justify-content-between mt-2'>
            <Button 
              size="sm" 
              variant='outline-danger'
              onClick={() => {
                window.confirm("Delete image?") && deleteItemImg(img.id, img.url)}
              }
              disabled={isItemImgUpdating}
            >
              Delete
            </Button>
            <Button 
              size="sm"
              variant="warning" 
              onClick={() => updateItemImg(chgImg, img.id)}
              disabled={isItemImgUpdating}
            >
              {isItemImgUpdating ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className='me-1'
                  />
                    Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
