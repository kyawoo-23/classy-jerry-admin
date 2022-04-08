import React, { useEffect, useState } from 'react'
import './ItemDetails.css'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Spinner from 'react-bootstrap/Spinner'
import { useDocOnSnapshot } from '../../hooks/useDocOnSnapshot'
import { db, fbTimestamp, storage } from "../../firebase/config"
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { ref, uploadBytes, uploadBytesResumable, deleteObject, listAll, getDownloadURL } from 'firebase/storage'
import Button from 'react-bootstrap/Button'
import ItemImg from './ItemImg'

export default function ItemDetails() {
  const { id } = useParams()
  const { document, isPending, error } = useDocOnSnapshot('itemsList', id)
  const [selectColor, setSelectColor] = useState(null)
  const [selectSize, setSelectSize] = useState(null)
  const [selectCategory, setSelectCategory] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [primaryImg, setPrimaryImg] = useState(undefined)
  const [itemImg, setItemImg] = useState(undefined)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isItemImgUpdating, setIsItemImgUpdating] = useState(false)
  const [isItemImgAdding, setIsItemImgAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    document && document.name && (
      setName(document.name)
    )
    document && document.category && (
      setSelectCategory({ value: document.category })
    )
    document && document.price && (
      setPrice(document.price)
    )
    document && document.availableColors && (
      setSelectColor(document.availableColors.map(color => (
        { 
          label: color,
          value: color
        }
      )))
    )
    document && document.availableSizes && (
      setSelectSize(document.availableSizes.map(size => (
        { 
          label: size,
          value: size
        }
      )))
    )
  }, [document])

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

  const handlePrimaryImage = e => {
    setPrimaryImg(undefined)
    let selected = e.target.files[0]
    setPrimaryImg(selected)
  }

  const handleItemImage = e => {
    setItemImg(undefined)
    let selected = e.target.files[0]
    setItemImg(selected)
  }

  const addItemImg = () => {
    setIsItemImgAdding(true)
    if (itemImg !== undefined) {
      let imgId = Math.random()
      const storageRef = ref(storage, `itemImages/${id}/${imgId}`)
      const uploadTask = uploadBytesResumable(storageRef, itemImg)
      uploadTask.on("state_changed", snapshot => {
      }, err => {
        console.log(err.message)
        setIsItemImgAdding(false)
      }, async () => {
        await getDownloadURL(uploadTask.snapshot.ref)
        .then(url => {
          updateDoc(doc(db, "itemsList", id), {
            photoURL: arrayUnion({ url, id: imgId })
          }).then(() => {
            console.log('added')
            setIsItemImgAdding(false)
          })
        })
      })
    }
  }

  const updateItemImg = (file, imgId) => {
    setIsItemImgUpdating(true)
    if (file !== undefined) {
      const storageRef = ref(storage, `itemImages/${id}/${imgId}`)
      uploadBytes(storageRef, file).then(() => {
        console.log('Updated item img')
        setIsItemImgUpdating(false)
      }).catch(err => {
        console.log(err)
        setIsItemImgUpdating(false)
      })
    } else {
      setIsItemImgUpdating(false)
    }
  }

  const deleteItemImg = async (imgId, imgUrl) => {
    console.log(imgId, imgUrl)
    await updateDoc(doc(db, "itemsList", id), {
      photoURL: arrayRemove({ id: imgId, url: imgUrl })
    })
    await deleteObject(ref(storage, `itemImages/${id}/${imgId}`))
    console.log('deleted')
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteDoc(doc(db, "itemsList", id))
    const deleteFolder = (path) => {
      listAll(path)
      .then(dir => {
        dir.prefixes.forEach((folderRef) => {
          console.log(folderRef.fullPath)
          deleteFolder(ref(storage, folderRef.fullPath))
        });
        dir.items.forEach((fileRef) => {
          deleteFile(path, fileRef.name)
        });
      }).catch(error => {
        console.log(error)
      });
    }
    const deleteFile = async (pathToFile, fileName) => {
      const fileRef = ref(pathToFile, fileName);
      await deleteObject(fileRef)
      console.log('deleted')
    }
    const storageRef = ref(storage, `itemImages/${id}`)
    deleteFolder(storageRef)
    setIsDeleting(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    const availableColors = selectColor.map(color => {
      return color.value
    })

    const availableSizes = selectSize.map(size => {
      return size.value
    })

    const updatePrimaryImg = (file, itemId) => {
      const storageRef = ref(storage, `itemImages/${itemId}/primaryImg/${document.primaryImgURL.id}`)
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Updated primary img');
      }).catch(err => {
        setIsUpdating(false)
      })
    }

    const docRef = doc(db, "itemsList", id)
    await updateDoc(docRef, {
      name,
      category: selectCategory.value,
      price,
      timestamp: fbTimestamp,
      availableColors,
      availableSizes
    })
    primaryImg !== undefined && updatePrimaryImg(primaryImg, id)
    console.log(name, selectCategory.value, availableColors, availableSizes, price, primaryImg)
    setIsUpdating(false)
  }
  
  return (
    <Container>
      <Form className='w-75 mx-auto' onSubmit={handleUpdate}>
        <Row>
          {isPending && <Spinner className='mx-auto mt-5' animation="grow" variant="warning"/>}
          {!isPending && document && (
            <>
              <Col>
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
                    defaultValue={defaultCategories.filter(option => 
                      option.label === document.category.charAt(0).toUpperCase() + document.category.slice(1)
                    )}
                    onChange={option => setSelectCategory(option)} 
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='text-white'>Colors:</Form.Label>
                  <CreatableSelect 
                    placeholder="Select Colors" 
                    options={defaultColors} 
                    defaultValue={selectColor}
                    closeMenuOnSelect={false}
                    onChange={option => setSelectColor(option)} 
                    isMulti 
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='text-white'>Sizes:</Form.Label>
                  <Select 
                    placeholder="Select Sizes" 
                    options={defaultSizes} 
                    defaultValue={selectSize}
                    closeMenuOnSelect={false}
                    onChange={option => setSelectSize(option)} 
                    isMulti 
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
                  />
                </Form.Group>
                <div className='preview-img mb-3'>
                  {primaryImg === undefined && (
                    <img src={document.primaryImgURL.url} />
                  )}
                  {primaryImg !== undefined && (
                    <img src={URL.createObjectURL(primaryImg)} />
                  )}
                </div>
                <Form.Group className='mb-3'>
                  <Form.Label className='text-white'>Item Images:</Form.Label>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="file"
                      placeholder="Input an image to add new item image"
                      onChange={handleItemImage}
                      accept='image/*'
                    />
                    <Button 
                      onClick={addItemImg} 
                      variant="outline-warning"
                      disabled={isItemImgAdding}
                    >
                      {isItemImgAdding ? (
                        <>
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className='me-1'
                          />
                            Adding...
                        </>
                      ) : (
                        'Add new Item Img'
                      )}
                    </Button>
                  </InputGroup>
                  <Row>
                    {document.photoURL.map((img, idx) => (
                      <ItemImg 
                        key={idx} 
                        img={img} 
                        updateItemImg={updateItemImg} 
                        deleteItemImg={deleteItemImg}
                        itemId={id}
                        isItemImgUpdating={isItemImgUpdating}
                      />
                    ))}
                  </Row>
                </Form.Group>
                <hr style={{background: '#fff'}} />
                <div className='d-flex justify-content-end mt-2 mb-5'>
                  <Button 
                    className='me-3' 
                    variant="outline-danger"
                    onClick={() => {
                      window.confirm("Are you sure, you want to delete the whole Item?") && handleDelete()
                      }
                    }
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className='me-1'
                        />
                        Deleting...
                      </>
                    ) : (
                      'Delete Item'
                    )}
                  </Button>
                  <Button 
                    variant="warning" 
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
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
              </Col>
            </>
          )}
          {!isPending && !document && (
            <p className='text-white text-center mt-5'>No data found</p>
          )}
        </Row>
      </Form>
    </Container>
  )
}
