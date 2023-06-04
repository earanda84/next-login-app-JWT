import {sign} from 'jsonwebtoken'
import {serialize} from 'cookie'
//En la ruta api de login, podría realizarse una petición post o get, para poder buscar al usuario, si existe, hashear password antes de que pase a la base de datos.
//Ejemplos:
//Check if email and password exists
//if email exists
//if password es correct, con modulo de compare de bcryptjs, cuándo la password se guadra hasheada

//Manejador de peticioes desde la pagina login, donde el usuario hace click se envían a esta ruta de la API
export default function loginHandler( req, res ){
    //Request front end
    const {email,password} = req.body;
    console.log(email, password)

    //validar usuario en db ejemplo sin db
    if(email === 'admin@local.local' && password === 'admin'){
        //seteo de jwt y firma de este con expiración de 30 días
        const token = sign({
            //Math floor refleja la cantidad de 60 milisegundos por sesenta por 24 hrs por 30 dias
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            email,//Email usuario que si está en la base de datos, habría que evaluar primero si el usuario existe en la db, se devuelva el token
            username: 'nino'//Lo mismo que lo anterior, si el usuario existe en Base de datos
        },'secret');//El secret debe ser una variable de entorno 

        //Set Cookie si el usuario ya existe
        //La cookie sera accedidad desde http y en producción no se mostrará la cookie en el navegador con httpOnly
        const serialized = serialize('myTokenName',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',//Esto quiere decir que evaluará en true si el proccess.env.NODE_ENV en producción, y en false si el process.env.NODE_ENV no existe, determinando la condición false, no ocupando este metodo para producción, ósea el navegador, para que los SSL de una página pueda conectar ese toeken serializado
            sameSite: 'strict',//SameSite indica que si se comunica con un servidor backend externo, puede existen 3 metodos lax, none, strict, como estoy en desarrollo puedo ocupar strict, si estuviera en producción debe ser lax o none
            maxAge: 1000 * 60 * 60 * 24 * 30,//expiración de la cookie
            path: '/'//desde donde se envía
    
        })
        console.log({token:serialized})
        res.setHeader('Set-Cookie', serialized)
    
        return res.status(200).json({message:'Login succesfully',token:serialized})
    }

    return res.status(401).json({error:'Invalid credentials'})
}