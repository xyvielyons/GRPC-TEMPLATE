import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

const greetingsClientStreamingStub = new HelloWorldProto.Greetings('0.0.0.0:40001',grpc.credentials.createInsecure())

async function clientStreaming(){
    const call = greetingsClientStreamingStub.GreetClientStreaming((error,response)=>{
        if(error){
            console.error('Error:', error.message);
            return;
        }
        console.log('Server response:', response.message)
    })
    
    const messages = ['Hello from client 1', 'Hello from client 2', 'Hello from client 3'];
      for (const message of messages) {
        console.log('Sending message:', message);
        call.write({ name:message }); // Write each message to the stream
      }
      call.end();
    
      

}
clientStreaming().then(() => {
    console.log('Client-streaming completed.');
  }).catch(error => {
    console.error('Error:', error.message);
  });