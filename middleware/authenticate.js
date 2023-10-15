//import the required library

const jwt=require('jsonwebtoken');

//define the middle ware function

let authenticate=(request,response,next)=>{

    //get the jwt token

    let token=request.header('x-auth-token');

    //check if the token exist or not

    if(!token){

        return response.status(401).json({msg:'No Token , Authentication Denied'});
    }

    try{
        //decode the toekn

        let decode=jwt.verify(token,process.env.JWT_SECRET_KEY);
        request.user=decode.user;
        next();


    }
    catch(error){

        response.status(401).json({msg:'Token is not valid'});
    }
}

module.exports=authenticate;