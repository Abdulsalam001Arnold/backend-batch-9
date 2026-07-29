

export const getHome = (req, res) => {
   res.send("Homepage!")
}

export const getAbout = (req, res) => {
   console.log(req.url, req.method)
   res.send("Aboutpage!")
}


export const postUser = () => {
   const {username, email, password} = req.body

   console.log(username, email, password)

   if(!username && !email && !password) {
      res.status(404).json({
         message: "Provide all fields"
      })
   }

   res.status(201).json({
      message: "Created"
   })
}