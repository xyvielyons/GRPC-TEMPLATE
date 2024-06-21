import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

const greetingsServerStreamingStub = new HelloWorldProto.Greetings('0.0.0.0:40003',grpc.credentials.createInsecure())

async function serverStreaming(){
    const call = greetingsServerStreamingStub.GreetServerStreaming({name:'Hello from client'})
    
    call.on('data',(data)=>{
      console.log('Server message:',data.message)
    })
    call.on('end',()=>{
      console.log('Server-streaming completed')
    })
      

}
serverStreaming().then(() => {
    console.log('Server-streaming completed.');
  }).catch(error => {
    console.error('Error:', error.message);
  });