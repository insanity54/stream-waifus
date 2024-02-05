#/bin/bash

source ../.env
echo "allowedOrigin ${PUBLIC_SITE_URL} to bucket ${S3_BUCKET}"
b2-linux \
  update-bucket \
  --corsRules "[{\"corsRuleName\":\"allowUploads\", \"allowedOrigins\": [\"${PUBLIC_SITE_URL}\"], \"allowedHeaders\": [\"*\"], \"allowedOperations\": [\"s3_head\", \"s3_get\", \"s3_put\"], \"exposeHeaders\": [\"x-bz-content-sha1\", \"etag\"], \"maxAgeSeconds\": 3600}]" \
  "${S3_BUCKET}" allPrivate
