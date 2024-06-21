import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"

const packageDefinition = protoLoader.loadSync("../protos/helloworld.proto")
const HelloWorldProto = grpc.loadPackageDefinition(packageDefinition)

const greetingsBiderectionalStreamingStub = new HelloWorldProto.Greetings('0.0.0.0:40005',grpc.credentials.createInsecure())

async function serverBidirectionalStreaming(){
    const call = greetingsBiderectionalStreamingStub.GreetBiDirectionalStreaming()//initiate bi-directional stream
    
    const clientMessages = ['Hello from client 1 (independent)', 'Hello from client 2 (independent)', 'Hello from client 3 (independent)'];
    for (const message of clientMessages) {
      console.log('Sending message (client):', message);
      call.write({ name:message }); // Write to server stream
    }
    call.end(); // Signal client stream completion

    // Receive messages from server (independent stream)
    call.on('data', (data) => {
      console.log('Server message:', data.message);
    });

    call.on('end', () => {
      console.log('Bi-directional streaming completed.');
    });
      

}
serverBidirectionalStreaming().then(() => {
    console.log('ServerBidirectional-streaming completed.');
  }).catch(error => {
    console.error('Error:', error.message);
  });