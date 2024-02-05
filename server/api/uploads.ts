import { createError } from 'h3'
import type { Database } from '~~/types/database.types'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.S3_BUCKET_ENDPOINT) throw new Error('S3_BUCKET_ENDPOINT missing in env');
if (!process.env.S3_BUCKET_REGION) throw new Error('S3_BUCKET_REGION missing in env');
if (!process.env.S3_BUCKET_NAME) throw new Error('S3_BUCKET_NAME missing in env');

const maxFileSize = 20000000;
const filenameSchema = z.string().max(255, 'image filename must be fewer than 255 characters');

// const fileSchema = z.object({
//   z.any()
//     .refine((file: File) => file?.length !== 0, "File is required")
//     .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
//     .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported."),`
//   });

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabaseClient = await serverSupabaseClient<Database>(event)

  const query = getQuery(event)

  console.log(`[uploads.ts] a user is making a request.filename = ${ query.filename }`)

  if (user?.role !== 'authenticated') throw new Error('user is not authenticated');

  // validate input
  const filename = filenameSchema.parse(query.filename)


  const endpoint = process.env.S3_BUCKET_ENDPOINT; // "https://s3.us-east-005.backblazeb2.com"
  const region = process.env.S3_BUCKET_REGION; // "us-east-005"
  const bucket = process.env.S3_BUCKET_NAME;

  const s3 = new S3Client({
    region,
    endpoint,
  });
  const expiresIn = 7 * 24 * 60 * 60; // 3600
  const command = new PutObjectCommand({ Bucket: bucket, Key: filename });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn });

  console.log(`signedUrl=${signedUrl}`);

  return signedUrl
})



// const createPresignedUrlWithoutClient = async ({ region, bucket, key }: { region: string, bucket: string, key: string }) => {
//   const url = parseUrl(`https://${bucket}.s3.${region}.backblazeb2.com/${key}`);
//   const presigner = new S3RequestPresigner({
//     credentials: fromEnv(),
//     region,
//     sha256: Hash.bind(null, "sha256"),
//   });

//   const signedUrlObject = await presigner.presign(
//     new HttpRequest({ ...url, method: "PUT" }),
//   );
//   return formatUrl(signedUrlObject);
// };

// const createPresignedUrlWithClient = ({ endpoint, region, bucket, key }: { endpoint: string, region: string, bucket: string, key: string }) => {
//   const client = new S3Client({ endpoint, region });
//   const command = new PutObjectCommand({ Bucket: bucket, Key: key });
//   return getSignedUrl(client, command, { expiresIn: 3600 });
// };

// function put(url: string, data: any) {
//   return new Promise((resolve, reject) => {
//     const req = https.request(
//       url,
//       { method: "PUT", headers: { "Content-Length": new Blob([data]).size } },
//       (res) => {
//         let responseBody = "";
//         res.on("data", (chunk) => {
//           responseBody += chunk;
//         });
//         res.on("end", () => {
//           resolve(responseBody);
//         });
//       },
//     );
//     req.on("error", (err) => {
//       reject(err);
//     });
//     req.write(data);
//     req.end();
//   });
// }

// export const main = async () => {
//   const REGION = "us-west-000";
//   const BUCKET = "waifu-redeems";
//   const KEY = "example_file.txt";

//   // There are two ways to generate a presigned URL.
//   // 1. Use createPresignedUrl without the S3 client.
//   // 2. Use getSignedUrl in conjunction with the S3 client and GetObjectCommand.
//   try {
//     // const noClientUrl = await createPresignedUrlWithoutClient({
//     //   region: REGION,
//     //   bucket: BUCKET,
//     //   key: KEY,
//     // });

//     const clientUrl = await createPresignedUrlWithClient({
//       region: REGION,
//       bucket: BUCKET,
//       key: KEY,
//     });

//     // After you get the presigned URL, you can provide your own file
//     // data. Refer to put() above.
//     console.log("Calling PUT using presigned URL without client");
//     await put(noClientUrl, "Hello World");

//     console.log("Calling PUT using presigned URL with client");
//     await put(clientUrl, "Hello World");

//     console.log("\nDone. Check your S3 console.");
//   } catch (err) {
//     console.error(err);
//   }
// };