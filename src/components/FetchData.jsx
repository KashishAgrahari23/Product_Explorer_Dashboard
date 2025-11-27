import React, { useEffect, useState } from 'react'

const FetchData = () => {
    const [ data , setData] = useState([])
    const [input , setInput] = useState("")
    useEffect(()=>{
        async function Fetch(){
            const res = await fetch("https://fakestoreapi.com/products")
            const data = await res.json()
            setData(data)
        }
        Fetch()
    },[])

    const handleSearch =(e)=>{
        setInput(e.target.value)
        console.log(input)
        const timer = setTimeout(()=>{
             input==data.title? setData(input) : "no result found"
             return clearInterval(timer)
        },500)
    }
  return (
    <div>
        <input onChange={(e)=>handleSearch(e)} className='border border-gray-300 p-1 mt-4' type="text" placeholder='type something....' />
      
      {!data.length? <p>No result found</p>  :
      <div className='mt-10 grid grid-cols-4 p-3 gap-4 ' >
      {data.map((elem)=>{

       return (
       <div key={elem.id} className='border border-gray-300 rounded p-3 flex flex-col items-center shadow '>
            <img className='h-24 w-24 object-contain mb-2' src={elem.image} alt="image" />
            <h3 className='font-semibold text-sm mb-1' >{elem.title}</h3>
            <h5 className='text-green-600 font-bold mb-1'> ${elem.price}</h5>
            <p className='text-xs mb-1'>{elem.description}</p>
            <h6 className='text-gray-500 text-xs'>{elem.category}</h6>
            <p className='text-xs mt-2'>Rating:- { elem.rating.rate}  <br/> Count:- {elem.rating.count}</p>
        </div>)
      })
      }</div>}
    </div>
  )
}

export default FetchData
