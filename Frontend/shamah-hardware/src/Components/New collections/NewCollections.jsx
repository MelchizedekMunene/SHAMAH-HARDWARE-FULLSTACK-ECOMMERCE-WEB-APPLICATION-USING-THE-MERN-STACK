import React /*, { useEffect, useState }*/ from 'react'
import './NewCollections.css'
import new_collections from '../assets/new collection'
import Item from '../Item/Item'

const NewCollections = () => {

/*  const [new_collection,setNew_collection] = useState([]);

  useEffect(()=>{
    fetch('https://localhost:4001/newcollections')
    .then((response)=>response)
  
  },[])
  */
  return (
    <div className='new-collections'>
      <h1>New Collections</h1>
      <hr />
      <div className="collections">
        <h1>NEW COLLECTION</h1>
        <hr />
        <div className="collection">
        {new_collections.map((item, i) =>{
          return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} old_price={item.old_price}/>
        })}
        </div>
      </div>
    </div>
  )
}

export default NewCollections;
