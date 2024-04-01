document.addEventListener("DOMContentLoaded", function () {
  //Obtenemos los Elementos del DOM
  const listadoUsuarios = document.getElementById("listadoUsuarios");
  const btnCrear = document.getElementById("btnCrear");
  const modalCrear = document.getElementById("modalCrear");
  const modalEditar = document.getElementById("modalEditar");
  const modalEliminar = document.getElementById("modalEliminar");
  const createUserForm = document.getElementById("createUserForm");
  const editUserForm = document.getElementById("editUserForm");
  const deleteUserForm = document.getElementById("deleteUserForm");
  let roles;
  let userId;

  // Agregamos los eventListeners
  btnCrear.addEventListener("click", openNewModal);
  modalCrear.addEventListener("click", closeModal);
  modalEditar.addEventListener("click", closeModal);
  modalEliminar.addEventListener("click", closeModal);
  listadoUsuarios.addEventListener("click", function (event) {
    userId = parseInt(event.target.dataset.id);
    if (event.target.classList.contains("btnEditar")) {
      openEditModal(userId);
    } else if (event.target.classList.contains("btnEliminar")) {
      openDeleteModal(userId);
    }
  });

  obtenerUsuarios();

  // Funcion para obtener los usuarios de la API
  async function obtenerUsuarios() {
    try {
      const response = await fetch("https://practica10-recovered-production.up.railway.app/api/users");
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const usuarios = await response.json();
      mostrarUsuarios(usuarios);
    } catch {
      console.log("Error al cargar usuarios", error.message);
    }
  }

  // Funcion para obtener los Roles de la API
  async function obtenerRoles() {
    try {
      const response = await fetch("https://practica10-recovered-production.up.railway.app/api/roles");
      if (!response.ok) throw new Error("Error al cargar roles");
      roles = await response.json();
    } catch (error) {
      console.log("Error al cargar roles", error);
    }
  }

  // Función para renderizar ls usuarios en la lista
  function mostrarUsuarios(usuarios) {
    listadoUsuarios.innerHTML = "";
    usuarios.forEach((user) => {
      const usuarioElemento = document.createElement("tr");
      usuarioElemento.innerHTML = `
            <td>${user.id}</td>
            <td><img src="https://practica10-recovered-production.up.railway.app/api/pictures/${user.picture}" alt="Profile Pic" class="profile-pic"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              <button class="btnEditar" data-id="${user.id}"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
              <button class="btnEliminar" data-id="${user.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
            </td>
          `;
      listadoUsuarios.appendChild(usuarioElemento);
    });
  }

  // Funcion para Renderizar los roles
  async function popularRoles(editUserRole){
    await obtenerRoles();
      editUserRole.innerHTML = "";
      roles.forEach((role) => {
        const option = document.createElement("option");
        option.value = role.id;
        option.textContent = role.role;
        editUserRole.appendChild(option);
      });
    }
    
  // Abrir el Modal para crear un nuevo usuario
  function openNewModal() {
    modalCrear.style.display = "block";
    const errors = document.getElementById("errors");
    errors.textContent = '';
    const createUserName = document.getElementById("createUserName");
    const createUserEmail = document.getElementById("createUserEmail");
    const createUserRole = document.getElementById("createUserRole");
    const createUserProfilePic = document.getElementById("createUserProfilePic");
    popularRoles(createUserRole)
  }

  // Funcion para abrir el modal para editar usuario y precargar la Informacion
  async function openEditModal(userId) {
    modalEditar.style.display = "block";
    const editUserName = document.getElementById("name");
    const editUserEmail = document.getElementById("email");
    const editUserRole = document.getElementById("role_id");
    const editUserProfilePic = document.getElementById("picture");
    popularRoles(editUserRole)
    try {
      const response = await fetch("https://practica10-recovered-production.up.railway.app/api/users/" + userId);
      if (!response.ok) {
        throw new Error("Error al cargar datos del usuario");
      }
      const [usuario] = await response.json();
      editUserRole.value = usuario.role_id;
      editUserName.value = usuario.name;
      editUserEmail.value = usuario.email;
      editUserProfilePic.filename = usuario.picture;
    } catch (error) {
      console.log("Error al cargar datos del usuario", error);
    }
  }

    // Funcion para abrir el modal para eliminar el usuario
    async function openDeleteModal() {
      modalEliminar.style.display = "block";
    }

  // Funcion para Actualizar Usuario
  editUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editUserForm);
    editarUsuario(userId, formData, e);
  });

  // Funcion para crear usuario
  createUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(createUserForm);
    crearUsuario(formData, e);
  });

  //Funcion para eliminar Usuario
  deleteUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editUserForm);
    eliminarUsuario(userId, formData, e)
  });

  //Funcion para eliminar Usuario
  async function eliminarUsuario(userId, formData, event) {
  try {
    const response = await fetch(
      `https://practica10-recovered-production.up.railway.app/api/users/${userId}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      throw new Error("Error al eliminar usuario");
    } else {
      await obtenerUsuarios();
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    handleError(error);
  }
}

  // Funcion para editar Usuario
  async function editarUsuario(userId, formData, event) {
    try {
      const response = await fetch("https://practica10-recovered-production.up.railway.app/api/users/" + userId,
      {
          method: "PATCH",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      } else {
        closeModal(event);
        obtenerUsuarios();
        resetForm(editUserForm);
      }
    } catch (error) {
      console.error("Error al editar usuario:", error.message);
      handleError(error);
    }
  }

  // Funcion para crear Usuario
  async function crearUsuario(formData, event) {
    try {
      const response = await fetch(
        "https://practica10-recovered-production.up.railway.app/api/users/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      } else {
        closeModal(event);
        obtenerUsuarios();
        resetForm(createUserForm);
      }
    } catch (error) {
      modalCrear.style.display = "block";
      const errors = document.getElementById("errors");
      const errorMessage = error.message || "Se ha producido un error.";
      errors.textContent = errorMessage.error;
    }
  }



  // Funcion para cerrar el modal
  function closeModal(event) {
    if (
      event.target === modalEditar ||
      event.target === modalCrear ||
      event.target === modalEliminar ||
      event.target.id === "submitBtn" ||
      event.target.id === "deleteBtn" ||
      event.target.id === "crearBtn" ||
      event.target.classList.contains("close")
    ) {
      modalEditar.style.display = "none";
      modalCrear.style.display = "none";
      modalEliminar.style.display = "none";
    }
    
  }
});

function resetForm(form) {
  form.reset();
}

