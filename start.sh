#!/bin/bash

dir=$(cd $(dirname $0);echo $PWD)
cd $dir
nodemon server.js &
browser-sync start --proxy localhost:8888 --files "public/**/*.*"
