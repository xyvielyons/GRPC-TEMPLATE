import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()

function BiderectionalStreaming(call,callback){
  call.on('data',(data)=>{
  //  console.log(data)
    const message = data.name// Receive messages from client
    console.log('Received message (client):',message)
    const responseMessage = `server echo:${message}`
    console.log(`Sending message (server):`,responseMessage)
    call.write({message:responseMessage})// Send echo back to client
  })
  call.on('end',()=>{
    console.log('Client stream ended')
  })
 
}


server.addService(HelloWorldProto.Greetings.service,{GreetBiDirectionalStreaming:BiderectionalStreaming})

server.bindAsync('0.0.0.0:40005',grpc.ServerCredentials.createInsecure(),()=>{
    server.start()
    console.log("Biderectional server started on port 40005")
})