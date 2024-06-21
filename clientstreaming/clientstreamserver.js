import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

function clientStreamingEcho(call,callback){
 call.on('data',(data)=>{
    console.log(data)
 })
 call.on('end',()=>{
    callback(null,{message:"Received messages from client"})
 })
 call.on('error', function(e) {
    callback(null,{message:e})
  });
 call.on('status',(status)=>{
    callback(null,{message:status})

 })

}

const server = new grpc.Server()
server.addService(HelloWorldProto.Greetings.service,{GreetClientStreaming:clientStreamingEcho})
server.bindAsync('0.0.0.0:40001',grpc.ServerCredentials.createInsecure(),()=>{
    server.start()
    console.log("server started on port 40001")
})