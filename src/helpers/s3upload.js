import AWS from 'aws-sdk'
const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET, APP_ENVIRONMENT } = process.env

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
})

const s3 = new AWS.S3()
export const S3Service = {
  upload,
  download
}
async function upload (data, year, month, filename) {
  const Key = [APP_ENVIRONMENT.toUpperCase(), year, month, filename].join('/')
  return await s3.upload({
    Key,
    Bucket: AWS_BUCKET,
    Body: data
  }).promise()
}

async function download (filename) {
  const { Body } = await s3.getObject({
    Key: filename,
    Bucket: AWS_BUCKET
  }).promise()
  return Body
}
