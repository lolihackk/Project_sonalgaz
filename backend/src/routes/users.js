const express =
    require("express");


const router =
    express.Router();


const pool =
    require("../config/db");


const bcrypt =
    require("bcrypt");


const verifyToken =
    require(
        "../middleware/authMiddleware"
    );





/* =====================================
   ADMIN ONLY
===================================== */

function adminOnly(
    req,
    res,
    next
) {


    if (
        req.user.role !==
        "admin"
    ) {


        return res
            .status(403)
            .json({

                error:
                    "Admin only"
            });
    }


    next();
}









/* =====================================
   GET USERS
===================================== */

router.get(

    "/",

    verifyToken,

    adminOnly,


    async (req,res)=>{


        try {


            const result =
                await pool.query(

                    `
                    SELECT
                        id,
                        username,
                        role
                    FROM users
                    ORDER BY id
                    `
                );



            res.json(
                result.rows
            );


        } catch(error){


            console.error(error);


            res.status(500)
                .json({

                    error:
                        "Cannot load users"
                });
        }
    }
);










/* =====================================
   CREATE USER
===================================== */

router.post(

    "/",

    verifyToken,

    adminOnly,


    async(req,res)=>{


        try {


            const {
                username,
                password,
                role
            } = req.body;



            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );



            await pool.query(

                `
                INSERT INTO users
                (
                    username,
                    password,
                    role
                )

                VALUES
                ($1,$2,$3)
                `,


                [
                    username,
                    hashedPassword,
                    role
                ]
            );




            res.json({

                message:
                    "User created"
            });



        } catch(error){


            console.error(error);


            res.status(500)
                .json({

                    error:
                        "Create user failed"
                });
        }
    }
);











/* =====================================
   UPDATE USER
===================================== */

router.put(

    "/:id",

    verifyToken,

    adminOnly,


    async(req,res)=>{


        try {


            const {
                username,
                password,
                role
            } = req.body;




            if (
                password &&
                password.trim() !== ""
            ) {


                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );



                await pool.query(

                    `
                    UPDATE users

                    SET
                    username=$1,
                    password=$2,
                    role=$3

                    WHERE id=$4
                    `,


                    [
                        username,
                        hashedPassword,
                        role,
                        req.params.id
                    ]
                );



            } else {



                await pool.query(

                    `
                    UPDATE users

                    SET
                    username=$1,
                    role=$2

                    WHERE id=$3
                    `,


                    [
                        username,
                        role,
                        req.params.id
                    ]
                );
            }




            res.json({

                message:
                    "User updated"
            });




        } catch(error){


            console.error(error);



            res.status(500)
                .json({

                    error:
                        "Update failed"
                });
        }
    }
);









/* =====================================
   DELETE USER
===================================== */

router.delete(

    "/:id",

    verifyToken,

    adminOnly,


    async(req,res)=>{


        try {


            await pool.query(

                `
                DELETE FROM users
                WHERE id=$1
                `,


                [
                    req.params.id
                ]
            );




            res.json({

                message:
                    "User deleted"
            });




        } catch(error){


            console.error(error);



            res.status(500)
                .json({

                    error:
                        "Delete failed"
                });
        }
    }
);








module.exports =
    router;