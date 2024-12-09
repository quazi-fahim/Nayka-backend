const { Message } = require("twilio/lib/twiml/MessagingResponse")

const checkAccess=(acceptedRole)=>{
    return(req,res,next)=>{
        if(req.role===acceptedRole){
            next()
        }
        else{
            res.status(401).send({message:"NOT Authorized"})
        }
    }
}
module.exports=checkAccess;