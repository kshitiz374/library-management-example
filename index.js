const express=require("express");
const { users } = require("./data/users.json");


const usersRouter=require("./routes/users");
const booksRouter=require("./routes/books");
const app=express();

const PORT=8081;

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Home Page :-)"
    })
})


app.get("/users",usersRouter);
app.get("/books",booksRouter);
/**
 * Route:/users,
 * Method:GET
 * description:get all the list of users in the system,
 * Access:Public,
 * Parameters:None
 */

app.get('/users',(req,res)=>{
    res.status(200).json({
        success:true,
        data:users
    })
})

/**
 * Route:/users/id,
 * Method:GET
 * description:get all the list of users by id
 * Access:Public,
 * Parameters:id
 */

app.get('/users/:id',(req,res)=>{

    const {id}=req.params;
    const user=users.find((each)=>each.id==id)
    //to handle the condition of 5 user
    if(!user){
        res.status(404).json({
            success:false,
            message:`User not found for id:${id}`
        })
    }

    res.status(200).json({
        success:true,
        data:user

    })
})


/**
 * Route:/users,
 * Method:POST
 * description:create /register a new user
 * Access:Public,
 * Parameters:None
 */

app.post('/users',(req,res)=>{

    
             //"id":"4",
            //"name":"Jane",
            //"surname":"Doe",
            //"email":"user@email.com",
            //"subscriptionType":"Basic",
            //"subscriptionDate":"04/01/2022"

            const {id,name,surname,email,subscriptionType,subscriptionDate}=req.body;
            if(!id||!name||!email||!subscriptionType||!subscriptionDate){
                return res.status(400),json({
                    success:false,
                    message:"Please provide all the required fields"
                })
            }

            const user=users.find((each)=>each.id===id);
            if (user){
                return res.status(409).json({
                    success:false,
                    message:`User Already Exists with id:${id}`
                })
            }

            users.push({id,name,surname,email,subscriptionType,subscriptionDate})

            res.status(201).json({
                success:true,
                message:`User Created Successfully`
            });


})


/**
 * Route:/users/id,
 * Method:PUT
 * description:Updating a user by their ID
 * Access:Public,
 * Parameters:ID
 */

app.put('/users/:id',(req,res)=>{
    const {id}=req.params;
    const {data}=req.body;

//check if the user exists
const user=users.find((each)=>each.id===id)
if(!user){
    return res.status(404).json({
        success:false,
        message:`User Not Found for id:${id}`
    })

}

//Object.assign(user,data);
//updating the things with the spread operator
const updatedUser=users.map((each)=>{
    if(each.id===id){
        return{
            ...each,
            ...data,
        }
    }
    return each
})
res.status(200).json({
    sucess:true,
    message:"User Updated Successfully"
})

});


app.delete('/users/:id',(req,res)=>{
const {id}=req.params;

//checking if the user exists
const user=users.find((each)=>each.id===id)
if(!user){
    return res.status(404).json({
        success:false,
        message:`User Not Found for ID:${id}`
    })

}

const updatedUsers=users.filter((each)=>each.id!=id)

res.status(200).json({
    success:true,
    data:updatedUsers,
    message:"User Deleted Successfully"
})

});
//app.all('*',(req,res)=>{
  //  res.status(500).json({
    //    message:"Not Built Yet"
   // })
//})

app.listen(PORT,()=>{
    console.log(`Server is up and running on http://localhost:${PORT}`)
})
