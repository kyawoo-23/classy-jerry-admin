import React, { useState } from 'react'
import './Orders.css'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import OrderCard from './OrderCard'
import { useCollection } from '../../hooks/useCollection'

export default function Orders() {
  const { documents, isPending } = useCollection('users')
  let noPending = true
  let noPast = true

  return (
    <Container>
      <Tabs defaultActiveKey="pending-orders" id="orders-tab" className="mb-3">
        <Tab eventKey="pending-orders" title="Pending Orders">
          <Row className='justify-content-center'>
            {isPending && <Spinner className='mx-auto mt-5' animation="grow" variant="warning" />}
            {!isPending && documents && documents.map((doc, idx) => {
              return (
                doc.orders && (
                  doc.orders.map((d, i) => {
                    return (d.orderStatus === 'review' || d.orderStatus === 'deliver') && (
                      <React.Fragment key={i}>
                        {noPending = false}
                        <OrderCard 
                          doc={d} 
                          customerName={doc.displayName} 
                          customerId={doc.id} 
                        />
                      </React.Fragment>
                    )
                  })
                )
              )
            })}
            {!isPending && noPending && <p className='text-white text-center mt-5'>No pending orders yet.</p>}
          </Row>
        </Tab>
        <Tab eventKey="past-orders" title="Past Orders">
          <Row className='justify-content-center'>
            {isPending && <Spinner className='mx-auto mt-5' animation="grow" variant="warning" />}
            {!isPending && documents && documents.map((doc, idx) => {
              return (
                doc.orders && (
                  doc.orders.map((d, i) => {
                    return d.orderStatus === 'complete' && (
                      <React.Fragment key={i}>
                        {noPast = false}
                        <OrderCard 
                          doc={d} 
                          customerName={doc.displayName} 
                          customerId={doc.id} 
                        />
                      </React.Fragment>
                    )
                  })
                )
              )
            })}
            {!isPending && noPast && <p className='text-white text-center mt-5'>No past orders yet.</p>}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  )
}
