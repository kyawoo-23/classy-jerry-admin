import React, { useState } from 'react'
import './Home.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Item from '../../components/Item/Item'
import { useCollection2 } from '../../hooks/useCollection2'
import { useViewport } from '../../hooks/useViewport'
import arrow from '../../icons/arrow.svg'

export default function Home() {
  const { width } = useViewport()
  const breakpoint = 992
  let count = width < breakpoint ? 4 : 6 
  const [orderDesc, setOrderDesc] = useState(true)
  const { documents, isPending, seeMore, showSeeMoreBtn } = useCollection2('itemsList', count, orderDesc)

  const handleSort = () => {
    setOrderDesc(!orderDesc)
  }

  return (
    <>
      <Container>
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='main-title'>Items</h2>
          <button onClick={handleSort} className='sort-btn'>
            <img 
              className={'arrow-icon me-1 ' + (orderDesc ? '' : 'reverse')} 
              src={arrow} 
              alt={orderDesc ? 'newest icon' : 'oldest icon'} 
            />
            {orderDesc ? 'Newest' : 'Oldest'}
          </button>
        </div>
        <Row>
          {isPending && <Spinner className='mx-auto' animation="grow" variant="warning" /> }
          {!isPending && documents && documents.map((doc, idx) => (
            <Item doc={doc} key={idx} />
          ))}
        </Row>

        {showSeeMoreBtn && !isPending && documents && (
          <div className='d-flex justify-content-center mb-5 mt-3'>
            <button className='see-more-btn' onClick={seeMore}>See More</button>       
          </div>
        )}
        {!showSeeMoreBtn && !isPending && documents && (
          <p className='text-white d-flex justify-content-center mb-5 mt-4'>
            You have reached the end!
          </p>
        )}
      </Container>
    </>
  )
}
