export const asyncHandler =(requestHandler)=> (req, req, next)=>{
    Promise.resolve(requestHandler).catch((err)=>next(err))
}
