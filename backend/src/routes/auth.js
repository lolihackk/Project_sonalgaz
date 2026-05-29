const express =
    require("express");


const router =
    express.Router();


const pool =
    require("../config/db");


const bcrypt =
    require("bcrypt");


const jwt =
    require("jsonwebtoken");



/* =====================================
   LOGIN
===================================== */


router.post(
    "/login",
    async (req, res) => {


        try {


            const {
                username,
                password
            } = req.body;



            /* FIND USER */


            const result =
                await pool.query(

                    `
                    SELECT *
                    FROM users
                    WHERE username = $1
                    `,

                    [
                        username
                    ]
                );



            if (
                result.rows.length === 0
            ) {


                return res
                    .status(401)
                    .json({

                        error:
                            "Invalid username or password"
                    });
            }



            const user =
                result.rows[0];



            /* CHECK PASSWORD */


            const passwordMatch =
                await bcrypt.compare(

                    password,

                    user.password
                );



            if (
                !passwordMatch
            ) {


                return res
                    .status(401)
                    .json({

                        error:
                            "Invalid username or password"
                    });
            }



            /* CREATE TOKEN */


            const token =
                jwt.sign(

                    {

                        id:
                            user.id,


                        username:
                            user.username,


                        role:
                            user.role

                    },


                    process.env.JWT_SECRET,


                    {

                        expiresIn:
                            "8h"
                    }
                );



            /* REMOVE PASSWORD */


            delete user.password;



            /* RESPONSE */


            res.json({

                message:
                    "Login successful",

                token,

                user
            });



        } catch (error) {


            console.error(
                error
            );



            res
                .status(500)
                .json({

                    error:
                        "Login failed"
                });
        }
    }
);



module.exports =
    router;