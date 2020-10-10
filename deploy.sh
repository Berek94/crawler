#!/bin/bash

#copy build
tar czf build.tar.gz build
scp build.tar.gz deployer@82.148.19.60:~
rm -rf build.tar.gz

#running
ssh deployer@82.148.19.60 <<'ENDSSH'
rm -rf browser-worker
mkdir browser-worker
tar xf build.tar.gz -C browser-worker
rm -rf build.tar.gz
ENDSSH
