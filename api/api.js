import grpc, { status } from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"
import express from 'express'

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)


const greetingsStub = new HelloWorldProto.Greetings('0.0.0.0:40000',grpc.credentials.createInsecure())


const app = express()

app.use(express.json())


app.post('/greetings',(req,res,next)=>{

    greetingsStub.Greet({name:req.body.name},(err,response)=>{
        if(err){
            return res.json({
                status:"fail",
                message:"greetings services are down at the moment",
                err
            })
        }
        return res.status(200).json({
            status:"success",
            response
        })
    })


})



app.listen(5000,()=>{
    console.log("server has started")
})