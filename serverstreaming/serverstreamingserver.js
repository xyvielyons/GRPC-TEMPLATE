import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()
const STREAMING_COUNT = 500

function serverStreaming(call,callback){
  
  const requestMessage = call.request.name
  console.log('Received request:',requestMessage)

  for (let i = 0; i < STREAMING_COUNT; i++) {
    const responseMessage = `Server echo (message ${i + 1}): ${requestMessage}`;
    console.log(`Sending message ${i + 1}:`, responseMessage);
    call.write({ message: responseMessage });
  }
  call.end();

}


server.addService(HelloWorldProto.Greetings.service,{GreetServerStreaming:serverStreaming})

server.bindAsync('0.0.0.0:40003',grpc.ServerCredentials.createInsecure(),()=>{
    server.start()
    console.log("server started on port 40003")
})