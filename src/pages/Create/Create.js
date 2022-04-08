import React, { useState } from 'react'
import './Create.css'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { fbTimestamp, db, storage } from '../../firebase/config'
import { addDoc, collection, updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function Create() {
  const [name, setName] = useState('')
  const [itemImg, setItemImg] = useState([])
  const [primaryImg, setPrimaryImg] = useState(undefined)
  const [category, setCategory] = useState('')
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [price, setPrice] = useState('')
  const [progress, setProgress] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const defaultCategories = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'headwear', label: 'Headwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ]

  const defaultColors = [
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'brown', label: 'Brown' },
    { value: 'blue', label: 'Blue' },
  ]

  const defaultSizes = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' }
  ]

  const handleFileChange = e => {
    setItemImg([])
    let selected = e.target.files
    Array.from(selected).map(file => {
      setItemImg(prevImg => ([
        ...prevImg, file
      ]))
    });
  }

  const handlePrimaryImage = e => {
    setPrimaryImg(undefined)
    let selected = e.target.files[0]
    setPrimaryImg(selected)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsPending(true)
    const availableColors = colors.map(color => {
      return color.value
    })

    const availableSizes = sizes.map(size => {
      return size.value
    })

    const itemDetails = {
      name,
      photoURL: null,
      primaryImgURL: null,
      category: category.value,
      availableColors,
      availableSizes,
      price,
      timestamp: fbTimestamp
    }
    console.log(itemDetails)

    const uploadFiles = (files, itemId) => {
      const promises = []
      Array.from(files).map(file => {
        let imgId = Math.random()
        const storageRef = ref(storage, `itemImages/${itemId.id}/${imgId}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        promises.push(uploadTask)
        uploadTask.on("state_changed", snapshot => {
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100)
          setProgress(prog)
        }, err => {
          console.log(err.message)
          setIsPending(false)
        }, async () => {
          await getDownloadURL(uploadTask.snapshot.ref)
          .then(url => {
            // setImgURLs(prevURL => [...prevURL, url]) 
            updateDoc(doc(db, "itemsList", itemId.id), {
              photoURL: arrayUnion({url, id: imgId})
            }).then(() => {
              console.log('updated')
              setIsPending(false)
              setName('')
              setPrice('')
            })
          })
        })
      })
      Promise.all(promises)
      .then(() => 
        console.log('finished')
      )
      .catch(err => console.log(err))
    }

    const uploadPrimaryImg = (file, itemId) => {
      let imgId = Math.random()
      const storageRef = ref(storage, `itemImages/${itemId.id}/primaryImg/${imgId}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on("state_changed", snapshot => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100)
        setProgress(prog)
      }, err => {
        console.log(err.message)
        setIsPending(false)
      }, async () => {
        await getDownloadURL(uploadTask.snapshot.ref)
        .then(url => {
          // setImgURLs(prevURL => [...prevURL, url]) 
          updateDoc(doc(db, "itemsList", itemId.id), {
            primaryImgURL: {url, id: imgId}
          }).then(() => {
            console.log('updated primary')
          })
        })
      })
    }

    addDoc(collection(db, 'itemsList'), itemDetails).then(itemId => {
      console.log(itemId.id)
      uploadPrimaryImg(primaryImg, itemId)
      uploadFiles(itemImg, itemId)
    }).catch(err => {
      console.log(err.message)
      setIsPending(false)
    })
  }

  return (
    <Container>
      <Form className='mt-3 w-75 mx-auto' onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Item Name:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Category:</Form.Label>
          <Select 
            placeholder="Select Category" 
            options={defaultCategories} 
            onChange={option => setCategory(option)} 
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Colors:</Form.Label>
          <CreatableSelect 
            placeholder="Select Colors" 
            options={defaultColors} 
            closeMenuOnSelect={false} 
            isMulti 
            onChange={option => setColors(option)} 
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Sizes:</Form.Label>
          <Select 
            placeholder="Select Sizes" 
            options={defaultSizes} 
            closeMenuOnSelect={false} 
            isMulti 
            onChange={option => setSizes(option)} 
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Price:</Form.Label>
          <Form.Control 
            type="tel" 
            placeholder="Input price" 
            value={price}
            onChange={e => setPrice(e.target.value)} 
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Primary Image:</Form.Label>
          <Form.Control 
            type="file" 
            placeholder="Input primary image" 
            onChange={handlePrimaryImage} 
            accept='image/*'
            required
          />
        </Form.Group>
        <div className='preview-img mb-3'>
          {primaryImg === undefined && (
            <p className='text-white'>Select an image to preview here!</p>
          )}
          {primaryImg !== undefined && (
            <img src={URL.createObjectURL(primaryImg)} />
          )}
        </div>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Item Images:</Form.Label>
          <Form.Control 
            type="file" 
            placeholder="Input images" 
            onChange={handleFileChange} 
            accept='image/*'
            multiple
            required
          />
        </Form.Group>
        <div className='preview-img mb-3'>
          {itemImg.length === 0 && (
            <p className='text-white'>Select some images to preview them here!</p>
          )}
          {itemImg.length !== 0 && itemImg.map((item, idx) => (
            <img key={idx} src={URL.createObjectURL(item)} />
          ))}
        </div>
        {!isPending && (
          <div className='d-flex justify-content-end'>
            <Button className='ms-auto' variant="primary" type="submit">Create</Button>
          </div>
        )}
        {isPending && (
          <div className='d-flex justify-content-end'>
            <Button variant="primary" type="submit" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                className='me-1'
              />
              Loading...
            </Button>
          </div>
        )}
      </Form>
    </Container>
  )
}
