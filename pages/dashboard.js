import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  //Define un estado para setear al usuario autenticado en la ruta de la api/profile
  const [user, setUser] = useState({
    email: "",
    username: "",
  });

  //Definir el router, para poder redireccionar a la página que se requiere la redirección del usuario

  const router = useRouter()

  //ejecuta la consulta a la ruta de la api, que realiza la consulta al backend, podría ser base de datos y devuelve el usuario toda vez que la lógica de consulta a la base de datos, encuentre y valide al usuario

  //1.-Se realiza el llamado a la ruta api/profile, para poder obtener los datos del usuario y los setee en el estado, ya no inicial, sino que con los datos devueltos de la ruta api
  const getProfile = async () => {
    const response = await axios.get("/api/profile");
    setUser(response.data);
  };

  //2.- Funcion onClick del boton Logout, se llama a la ruta logout mediante metodo "POST" de la api/auth/logout, donde lo que realiza, es traer las cookies con el nombre myTokenName, si no existe un token indica que no está logeado, de lo contrario lo serializa para poder darle una expiración de cero "0", para poder salir de la sesión y eliminar el token de la cookie, enviando la respueta en el Header, como la cookie es seteada en cero en la ruta del backend api/aut/logout, se redirecciona a la ruta /login, saliendo de la sesion del usuario, de lo contrario si de igual forma existe un error, lo deriva a la ruta /login
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')

      router.push('/login')

    } catch (error) {
      console.error(error)

      router.push("/login")
    }
    
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{user.email}</h2>
      <h3>{user.username}</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button
        onClick={() => {
          getProfile();
        }}
      >
        Get Profile
      </button>
      <button onClick={() => logout()}>Log out Profile</button>
    </div>
  );
}
