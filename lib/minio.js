import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  endpoint: `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
})

export async function uploadFile(file, key) {
  const params = {
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: file.type || 'application/octet-stream'
  }

  return s3.upload(params).promise()
}

export function getSignedUrl(key, expires = 3600) {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: key,
    Expires: expires
  })
}

export async function deleteFile(key) {
  const params = {
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: key
  }

  return s3.deleteObject(params).promise()
}

export default s3