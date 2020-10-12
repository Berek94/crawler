#!/bin/bash

#copy files
tar czf build-crawler.tar.gz src node_modules .env
scp build-crawler.tar.gz deployer@82.148.16.21:~
rm -rf build-crawler.tar.gz

#sending and run
ssh deployer@82.148.16.21 <<'ENDSSH'
rm -rf crawler
mkdir crawler
tar xf build-crawler.tar.gz -C crawler
rm -rf build-crawler.tar.gz
cd crawler
npm i puppeteer
pm2 restart crawler
ENDSSH
