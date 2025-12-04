import React, { useState } from "react";

const getInitials = (nombre) => {
  if (!nombre) return "";
  return nombre
    .split(" ")
    .map((parte) => parte.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const UserCard = ({ usuario, onUpdate, onDelete }) => {
  const nombre = usuario.nombre || usuario.name || "Sin nombre";
  const correoOriginal = usuario.correo || usuario.email || "";
  const rolOriginal = usuario.rol || usuario.role || "";
  const activo = usuario.activo; 
  const initials = getInitials(nombre);

  const [showModal, setShowModal] = useState(false);

  const [email, setEmail] = useState(correoOriginal);
  const [rol, setRol] = useState(rolOriginal);
  const [error, setError] = useState("");
  const [activoLocal, setActivoLocal] = useState(Boolean(activo));

  const handleDeleteClick = () => {
    if (onDelete && usuario.id) {
      onDelete(usuario.id);
      setShowModal(false);
    }
  };

  const handleOpenModal = () => {
    setEmail(correoOriginal);
    setRol(rolOriginal);
    setActivoLocal(Boolean(activo));
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const validarEmail = (valor) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const handleUpdateClick = () => {
    if (!validarEmail(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    if (!rol) {
      setError("Selecciona un rol.");
      return;
    }

    const usuarioActualizado = {
      ...usuario,
      correo: email,
      rol: rol,
      activo: activoLocal,
      id: usuario.id,
    };

    if (onUpdate) {
      onUpdate(usuarioActualizado);
    }

    setShowModal(false);
  };

  return (
    <>
      <article className="user-card">
        <div className="user-card-header">
          <div className="user-avatar">{initials}</div>

          <span
            className={
              "user-status " +
              (activo ? "user-status--active" : "user-status--inactive")
            }
          >
            {activo ? "Activo" : "Inactivo"}
          </span>

          <button className="refresh-btn" onClick={handleOpenModal}>
            ⟲
          </button>
        </div>

        <h2 className="user-name">{nombre}</h2>

        <div className="user-extra">
          <p className="user-email">{correoOriginal || "sin correo"}</p>
          <p className="user-role">{rolOriginal || "sin rol"}</p>
        </div>
      </article>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-delete-btn"
              onClick={handleDeleteClick}
              title="Eliminar usuario"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 6h18v2H3V6zm2 3h14l-1.1 12.1c-.1 1.1-1 1.9-2.1 1.9H8.2c-1.1 0-2-.8-2.1-1.9L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2zM9 4V2h6v2h5v2H4V4h5z" />
              </svg>
            </button>
            <h3>Actualizar usuario</h3>
            <p className="modal-user-name">{nombre}</p>

            <div className="modal-field">
              <label htmlFor={`email-${usuario.id}`}>Correo electrónico</label>
              <input
                id={`email-${usuario.id}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
              />
            </div>

            <div className="modal-field">
              <label htmlFor={`rol-${usuario.id}`}>Rol</label>
              <select
                id={`rol-${usuario.id}`}
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="">Selecciona un rol</option>
                <option value="cliente">cliente</option>
                <option value="empleado">empleado</option>
                <option value="administrador">administrador</option>
              </select>
            </div>

            <div className="modal-field">
              <label htmlFor={`activo-${usuario.id}`}>Activo</label>
              <select
                id={`activo-${usuario.id}`}
                value={activoLocal ? "true" : "false"}
                onChange={(e) => setActivoLocal(e.target.value === "true")}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button className="modal-close" onClick={handleCloseModal}>
                Cerrar
              </button>
              <button className="modal-update" onClick={handleUpdateClick}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;