"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const BADGE_OPTIONS = [
  { val: '', label: 'Ninguna' },
  { val: 'NUEVO', label: 'Nuevo' },
  { val: 'MÁS VENDIDO', label: 'Más Vendido' },
  { val: 'HOT SALE', label: 'Hot Sale' },
  { val: 'SIN LACTOSA', label: 'Sin Lactosa' },
];

export default function AdminForm({ categories, productToEdit, onClear }: { categories: string[], productToEdit?: any, onClear?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    cost_price: '',
    weight: '',
    servings: '',
    serving_unit: 'servicios',
    stock_quantity: '10',
    category_name: categories[0] || '',
    badge_type: '',
    image: '',
    gallery: [] as string[]
  });

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        price: productToEdit.price?.toString() || '',
        original_price: productToEdit.original_price?.toString() || '',
        cost_price: productToEdit.cost_price?.toString() || '',
        weight: productToEdit.weight || '',
        servings: productToEdit.servings?.toString() || '',
        serving_unit: productToEdit.serving_unit || 'servicios',
        stock_quantity: productToEdit.stock_quantity?.toString() || '10',
        category_name: productToEdit.category_name || categories[0] || '',
        badge_type: productToEdit.badge_type || '',
        image: productToEdit.image || '',
        gallery: productToEdit.gallery || []
      });
    } else {
      setForm({
        name: '', description: '', price: '', original_price: '', cost_price: '', 
        weight: '', servings: '', serving_unit: 'servicios', stock_quantity: '10',
        category_name: categories[0] || '', badge_type: '', image: '', gallery: []
      });
    }
  }, [productToEdit, categories]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }
    }

    if (isGallery) {
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...newUrls] }));
    } else if (newUrls.length > 0) {
      setForm(prev => ({ ...prev, image: newUrls[0] }));
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      ...form, 
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      stock_quantity: parseInt(form.stock_quantity),
      servings: parseInt(form.servings)
    };

    let error;
    if (productToEdit) {
      const res = await supabase.from('products').update(payload).eq('id', productToEdit.id);
      error = res.error;
    } else {
      const res = await supabase.from('products').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(productToEdit ? '¡Producto actualizado!' : '¡Producto añadido!');
      window.location.reload();
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem', background: 'var(--ink3)',
    border: '1px solid var(--wire2)', borderRadius: 'var(--r)',
    color: 'white', marginBottom: '1rem'
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--ink2)', padding: '2rem', borderRadius: 'var(--r)', marginTop: '2rem', position: 'sticky', top: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--C)' }}>
        {productToEdit ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </h3>
      
      <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input placeholder="PVP (Venta)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={inputStyle} />
        <input placeholder="Costo Compra" type="number" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input placeholder="Cantidad Stock" type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} style={inputStyle} />
        <select value={form.badge_type} onChange={e => setForm({...form, badge_type: e.target.value})} style={inputStyle}>
          {BADGE_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input 
          placeholder={`Num. ${form.serving_unit.charAt(0).toUpperCase() + form.serving_unit.slice(1)}`} 
          type="number" 
          value={form.servings} 
          onChange={e => setForm({...form, servings: e.target.value})} 
          style={inputStyle} 
        />
        <select value={form.serving_unit} onChange={e => setForm({...form, serving_unit: e.target.value})} style={inputStyle}>
          <option value="servicios">Servicios (Polvo)</option>
          <option value="cápsulas">Cápsulas</option>
          <option value="tabletas">Tabletas</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input placeholder="Peso" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} style={inputStyle} />
        <select value={form.category_name} onChange={e => setForm({...form, category_name: e.target.value})} style={inputStyle}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Imagen Principal</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
          <label style={{ background: 'var(--wire)', padding: '0.8rem', borderRadius: 'var(--r)', cursor: 'pointer' }}>
            📁 <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Galería ({form.gallery.length} fotos)</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <label style={{ background: 'var(--wire)', padding: '0.8rem', borderRadius: 'var(--r)', cursor: 'pointer', width: '100%', textAlign: 'center' }}>
            + Añadir fotos a la galería
            <input type="file" multiple onChange={(e) => handleFileUpload(e, true)} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {form.gallery.map((url, i) => (
            <div key={url} style={{ position: 'relative' }}>
              <img src={url} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
              <button onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 15, height: 15, fontSize: 10 }}>x</button>
            </div>
          ))}
        </div>
      </div>



      <select value={form.category_name} onChange={e => setForm({...form, category_name: e.target.value})} style={inputStyle}>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Imagen del Producto</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="URL o sube una foto →" 
            value={form.image} 
            onChange={e => setForm({...form, image: e.target.value})} 
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }} 
          />
          <label style={{ 
            background: 'var(--wire)', 
            padding: '0.8rem', 
            borderRadius: 'var(--r)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
            📁
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={loading} className="btn-a" style={{ flex: 1 }}>
          {loading ? 'Guardando...' : (productToEdit ? 'Actualizar' : 'Crear')}
        </button>
        {productToEdit && (
          <button type="button" onClick={onClear} className="btn-b" style={{ padding: '0.8rem' }}>Cancelar</button>
        )}
      </div>
    </form>
  );
}
