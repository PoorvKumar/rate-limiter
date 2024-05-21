const express=require("express");
const app=express();
const rateLimiter=require("./middlewares/rateLimiter");

app.use(express.json());

const options={
    windowMs: 1*60*1000, 
    max: 5,
    message: "Too many requests from this IP Address, please try again in some time"
};
const limiter=rateLimiter(options);
app.use('/api',limiter);

app.post('/api',(req,res,next)=>
{
    console.log('Request Body:', req.body);
    console.log('Count:', req.count);

    return res.sendStatus(200);
});

const port=3000;
app.listen(port,()=>
{
    console.log(`API running on port: ${port}`);
});