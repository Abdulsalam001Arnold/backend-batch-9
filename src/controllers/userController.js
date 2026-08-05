
import { userModel } from "../models/userModel.js"
import { signupValidate, loginValidate } from "../validator/userValidator.js"
import bcrypt from "bcryptjs"

export const getHome = (req, res) => {
   res.send("Homepage!")
}

export const getAbout = (req, res) => {
   console.log(req.url, req.method)
   res.send("Aboutpage!")
}


export const postUser = async (req, res) => {
   try {
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
      
   } catch (error) {
      console.error(error)
      throw new Error(error)
   }
}


export const loginUser = async (req, res) => {
   try {
      const {email, password} = req.body
   
      const {error} = loginValidate.validate({
         email,
         password
      })

      if(error) {
         return res.status(400).json({
            message: error.details[0].message
         })
      }

      const existingUser = await userModel.findOne({email})

      if(!existingUser) {
         return res.status(404).json({
            message: `User with ${email} does not exist. Signup instead.`
         })
      }
   
      const isPasswordValid = await bcrypt.compare(password, existingUser.password)

      if(!isPasswordValid) {
         return res.status(401).json({
            message: "Invalid credentials. Try again."
         })
      }

      const refinedUser = {
         username: existingUser.username,
         email: existingUser.email,
      }

      return res.status(200).json({
         message: "Login successful.",
         data: refinedUser
      })
      
   } catch (error) {
      console.error(error)
      throw new Error(error)
   }
}