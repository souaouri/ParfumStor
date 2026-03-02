// AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2, Edit, Check, Clock, X } from 'lucide-react';

interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  image2?: string;
  stock?: number;
  status?: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  products: string;
  total: string;
  status: 'pending' | 'done';
  date: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image2File, setImage2File] = useState<File | null>(null);
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    image: '',
    image2: '',
    stock: 0,
    status: 'available'
  });
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#001',
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+212 6XX XXX XXX',
      products: '2 items',
      total: '360.00 dh',
      status: 'pending',
      date: '2024-02-25'
    }
  ]);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'done') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleRemoveOrder = (orderId: string) => {
    if (confirm('Are you sure you want to remove this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refresh the products list
          fetchProducts();
          alert('Product deleted successfully!');
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      image2: product.image2 || '',
      description: product.description || '',
      image: product.image || '',
      stock: product.stock || 0,
      status: product.status || 'available'
    });
    setEditingProductId(product.id || null);
    setShowEditProduct(true);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('stock', (formData.stock || 0).toString());
      formDataToSend.append('status', formData.status || 'available');
      
      // Include existing images if no new images selected
      if (!imageFile && formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (!image2File && formData.image2) {
        formDataToSend.append('image2', formData.image2);
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (image2File) {
        formDataToSend.append('image2', image2File);
      }

      const response = await fetch(`http://localhost:5000/api/products/${editingProductId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      
      if (response.ok) {
        alert('Product updated successfully!');
        setFormData({
          name: '',
          price: 0,
          description: '',
          image: '',
          image2: '',
          stock: 0,
          status: 'available'
        });
        setImageFile(null);
        setImage2File(null);
        setShowEditProduct(false);
        setEditingProductId(null);
        // Refresh products list
        fetchProducts();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('stock', (formData.stock || 0).toString());
      formDataToSend.append('status', formData.status || 'available');
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (image2File) {
        formDataToSend.append('image2', image2File);
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (response.ok) {
        alert('Product added successfully!');
        setFormData({
          name: '',
          price: 0,
          description: '',
          image: '',
          image2: '',
          stock: 0,
          status: 'available'
        });
        setImageFile(null);
        setImage2File(null);
        setShowAddProduct(false);
        // Refresh products list
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 text-xs uppercase tracking-wider">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-zinc-800">
        <div className="px-8 flex gap-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 text-sm uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="inline-block mr-2" size={16} />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-2 text-sm uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="inline-block mr-2" size={16} />
            Orders
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Price (dh) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      rows={3}
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Hover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage2File(e.target.files?.[0] || null)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    >
                      <option value="available">Available</option>
                      <option value="sold out">Sold Out</option>
                      <option value="coming soon">Coming Soon</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-8 py-3 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors"
                    >
                      Add Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="bg-zinc-700 text-white px-8 py-3 rounded-full text-xs font-bold uppercase hover:bg-zinc-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Product Form */}
            {showEditProduct && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
                <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Price (dh) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      rows={3}
                      placeholder="Product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
                    />
                    {formData.image && (
                      <p className="text-xs text-zinc-500 mt-2">Current: {formData.image}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Hover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage2File(e.target.files?.[0] || null)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
                    />
                    {formData.image2 && (
                      <p className="text-xs text-zinc-500 mt-2">Current: {formData.image2}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    >
                      <option value="available">Available</option>
                      <option value="sold out">Sold Out</option>
                      <option value="coming soon">Coming Soon</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-8 py-3 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProduct(false);
                        setEditingProductId(null);
                        setFormData({
                          name: '',
                          price: 0,
                          description: '',
                          image: '',
                          stock: 0,
                          status: 'available'
                        });
                      }}
                      className="bg-zinc-700 text-white px-8 py-3 rounded-full text-xs font-bold uppercase hover:bg-zinc-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-800 border-b border-zinc-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Product</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Price</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Stock</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">
                        No products yet. Add your first product!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-zinc-800">
                        <td className="px-6 py-4 text-sm">{product.name}</td>
                        <td className="px-6 py-4 text-sm">{product.price} dh</td>
                        <td className="px-6 py-4 text-sm">{product.stock || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            product.status === 'available' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-red-900/30 text-red-400'
                          }`}>
                            {product.status || 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-2 hover:bg-zinc-800 rounded transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => product.id && handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-zinc-800 rounded transition-colors text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Orders</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-800 border-b border-zinc-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Order ID</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Customer</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Contact</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Products</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Total</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Date</th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-800">
                      <td className="px-6 py-4 text-sm">{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.customer}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-xs">
                          <div>{order.email}</div>
                          <div className="text-zinc-500">{order.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.products}</td>
                      <td className="px-6 py-4 text-sm">{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          order.status === 'done' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {order.status === 'done' ? 'Done' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusChange(order.id, 'done')}
                            className="p-2 hover:bg-green-900/30 rounded transition-colors text-green-400"
                            title="Mark as Done"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(order.id, 'pending')}
                            className="p-2 hover:bg-yellow-900/30 rounded transition-colors text-yellow-400"
                            title="Mark as Pending"
                          >
                            <Clock size={16} />
                          </button>
                          <button 
                            onClick={() => handleRemoveOrder(order.id)}
                            className="p-2 hover:bg-red-900/30 rounded transition-colors text-red-400"
                            title="Remove Order"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
