import React, { useEffect, useState } from "react";
import "./App.css";
import UserCard from "./UserCard";

const API_URL = "https://6931ee5f11a8738467d105dc.mockapi.io/Usuarios";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRol, setNewRol] = useState("cliente");
  const [newActivo, setNewActivo] = useState(true);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError(err.message || "Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleUpdateUsuario = async (usuarioActualizado) => {
    console.log("Llega a App.js:", usuarioActualizado);
    setError(null);

    const { id, ...restoCampos } = usuarioActualizado;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restoCampos),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Error al actualizar el usuario");
      }

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...data } : u))
      );
    } catch (err) {
      console.error("Error en handleUpdateUsuario:", err);
      setError(err.message || "Error al actualizar el usuario");
    }
  };

  const handleDeleteUsuario = async (id) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error en handleDeleteUsuario:", err);
      setError(err.message || "Error al eliminar el usuario");
    }
  };

  const handleAddUsuario = async () => {
    const nuevoUsuario = {
      nombre: newNombre,
      email: newEmail,
      rol: newRol,
      activo: newActivo,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Error al crear usuario");

      setUsuarios([...usuarios, data]);
      setShowAddModal(false);
      setNewNombre("");
      setNewEmail("");
      setNewRol("cliente");
      setNewActivo(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo agregar usuario");
    }
  };

  return (
    <div className="App">
      <h1 className="titulo">USUARIOS</h1>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="users-grid">
          {usuarios.map((u) => (
            <UserCard
              key={u.id}
              usuario={u}
              onUpdate={handleUpdateUsuario}
              onDelete={handleDeleteUsuario}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo Usuario</h2>
            <div className="modal-field">
              <label>Nombre</label>
              <input
                type="text"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Rol</label>
              <select
                value={newRol}
                onChange={(e) => setNewRol(e.target.value)}
              >
                <option value="cliente">Cliente</option>
                <option value="administrador">Administrador</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Activo</label>
              <select
                value={newActivo ? "true" : "false"}
                onChange={(e) => setNewActivo(e.target.value === "true")}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <button className="modal-add-btn" onClick={handleAddUsuario}>
              Agregar
            </button>
          </div>
        </div>
      )}

      <button className="add-user-btn" onClick={() => setShowAddModal(true)}>+</button>
    </div>
  );
}

export default App;
