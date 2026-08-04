
import { userModel } from "../models/userModel.js"
import { signupValidate } from "../validator/userValidator.js"

export const getHome = (req, res) => {
   res.send("Homepage!")
}

export const getAbout = (req, res) => {
   console.log(req.url, req.method)
   res.send("Aboutpage!")
}


export const postUser = async (req, res) => {
   const {username, email, password} = req.body

   const {error} = signupValidate.validate({
      username,
      email,
      password
   })

   if(error) {
      return res.status(400).json({
         message: error.details[0].message
      })
   }


   const existingUser = await userModel.findOne({email})

   if(existingUser) {
      return res.status(400).json({
         message: `User with ${email} already exists, login instead or create a new account.`
      })
   }

   const newUser = await userModel.create({
      username,
      email,
      password
   })

   res.status(201).json({
      message: "User created",
      data: newUser
   })
}