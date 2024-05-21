const requestCounts={};

const rateLimiter=(options)=>
{
    const { windowMs, max, message }=options;

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
                    count: 0,
                    resetTime: now+windowMs
                };
            }
            else if(count>=max)
            {
                return res.status(429).json({
                    error: message
                });
            }

            requestCounts[ipAddress].count++;
        }

        req.count=requestCounts[ipAddress].count;
        next();
    };
};

module.exports=rateLimiter;