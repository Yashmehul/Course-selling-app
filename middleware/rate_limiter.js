const ratelimit=require("express-rate-limit");
const limiter=ratelimit({
    windows:5*60*1000,
    max:50,
    message:"Too many requests from this IP.Please try again later"
})

module.exports=limiter;