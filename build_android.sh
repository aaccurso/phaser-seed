#!/bin/sh
PROJECT_HOME=$PWD
DIST_HOME=$PROJECT_HOME/dist
BUILD_HOME=$PROJECT_HOME/build

cd $DEV_HOME/crosswalk-8.37.189.12 &&
echo "[build_android][$(date +"%T")] Starting..." &&
python make_apk.py --package $1 --manifest $DIST_HOME/manifest.json &&
rm -fr $BUILD_HOME/$2 && mv -f $2 $BUILD_HOME && mv -f $2_arm.apk $BUILD_HOME && mv -f $2_x86.apk $BUILD_HOME &&
echo "[build_android][$(date +"%T")] Finished!"
cd $PROJECT_HOME
