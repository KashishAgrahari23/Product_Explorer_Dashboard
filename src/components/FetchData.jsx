import React, { useEffect, useState } from 'react';

const FetchData = () => {
  const [prod, setProd] = useState([]);
  const [data, setData] = useState([]);

  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");

  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  const [page, setPage] = useState(0);
  const limit = 6;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* ----------------------------------------
     FETCH PRODUCTS (RUN ONLY ONCE)
  ---------------------------------------- */
  useEffect(() => {
    async function Fetch() {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");

        if (!res.ok) throw new Error("Failed to fetch");

        const result = await res.json();
        setProd(result);
        setData(result);
      } catch (err) {
        setError("Error loading products!");
      } finally {
        setLoading(false);
      }
    }

    Fetch();
  }, []);


  /* ----------------------------------------
     DEBOUNCE SEARCH INPUT
  ---------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(input);
    }, 400);

    return () => clearTimeout(timer);
  }, [input]);


  /* ----------------------------------------
     COMBINED SEARCH + CATEGORY FILTER
  ---------------------------------------- */
  useEffect(() => {
    let filtered = [...prod];

    // search
    if (debounced.trim() !== "") {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(debounced.toLowerCase())
      );
    }

    // category filter
    if (filter) {
      filtered = filtered.filter(item => item.category === filter);
    }

    setData(filtered);
    setPage(0); // reset to first page after filtering
  }, [debounced, filter, prod]);


  /* ----------------------------------------
     SORTING LOGIC
  ---------------------------------------- */
  useEffect(() => {
    let sortedData = [...data];

    if (sort === "Asc") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (sort === "Desc") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (sort === "Rating") {
      sortedData.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (sort === "Alpha") {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    }

    setData(sortedData);
  }, [sort]);


  /* ----------------------------------------
     PAGINATION CALCULATIONS
  ---------------------------------------- */
  const totalPages = Math.ceil(data.length / limit);
  const start = page * limit;
  const end = start + limit;
  const paginatedData = data.slice(start, end);


  /* ----------------------------------------
     LOADING & ERROR UI
  ---------------------------------------- */
  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;


  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* SEARCH */}
      <input
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-400 p-2 rounded w-1/3"
        type="text"
        placeholder="Search products..."
      />

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-2 ml-3 rounded"
      >
        <option value="">Sort By</option>
        <option value="Asc">Price: Low → High</option>
        <option value="Desc">Price: High → Low</option>
        <option value="Rating">Rating: High → Low</option>
        <option value="Alpha">Alphabetical: A → Z</option>
      </select>

      {/* FILTER */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 ml-3 rounded"
      >
        <option value="">Filter</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
      </select>


      {/* GRID */}
      {data.length === 0 ? (
        <p className="text-center mt-20 text-gray-600">No result found</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((elem) => (
            <div
              key={elem.id}
              className="border p-4 rounded shadow-sm hover:shadow-lg transition"
            >
              <img className="h-32 mx-auto object-contain mb-3" src={elem.image} alt="" />
              <h3 className="font-semibold text-sm mb-1">{elem.title}</h3>
              <p className="text-green-600 font-bold">${elem.price}</p>
              <p className="text-xs text-gray-500">{elem.category}</p>
              <p className="text-xs mt-2">
                ⭐ {elem.rating.rate} ({elem.rating.count})
              </p>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
          className={`px-4 py-1 border rounded ${
            page === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages - 1}
          className={`px-4 py-1 border rounded ${
            page === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FetchData;
