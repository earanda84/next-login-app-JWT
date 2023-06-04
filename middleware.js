import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
//import connectMongo from "./utils/conn"
import connectMongo from "./database/conn";
//PAra el verificar el token, no se puede realizar en esta parte del código con jsonWebToken, debe hacerse con un modulo diferente, por que jsonwebtoken, no soporta el buffer de almacenamiento en middleware
//import {verify} from 'jsonwebtoken'

export async function middleware(request) {
    //DB MONGO
   
    // connectMongo().catch(error => request.NextResponse({error}))
  
    console.log(request)
    //consulta DB 
    // const {user:{email, password}} = await 


    //useSWR paquete npm i swr y mutateUser puedes guardar en el estado la consulta al backend y no requieres de realizar multiples consultas a la backend, ya que estas estan guardadas en el estado de react ejemplo de constante ==> const {data:user, mutate:mutateUser} = useSWR('/api/user') ==> lo ultimo se realiza con metodo parecido a fetch al backend**INVESTIGAR**

    //Explicacion ==> 1.-Se debe priramente hashear las credenciales y setea cookies, 2.-para poder pasar a las consultas a la base de datos respectiva.


    //Aqui debo llamar a la conexion de la base de datos, cual sea que sea la base de datos
    
    //Primero preguntar si el usuario existe, con las credenciales que envie desde el frontend metodo POST que quede claro, ya que intenta acceder a la aplicacion, enviando los datos en el cuerpo y no en la url, lo que hace que sea mas inseguro y ademas el meotodo GET, tiene limitaciones en solicitudes http, respecto del metodo POST, solo para saber si existe, que ingrese al home, de lo contrario que se vaya a la ruta de crear usuario sign up
    
    //De lo contrario Crear el usuario primeramente derivarlo a la ruta de crear usuario
    
    //una vez que se crea el usuario, derivarlo a la página de inicio sesión

    //



    //Desde la request, especificamente en el header, por donde se ha enviado el token de autenticacion del usuario, toda vez que este existe en la base de datos, se obtiene el nombre de la llave del objeto json
    const jwt = request.cookies.get("myTokenName");

    //Con el metodo nextUrl, podemos obtener de ese objeto, el pathname de la petición de la ruta, si esta incluye la ruta dashboard, para el caso, que es una ruta que está protegida, el usuario debe estar logeado y con un token valido para la navegacion, si este es undefined para el caso, se redireccina a login, esto puede hacerse con todas las rutas de nuestro proyecto, al nivel de pages, exceptuando las rutas api.
    // if (request.nextUrl.pathname.includes("/dashboard")) {
        //Se evalúa al token desde la cookie, si este es igual a undefined, redireccione a la ruta login con nextResponse redirect, conjuntamente con la req.url, para este caso se reenvíe a login
        if (!jwt) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        //Se realiza esta condicion para que no muestre el login si el token existe.
        if(request.nextUrl.pathname.includes('/login')){
            try {
                await jwtVerify(jwt, new TextEncoder().encode("secret"));
                return NextResponse.redirect(new URL("/dashboard",request.url))
            } catch (error) {
                return NextResponse.next()
            }
        }
        //Bloque try catch que evalúa si el token esta firmado por el secret, del backend, no obstante, para verificar este token se debe realizar en un middleware con la librería jose (no falla con el buffer), que puede funcionar desde el backend, si este viene y el payload no existe, protege las rutas y redirecciona a la url del login
        try {
            // en la variable payload, recibo el payload si existe, si existe lo deja entrar a la ruta que requiere, sino cae en el catch y redirecciona a login

            //Metodo que debe usar el jose para validar el token desde un middleware, con TextEncoder y encode el secret del jwt
            const { payload } = await jwtVerify(jwt, new TextEncoder().encode('secret')
            );
            console.log({payload});
            // El return, retorna a la ruta que está tratando de acceder.
            return NextResponse.next();
        } catch (error) {
            // console.error(error);
            //Si el token no esta firmado, redirecciona a login
            return NextResponse.redirect(new URL("/login", request.url));
        }
    //}
    // return NextResponse.next();
}

//Objeto de econfiguración de rutas a las cuales quiero que el middleware se ejecute, para lo cual se definen los matcher dentro del objeto, siendo las rutas protegidas todas las que se pasan en el arreglo, de manera literal en la aplicacion, si no paso rutas literales, se engloba toda la aplicacion y para este ejemplo, si cae en el error, porque el usuario no se ha autenticado, lo deriba a la ruta login, entonces, redunda en los reenvíos a la ruta login y la aplicacion arroja un error, se cae literal.

//Entonces para definir la ruta de la api y la ruta vista del login en este caso, se debe realizar un manejo del redireccionamiento del error, el cual podría ser, que se excluya la ruta que queremos redireccionar, osea login, lo que se puede hacer en ese caso, es buscar la forma de exluir esa ruta del matcher
export const config ={
    matcher:['/dashboard','/','/admin/profile:path*'] //esta forma de proteger rutas es para el caso de /admin/:path* ==> es todo lo que viene anidado a la ruta admin
    //En este matcher se excluyen de las rutas el login,el home,  api/auth/login, separados por una barra vertical |, el home solo se debe dejar entre dos barras y sin espacio

    //Al menos las rutas necesarias para que el usuario pueda hacer login en la plataforma, si por ejemplo requiere ingresar a la ruta de crear usuario signup o register
    

    //Si existe sesion que lo redireccione al HOME
   // matcher:'/((?!login||api/auth/login|api/auth/logout|_next/static|_next/image|favicon.ico).*)'
}