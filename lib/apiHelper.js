


export const apiUrlForRequest = (allowLocal,url,fallbackUrl)=>{
    try{
        if(!fallbackUrl){
            throw Error('provide a fallback url with no localhost');
        }
        if(allowLocal && process.env.NODE_ENV === 'development'){
            return url;
        }
        return fallbackUrl;
    }
    catch(err){
        console.log(err);
    }
}