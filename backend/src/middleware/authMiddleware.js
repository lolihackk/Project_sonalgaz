const jwt =
    require("jsonwebtoken");


function verifyToken(
    req,
    res,
    next
) {


    const header =
        req.headers.authorization;


    if (
        !header
    ) {


        return res
            .status(401)
            .json({

                error:
                    "Access denied"
            });
    }



    const token =
        header.split(
            " "
        )[1];



    try {


        const verified =
            jwt.verify(

                token,

                process.env.JWT_SECRET
            );



        req.user =
            verified;



        next();



    } catch (error) {


        return res
            .status(403)
            .json({

                error:
                    "Invalid token"
            });
    }
}



module.exports =
    verifyToken;