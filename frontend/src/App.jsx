import { useState, useEffect } from 'react'

function App() {
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('') // Image kosam kotha field
    const [editingId, setEditingId] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetch('http://localhost:5004/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    const handleAdd = () => {
        const newProduct = { name, quantity: Number(quantity), price: Number(price), category, image }

        if(editingId) {
            fetch(`http://localhost:5004/products/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })
                .then(res => res.json())
                .then(updated => {
                    setProducts(products.map(p => p.id === editingId ? updated : p))
                    resetForm()
                })
        } else {
            fetch('http://localhost:5004/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })
                .then(res => res.json())
                .then(data => {
                    setProducts([...products, data])
                    resetForm()
                })
        }
    }

    const handleDelete = (id) => {
        if(window.confirm("Delete cheyyala?")){
            fetch(`http://localhost:5004/products/${id}`, { method: 'DELETE' })
                .then(() => {
                    setProducts(products.filter(p => p.id !== id))
                })
        }
    }

    const handleEdit = (product) => {
        setEditingId(product.id)
        setName(product.name)
        setQuantity(product.quantity)
        setPrice(product.price)
        setCategory(product.category)
        setImage(product.image)
    }

    const resetForm = () => {
        setName(''); setQuantity(''); setPrice(''); setCategory(''); setImage(''); setEditingId(null)
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const totalProducts = products.length
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)

    return (
        <div style={{padding: '30px', maxWidth: '1200px', margin: 'auto', fontFamily: 'Arial', background: '#f4f4f9'}}>
            <h1 style={{textAlign: 'center', color: '#2c3e50'}}>📦 Inventory App</h1>

            <div style={{background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}>
                <h2 style={{margin: 0}}>Total Products: {totalProducts} | Total Value: Rs.{totalValue}</h2>
            </div>

            <input
                style={{padding: '12px', width: '100%', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px'}}
                placeholder="🔍 Search Product..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* Form */}
            <div style={{background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                <input style={{padding: '10px', flex: 1}} placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} />
                <input style={{padding: '10px', width: '80px'}} placeholder="Qty" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                <input style={{padding: '10px', width: '100px'}} placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                <input style={{padding: '10px', width: '120px'}} placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
                <input style={{padding: '10px', flex: 1}} placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} /> {/* Image URL field */}
                <button style={{padding: '10px 25px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px'}} onClick={handleAdd}>
                    {editingId ? 'Update' : 'Add'}
                </button>
            </div>

            {/* Product Cards with Images */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
                {filteredProducts.length === 0 ? <p>No products found</p> :
                    filteredProducts.map(p => (
                        <div key={p.id} style={{
                            background: p.quantity < 10 ? '#ffe6e6' : 'white', // Low stock unte red bg
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={p.image || 'https://via.placeholder.com/280x150?text=No+Image'}
                                alt={p.name}
                                style={{width: '100%', height: '150px', objectFit: 'cover'}}
                            />
                            <div style={{padding: '15px'}}>
                                <h3 style={{margin: '0 0 10px 0'}}>{p.name}</h3>
                                <p>Qty: <b>{p.quantity}</b></p>
                                <p style={{color: '#27ae60', fontWeight: 'bold', fontSize: '18px'}}>Rs.{p.price}</p>
                                <p style={{fontSize: '12px', color: 'gray'}}>{p.category}</p>
                                {p.quantity < 10 && <p style={{color: 'red', fontWeight: 'bold'}}>⚠️ Low Stock!</p>}
                                <div style={{marginTop: '10px'}}>
                                    <button onClick={() => handleEdit(p)} style={{marginRight: '5px', padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px'}}>Edit</button>
                                    <button onClick={() => handleDelete(p.id)} style={{padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px'}}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default App