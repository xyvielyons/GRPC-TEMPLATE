import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

function GreetingsFunction(call,callback){
    console.log(call.metadata.get('timestamp'))
    //the parameters parsed in the server are stored in the call.request
    //callback(error,result)
    let name = call.request.name;
    if(!name){
        callback({
            message: 'please parse in name',
            code: grpc.status.INVALID_ARGUMENT
        })
    }
    //for the respnse we set the error to null 
    //we return hello {name} as the response
    
        callback(null,{
            message:`hello ${name}`
        
        })

  
    

}

const server = new grpc.Server()
server.addService(HelloWorldProto.Greetings.service,{Greet:GreetingsFunction})
server.bindAsync('0.0.0.0:40000',grpc.ServerCredentials.createInsecure(),()=>{
    server.start()
    console.log("server started on port 40000")
})

