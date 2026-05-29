

const express = require("express");

const router = express.Router();

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");


/* =====================================
   GEMINI SETUP
===================================== */


console.log(
    "Gemini Key:",
    process.env.GEMINI_API_KEY
        ? "FOUND"
        : "MISSING"
);


const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );


/* =====================================
   AI MOTIF GENERATOR
===================================== */


router.post(
    "/generate-motif",
    async (req, res) => {


        console.log(
            "AI route reached"
        );


        try {


            const { prompt } =
                req.body;


            /* VALIDATION */


            if (!prompt) {


                return res
                    .status(400)
                    .json({

                        error:
                            "Prompt is required"
                    });
            }


            /* MODEL */


            const model =
                genAI.getGenerativeModel({

                  model:
    "gemini-2.5-flash-lite",

                    generationConfig: {

                        temperature: 0.3,

                        maxOutputTokens: 180
                    }
                });


            /* PROMPT */


const aiPrompt = `

Tu es un ingénieur chef de conduite SONALGAZ
spécialisé dans l'exploitation des réseaux électriques HTB/HTA
au niveau d'un centre dispatching.

Ta mission:
Rédiger uniquement le champ "MOTIF"
d'un message officiel d'exploitation électrique.

Tu reçois les informations d'un formulaire dispatching:

- type d'opération
- ouvrage électrique
- niveau de tension
- district
- état du message
- chef de conduite
- remarque opérateur

Analyse toutes les informations disponibles
et génère un motif professionnel utilisé dans
les échanges d'exploitation SONALGAZ.


OBJECTIF DU MOTIF:

Le motif doit préciser si disponible:

- l'action d'exploitation réalisée
- l'ouvrage concerné
- la tension
- la localisation
- la durée si elle est fournie
- la nature exacte de l'intervention
- la sécurité des intervenants
- la continuité d'exploitation du réseau


STYLE OBLIGATOIRE:

- Français uniquement
- Style technique dispatching SONALGAZ
- Une seule phrase complète
- Phrase professionnelle et concise
- Maximum 3 lignes
- Aucun titre
- Aucune introduction
- Aucune explication
- Aucune liste
- Retourner uniquement le MOTIF final


RÈGLES STRICTES:

- Ne jamais inventer un ouvrage
- Ne jamais inventer un lieu
- Ne jamais inventer une date
- Ne jamais inventer une durée
- Garder exactement les tensions indiquées
- Garder exactement les informations du formulaire

Ne jamais écrire:

"travaux demandés"
"opération demandée"
"intervention demandée"
"validation"
"transfert de charge réseau"


GESTION DES INFORMATIONS:

Si la remarque opérateur contient uniquement:

1h
2 heures
30 minutes

Considérer cette information comme
la durée de l'opération.

Utiliser ensuite:
- le type d'opération
- l'ouvrage
- la tension
- le district

pour construire le motif.


VOCABULAIRE À UTILISER:

Selon le contexte utiliser:

"Mise en indisponibilité programmée de..."

"Retrait d'exploitation de..."

"Consignation des équipements concernés..."

"Réalisation des essais et contrôles..."

"Modification temporaire du schéma d'exploitation..."

"Manœuvres d'exploitation nécessaires..."


Pour la fin du motif utiliser:

"afin de garantir la sécurité des intervenants
et la continuité d'exploitation du réseau
conformément aux procédures en vigueur."


EXEMPLES:


Entrée:

Type:
Maintenance

Ouvrage:
Transformateur

Tension:
220KV

District:
M'sila

Information:
1h


Réponse:

Mise en indisponibilité programmée du transformateur 220KV M'sila pour une durée de 1h afin de permettre la réalisation des travaux de maintenance programmée, tout en garantissant la sécurité des intervenants et la continuité d'exploitation du réseau conformément aux procédures en vigueur.



Entrée:

Type:
Travaux

Ouvrage:
Poste

Tension:
60KV


Réponse:

Consignation des équipements concernés au niveau du poste 60KV afin de permettre la réalisation des travaux programmés dans des conditions optimales de sécurité et de fiabilité d'exploitation du réseau.



Entrée:

Type:
Essais

Ouvrage:
Départ

Tension:
220KV

Information:
protection


Réponse:

Réalisation des essais et contrôles des protections du départ 220KV concerné afin de garantir le bon fonctionnement des équipements et la sûreté d'exploitation du réseau électrique.



Maintenant rédige uniquement le MOTIF correspondant aux informations suivantes:


${prompt}


`;



            /* GENERATE */


            let result;


            try {


                result =
                    await model.generateContent(
                        aiPrompt
                    );


            } catch (error) {


                if (
                    error.status === 503
                ) {


                    console.log(
                        "Retry Gemini..."
                    );


                    result =
                        await model.generateContent(

`
Rédige un motif SONALGAZ professionnel:

${prompt}
`
                        );


                } else {


                    throw error;
                }
            }


            /* RESPONSE TEXT */


            const text =
                result
                    .response
                    .text();


            console.log(
                "Generated motif:",
                text
            );


            res.json({

                motif:
                    text.trim()
            });



        } catch (error) {


            console.log(
                "AI ERROR STATUS:",
                error.status
            );


            console.log(
                "AI ERROR:",
                error.message
            );


            /* QUOTA */


            if (
                error.status === 429
            ) {


                return res
                    .status(429)
                    .json({

                        error:
                            "Gemini quota reached. Please try again later."
                    });
            }


            /* API KEY */


            if (
                error.status === 401
            ) {


                return res
                    .status(401)
                    .json({

                        error:
                            "Invalid Gemini API key."
                    });
            }


            /* SERVER */


            res
                .status(500)
                .json({

                    error:
                        "AI generation failed"
                });
        }
    }
);


module.exports = router;