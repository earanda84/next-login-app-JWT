// import {verify} from 'jsonwebtoken'
import {serialize} from 'cookie'


export default function logoutHandler(req,res){
    const {myTokenName} = req.cookies
    console.log(myTokenName,'tokennnnnnn')

    if(!myTokenName){
        return res.status(401).json({error:'Not Logged In desde api/logout'})
    }
    //En este bloque try catch, se setea la cookie a 0 parimport cookie from 'cookie'a poder eliminar la sesión del usuario, eliminando del navegador la cookie
    // try {
        // verify(myTokenName,'secret')
        const serialized = serialize('myTokenName', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/',
        })
        
        console.log(serialized,'Serializeeeeeeedddd')
        //Setea en la cabecera las cookies, para el caso, no existen, porque el tiempo de expiración es cero
        res.setHeader('Set-Cookie',serialized)
        return res.status(200).json({message:'Logout successfully'})
    // } catch (error) {
        //return res.status(401).json({error:'Invalid Token'})
    // }
}