import jwt from 'jsonwebtoken';
interface Data {
    role : string;
    email: string;
}

interface Token {
    token : string;
}
export const tokenGenerator = (data:Data,secretKey:string)=>{
    let token = '';
    if(data.role === 'supportAdmin'){
        token = jwt.sign({adminEmail: data.email}, secretKey, {expiresIn: '1d'});
        console.log('Admin Token ==> ', token);
    }else{
        token = jwt.sign({userEmail: data.email}, secretKey, {expiresIn: '1d'});
        console.log('User Token ==> ', token);
    }
    console.log('Token inside tokenGenerator outside if-else  block ==> ', token);
    return token;
}

export const tokenVerifier = (token:any, secretKey:string)=>{
    try {
        // console.log('token --> ',token);
        const payload = jwt.verify(token, secretKey);
        console.log("payload on token verifying ", payload);
        return payload;
      } catch (error:any) {
        console.log('Token verification failed:', error.message);
        // response.status(203).json({ message: "Token verification failed" });
        return error;
      }
}

