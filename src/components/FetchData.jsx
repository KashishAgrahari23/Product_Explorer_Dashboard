import React, { useEffect, useState } from 'react'

const FetchData = () => {

  const [prod, setProd] = useState([]);
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sort , setSort] = useState("")
  const [filter , setFilter] = useState("")

  useEffect(() => {
    async function Fetch() {
      const res = await fetch("https://fakestoreapi.com/products");
      const result = await res.json();
      setProd(result);
      setData(result);
    }
    Fetch();
  }, []);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  // Filter based on debounced value
  useEffect(() => {
    const filtered = prod.filter((el) =>
      el.title.toLowerCase().includes(debounced.toLowerCase())
    );
    setData(filtered);
  }, [debounced, prod]);

  useEffect(()=>{
    let sortedData = [...data]
    if (sort==="Asc"){
        sortedData.sort((a,b)=>a.price-b.price)
    } 
    else if (sort==="Desc"){
        sortedData.sort((a,b)=>b.price-a.price)
    } 
    else if (sort==="Rating"){
        sortedData.sort((a,b)=>b.rating.rate-a.rating.rate)
    } 
    else if (sort==="Alpha"){
        sortedData.sort((a,b)=>a.title.localeCompare(b.title))
    }

    setData(sortedData)

  },[sort])

  useEffect(()=>{
    let filteredData= [...prod]
    if (filter === "electronics") {
    filteredData = filteredData.filter(item => item.category === "electronics");
  } 
  else if (filter === "jewelery") {
    filteredData = filteredData.filter(item => item.category === "jewelery");
  } 
  else if (filter === "men's clothing") {
    filteredData = filteredData.filter(item => item.category === "men's clothing");
  } 
  else if (filter === "women's clothing") {
    filteredData = filteredData.filter(item => item.category === "women's clothing");
  }
  setData(filteredData)
  },[filter])
  return (
    <div>
      <input
        onChange={(e) => setInput(e.target.value)}
        className='border border-gray-300 p-1 mt-4'
        type="text"
        placeholder='Type something...'
      />
      <select name="" id="" value={sort} onChange={(e) => setSort(e.target.value)} className='border p-1 ml-2 bg-gray-900 text-black-500'>
        <option value="" >Sort By</option>
        <option value="Asc" >Price: Low → High</option>
        <option value="Desc" >Price: High → Low</option>
        <option value="Rating" >Rating: High → Low</option>
        <option value="Alpha" >Alphabetical: A → Z</option>
      </select>

      <select name="" id="" value={filter} onChange={(e)=>setFilter(e.target.value)} className='border p-1 ml-2 bg-gray-900 text-black-500'>
        <option value="">Filter</option>
  <option value="electronics">Electronics</option>
  <option value="jewelery">Jewelery</option>  
  <option value="men's clothing">Men's Clothing</option>
  <option value="women's clothing">Women's Clothing</option>
      </select>

      {!data.length ? (
        <p>No result found</p>
      ) : (
        <div className='mt-10 grid grid-cols-4 p-3 gap-4'>
          {data.map((elem) => (
            <div key={elem.id} className='border border-gray-300 rounded p-3 flex flex-col items-center shadow'>
              <img className='h-24 w-24 object-contain mb-2' src={elem.image} alt="image" />
              <h3 className='font-semibold text-sm mb-1'>{elem.title}</h3>
              <h5 className='text-green-600 font-bold mb-1'>${elem.price}</h5>
              <h6 className='text-gray-500 text-xs'>{elem.category}</h6>
              <p className='text-xs mt-2'>
                Rating: {elem.rating.rate}
                <br /> Count: {elem.rating.count}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchData;
