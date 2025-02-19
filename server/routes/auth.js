const router = require('express').Router;
const {User, validate} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message: error.details[0].message});
        }
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(401).send({message: "Invalid username or password"});
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password,
        );

        if(!validPassword){
            return res.status(401).send({message: "Invalid Email or password"});
        }

        const token = user.generateAuthToken();
        res.status(200).send({
            data: token,
            message: "Login Successfully",
         })
    } catch(err){
        res.status(500).send({message: "Internal Server Error"})
    }
})

const validate = (data) =>{
    const schema = Joi.object({
        email: Joi.string().email().require().label("Email"),
        password: Joi.string().require().label("Password")
    });
    return schema.validate(data);
}

module.exports = router;