import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const productosRef = collection(db, "productos");

  const cargarProductos = async () => {
    const snapshot = await getDocs(productosRef);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.categoria || !form.precio) return;

    if (editId) {
      const prodDoc = doc(db, "productos", editId);
      await updateDoc(prodDoc, {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio),
      });
      setEditId(null);
    } else {
      await addDoc(productosRef, {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio),
      });
    }

    setForm({ nombre: "", categoria: "", precio: "" });
    cargarProductos();
    setShowModal(false);
  };

  const handleEdit = (prod) => {
    setEditId(prod.id);
    setForm({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const prodDoc = doc(db, "productos", id);
    await deleteDoc(prodDoc);
    cargarProductos();
  };

  const productosFiltrados = productos.filter((prod) => {
    const categoriaOk = filtroCategoria
      ? prod.categoria === filtroCategoria
      : true;

    return categoriaOk;
  });

  return (
    <>
      <div className="App">
        <h1>CRUD Productos de Farmacia</h1>
        <div className="filtros-container">
          <select
            className="category-filter"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Higiene">Higiene</option>
            <option value="Vitaminas">Vitaminas</option>
            <option value="Medicamentos">Medicamentos</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Primeros Auxilios">Primeros Auxilios</option>
          </select>

        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>{prod.precio}</td>
                <td>
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => handleEdit(prod)}
                    aria-label="Editar producto"
                  >
                    ✎
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(prod.id)}
                    aria-label="Eliminar producto"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editId ? "Editar producto" : "Producto Nuevo"}</h2>
              <form onSubmit={handleSubmit} className="form modal-form">
                <input
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />

                <div className="modal-row">
                  <div className="half">
                    <select
                      name="categoria"
                      value={form.categoria}
                      onChange={handleChange}
                    >
                      <option value="">Categoría</option>
                      <option value="Higiene">Higiene</option>
                      <option value="Vitaminas">Vitaminas</option>
                      <option value="Medicamentos">Medicamentos</option>
                      <option value="Alimentos">Alimentos</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Primeros Auxilios">Primeros Auxilios</option>
                    </select>
                  </div>

                  <div className="half">
                    <input
                      name="precio"
                      placeholder="Precio"
                      type="number"
                      value={form.precio}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    aria-label="Cancelar"
                    onClick={() => {
                      setShowModal(false);
                      setEditId(null);
                      setForm({ nombre: "", categoria: "", precio: "" });
                    }}
                  >
                    ✕
                  </button>

                  <button type="submit" aria-label={editId ? "Guardar cambios" : "Agregar producto"}>
                    {editId ? "✎" : "＋"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={() => {
          setEditId(null);
          setForm({ nombre: "", categoria: "", precio: "" });
          setShowModal(true);
        }}
      >
        +
      </button>
    </>
  );
}

export default App;
