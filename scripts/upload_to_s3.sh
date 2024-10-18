#!/usr/bin/env bash

build_dir=$1

if [ -z "$BUCKET_NAME" ]; then
  echo "BUCKET_NAME is not set. Exiting."
  exit 1
fi

# a little clean up to prevent assets from piling up with each build
if [ -n "$CLEAR_PATHS" ]; then
    # for each comma delimited path. . . 
    for path in $(echo $CLEAR_PATHS | tr "," "\n")
    do
        echo "Clearing path: $path"
        aws s3api list-objects-v2 --bucket $BUCKET_NAME --query "Contents[?starts_with(Key, '$path.')].[Key]" --output text | xargs -I {} aws s3api delete-object --bucket $BUCKET_NAME --key "{}"
    done
fi

aws s3 cp $build_dir "s3://$BUCKET_NAME" --recursive
