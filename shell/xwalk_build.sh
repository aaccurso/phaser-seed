#!/bin/sh
if [ -z ${CROSSWALK_VERSION+x} ]; then CROSSWALK_VERSION="8.37.189.12"; fi
echo "Crosswalk version: $CROSSWALK_VERSION"
PROJECT_HOME=$PWD
DIST_HOME=$PROJECT_HOME/dist
BUILD_HOME=$PROJECT_HOME/build

cd $DEV_HOME/crosswalk-$CROSSWALK_VERSION &&
echo "[build_android][$(date +"%T")] Starting..." &&
mkdir $BUILD_HOME &&
python make_apk.py --verbose \
  --package $1 \
  --manifest $DIST_HOME/manifest.json \
  --target-dir $BUILD_HOME &&
mv $2 $BUILD_HOME &&
echo "[build_android][$(date +"%T")] Finished!"
cd $PROJECT_HOME
