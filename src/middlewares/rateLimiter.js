const requestCounts={};

const rateLimiter=(options)=>
{
    const { windowMs, max }=options;

    return (req,res,next)=>
    {
        const ipAddress=req.ip;
        const now=Date.now();

        if(!requestCounts[ipAddress])
        {
            requestCounts[ipAddress]={
                count: 1,
                resetTime: now+windowMs
            };
        }
        else
        {
            const { count, resetTime }=requestCounts[ipAddress];

            if(now>resetTime) // reset the count for this ipAddress
            {
                requestCounts[ipAddress]={ 
                    count: 1,
                    resetTime: now+windowMs
                };
            }
            else if(count>=max)
            {
                return res.status(429).json({
                    error: "Too many requests from this IP Address, please try again in some time"
                });
            }

            requestCounts[ipAddress].count++;
        }

        req.count=requestCounts[ipAddress].count;
        next();
    };
};

module.exports=rateLimiter;