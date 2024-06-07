const successresponse = (msg,data,totalcount)=>{
    if (totalcount) {
        return({
            status:true,
            response_code:200,
            response_msg:msg,
            data:data,
            totalcount:totalcount
        })
    }else{
        return({
            status:true,
            response_code:200,
            response_msg:msg,
            data:data
        })
    }
    
}

const faildataresponse = (msg)=>{
    return({
        status:false,
        response_code:404,
        response_msg:msg
    })
}

const failresponse = (msg)=>{
    return({
        status:false,
        response_code:400,
        response_msg:msg
    })
}

export default{
    successresponse,
    failresponse,
    faildataresponse
}