import { S3Client, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';


export default defineEventHandler(async (event) => {

  
  // Create an S3 client
  //
  // You must copy the endpoint from your B2 bucket details
  // and set the region to match.
  const s3 = new S3Client({
    endpoint: 'https://s3.us-west-000.backblazeb2.com',
    region: 'us-west-000'
  });
  
  // Create a bucket and upload something into it
  var bucketName = 'waifu-redeems';
  var keyName = 'hello_world.txt';
  
  try {
  
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: keyName,
      Body: 'Hello World!'
    }));
  
    console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
  } catch (err) {
    console.log("Error: ", err);
  }

  return 'Hello Nitroest'
})
