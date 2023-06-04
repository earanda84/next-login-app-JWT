import {useState} from "react"
import axios from "axios"
import { useRouter } from "next/router"

export default function Home() {
  //variable que en un principio corresponde a un seteo de credenciales vacías, cuando el usuario hace click en el login setea las credenciales en el estado con el valor de ellas, para el caso email y password
  //Seteo de credenciales en el estado inicial, antes de realizar handleSubmit del formulario
  const [credentials, setCredencials] = useState({
    email:'',
    password:''
  })

  //router, se utiliza para poder reedireccionar al usuario en caso de que la cookie seteada seca la correcta, lo derive a la url respectiva.
  const router = useRouter()

  //Funcion input onChange que captura el evento y setea las credenciales en el estado definido en un principio, como vacío, se define una copia de las credenciales de el estado inicial, ósea vacia, y se capturan con en el target.name, independiente de cuál sea, catpura los nombres de los target input del formulario, capturando los valores de los inputs propiamente tal.
  //handleChange, cada vez que el usuario tipee en el input, captura las credenciales de los inputs con el e.target.name, para el nombre del formulario

  // const handleChange = (e)=>{
  //   setCredencials({
  //     ...credentials,
  //     [e.target.name]:e.target.value
  //   })
  // }


  //Cuando el usuario hace click en login, ejecuta la función handleSubmit, realizando lo sigiuiente:
  //1.-realiza petición post mediante axios a la url de la api disponibilizada para login
  //2.-Si las credenciales enviadas para ese usuario en la url de la API, existen, en la base de datos o serverless, que firme el token con las credenciales, sete la cookie para ese usuario que existe en la base de datos, y lo devuelva con un seteo de la cookie en el heder a esa ruta api, en una respuesta json ejemplo ==> res.setHeader('Set-Cookie', tokenSerializado'cookie'
  const handleSubmit = async (e)=>{
    e.preventDefault()
    console.log(credentials);

    const response = await axios.post('/api/auth/login',credentials)
    console.log(response)
    if(response.status === 200){
      return router.push('/dashboard')
    }
    console.log(response)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <input name="email" type="email" placeholder="Email" onChange={(e)=> setCredencials({...credentials, email: e.target.value})}/>
        <input name="password" type="password" placeholder="password" onChange={(e)=> setCredencials({...credentials, password: e.target.value})}/>

        <button>Login</button>
      </form>
    </div>
  )
}
