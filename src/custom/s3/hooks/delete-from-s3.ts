import { CollectionAfterDeleteHook } from "payload/types";
import { MediaDoc } from "../../../types";
import { getCurrentS3Instance } from "../s3-instance";

const deleteFromS3: CollectionAfterDeleteHook = async ({ doc }: { doc: MediaDoc }) => {
  const s3 = getCurrentS3Instance()
  await s3.deleteObject({
    Bucket: doc.s3.bucket,
    Key: String(doc.filename),
  }).promise()
  if (doc.sizes) {
    for (const key in doc.sizes) {
      const sizeData = doc.sizes[key];
      await s3.deleteObject({
        Bucket: doc.s3.bucket,
        Key: String(sizeData.filename),
      }).promise();
    }
  }
}

export default deleteFromS3;