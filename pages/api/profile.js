import {jwt} from "jsonwebtoken"

export default function profileHandler(req,res){
    //Obtiene el token que viene en la cookie
    const {myTokenName} = req.cookies

    if(!myTokenName){
        return res.status(401).json({error:'No Token from Api/profile'})
    }

    try {
        const user = jwt.verify(myTokenName, 'secret')
        console.log(user)
        return json({
            email:user.email,
            username:user.username
        })
    } catch (error) {
        return res.status(401).json({error:'Invalid token'})
    }
}

