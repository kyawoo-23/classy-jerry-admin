import React, { useState } from 'react'
import './OrderDetails.css'
import { useLocation, Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import allIcon from '../../icons/all.svg'
import { db } from '../../firebase/config'
import { doc, arrayRemove, arrayUnion, updateDoc, Timestamp } from 'firebase/firestore'

export default function OrderDetails() {
  const location = useLocation()
  const LENGTH = location.state && location.state.itemSysDetails.length
  const [stateOrderStatus, setStateOrderStatus] = useState(location.state.orderStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleOrder = async () => {
    setIsUpdating(true)
    const docRef = doc(db, "users", location.state.customerId)
    let newOrderStatus = null
    let orderStatus = stateOrderStatus
    if (stateOrderStatus === 'review') { 
      newOrderStatus = 'deliver'
      setStateOrderStatus('deliver')
    } else if (stateOrderStatus === 'deliver') {
      newOrderStatus = 'complete'
      setStateOrderStatus('complete')
    }
    await updateDoc(docRef, {
      orders: arrayRemove({
        address: location.state.address,
        itemDetails: location.state.itemSysDetails,
        items: location.state.items,
        note: location.state.note,
        orderAt: new Timestamp(location.state.orderAt.seconds, location.state.orderAt.nanoseconds),
        orderId: location.state.orderId,
        orderStatus: orderStatus,
        phone: location.state.phone,
        totalAmount: location.state.totalAmount
      })
    })
    await updateDoc(docRef, {
      orders: arrayUnion({
        address: location.state.address,
        itemDetails: location.state.itemSysDetails,
        items: location.state.items,
        note: location.state.note,
        orderAt: new Timestamp(location.state.orderAt.seconds, location.state.orderAt.nanoseconds),
        orderId: location.state.orderId,
        orderStatus: newOrderStatus,
        phone: location.state.phone,
        totalAmount: location.state.totalAmount
      })
    })
    setIsUpdating(false)
  }

  const getData = () => {
    var items = []
    for (var i = 0; i < LENGTH; i++) {
      items.push(
        <Col xs={12} lg={6} className='mb-4' key={i}>
          <Stack className='cart-item' direction='horizontal'>
            <Link to={`/items/${location.state.items[i].itemId}`}>
              <img className='cart-item-img' src={location.state.itemSysDetails[i].primaryImgURL.url} alt="item img" />
            </Link>
            <div className='card-item-detail ms-2'>
              <Stack>
                <div className='card-item-detail-1'>
                  <h3 className='item-name'>{location.state.itemSysDetails[i].name}</h3>
                </div>
                <div className='card-item-detail-2'>
                  <div className='item-color active me-3' style={{backgroundColor: location.state.items[i].itemColor}}></div>
                  <div className='item-size active'>{location.state.items[i].itemSize}</div>
                </div>
                <div className='card-item-detail-3 pt-2'>
                  <span className='item-price'><span>$</span>{location.state.itemSysDetails[i].price}</span>
                  <span className='item-quantity'>
                    <img className='qty-icon' src={allIcon} alt='qty-icon'/>
                    {location.state.items[i].itemQty}
                  </span>
                </div>
              </Stack>
            </div>
          </Stack>
        </Col>
      )
    }
    return items
  }

  return (
    <Container>
      {location.state ? (
        <>
          <div className='order-information mt-2 pt-3 pb-3'>
            <div className='d-flex justify-content-between'>
              <h5 className='text-white ms-3 order-id-details'>Order ID : {location.state.orderId}</h5>    
              <p className='text-white me-3'><b>
                {location.state.orderDate}-{location.state.orderMonth}-{location.state.orderYear}
              </b></p>
            </div>
            <div className='d-flex justify-content-between'>
              <h6 className='text-white ms-3'>Customer Name : {location.state.customerName} ({location.state.customerId})</h6>
            </div>
            <p className='text-white ms-3'>Phone : {location.state.phone}</p>
            <p className='text-white ms-3'>Address : {location.state.address}</p>
            <div className='d-flex justify-content-between'>
              <p className='text-white ms-3'>Note : 
                {location.state.note === '' ? 
                  <span className='text-muted'><i> no note </i></span> : 
                  <span> {location.state.note}</span>
                }
              </p>
              <p className='text-white me-3'><b>
                Total: <span>$</span>{location.state.totalAmount}
              </b></p>
            </div>
          </div>
          <Row className='mt-3'>
            {getData()}
          </Row>
          <div className='d-flex justify-content-end mb-5'>
            {stateOrderStatus !== 'complete' && (
              <Button variant='outline-danger'>Order Cancel</Button>
            )}
            <Button 
              className='ms-3' 
              variant={stateOrderStatus === 'review' ? 'success' : 'warning'}
              onClick={stateOrderStatus === 'complete' ? undefined : handleOrder}
              disabled={isUpdating }
            >
              <span style={{textTransform: 'capitalize'}}>
                {stateOrderStatus !== 'complete' ? stateOrderStatus + 'ing' : stateOrderStatus + 'd'}
              </span>
            </Button>
          </div>
        </>
      ) : (
        <p className='text-white text-center mt-5'>Nothing found.</p>
      )}
    </Container>
  )
}
