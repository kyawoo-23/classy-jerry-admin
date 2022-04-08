import React from 'react'
import './OrderCard.css'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import truck from '../../icons/truck-solid.svg'
import { useNavigate } from 'react-router-dom'

export default function OrderCard({ doc, customerName, customerId }) {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const navigate = useNavigate()
  
  const toOrderDetails = () => {
    navigate('/orders/details', {
      state: {
        address: doc.address, 
        phone: doc.phone, 
        items: doc.items,
        itemSysDetails: doc.itemDetails,
        note: doc.note,
        orderAt: doc.orderAt,
        orderDate: doc.orderAt.toDate().getDate(),
        orderMonth: month[doc.orderAt.toDate().getMonth()],
        orderYear: doc.orderAt.toDate().getFullYear(),
        orderId: doc.orderId, 
        orderStatus: doc.orderStatus,
        totalAmount: doc.totalAmount,
        customerName,
        customerId
      }
    })
  }

  return (
    <Col xs={12} md={10} lg={8} className='mb-1'>
      <div className='order-card'>
        <Stack direction='horizontal'>
          <div className='order-date'>
            <p style={{textAlign: 'center', marginBottom: '0'}}>
              {doc.orderAt.toDate().getDate()}
              <br />
              {month[doc.orderAt.toDate().getMonth()]}
            </p>
          </div>
          <div className='order-details'>
            <div className='order-details-left'>
              <p className='order-id'><b>Order ID : {doc.orderId}</b></p>
              <p><small>
                [ {doc.items.length} ] item{doc.items.length > 1 && 's'}
              </small></p>
              <div>
                <img src={truck} className='truck-icon' alt='truck-icon'/>
                <span className='ms-2' style={{overflow: 'hidden', color: '#f2f2f2'}}>
                  {doc.address}
                </span>
              </div>
            </div>
            <div className='order-details-right'>
              <h6>Total <span>$</span>{doc.totalAmount}</h6>
              <Button 
                variant='outline-warning' 
                style={{width: '82px'}}
                onClick={toOrderDetails}
              >
                View
              </Button>
            </div>
          </div>
        </Stack>
        <hr style={{margin: '5px', marginBottom: '0' ,background: '#f2f2f2'}} />
        <p className='order-status'>
          <small>
            Status : 
            {doc.orderStatus === 'review' && (
              <span 
                style={{ textTransform: 'capitalize', color: '#11d67b' }}
                className='ms-1'
              >
                {doc.orderStatus}ing
              </span>
            )}
            {doc.orderStatus === 'deliver' && (
              <span 
                style={{ textTransform: 'capitalize', color: '#FFB037' }}
                className='ms-1'
              >
                {doc.orderStatus}ing
              </span>
            )}
            {doc.orderStatus === 'complete' && (
              <span
                style={{ textTransform: 'capitalize', color: '#66ff00'}}
                className='ms-1'
              >
                {doc.orderStatus}d
              </span>
            )}
          </small>
        </p>
      </div>
    </Col>
  )
}
