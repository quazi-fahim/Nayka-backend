const jwt=require("jsonwebtoken");
const blacklist=require("../blacklist");

const auth=(req,res,next)=>{
    try{
        const token= req.headers["authorization"].split(" ")[1];
        //blacklist check 
        if(blacklist.includes(token)){
            return res.status(401).send("Invalid token.Please login First");

        }
        jwt.verify(token,process.env.SECRET_KEY,function(err,decoded){
            if(err){
                res.status(401).send("Invalid token. Please login first!")
            }
            else{
                req.role=decoded.role;
                req.userId=decoded._id;
                next();
            }
        })

    }catch(error){
        res.status(401).send("Invalid token. Please login first!")
    }
}
module.exports=auth;