#!/bin/bash

dir=$(cd $(dirname $0);echo $PWD)
cd $dir
npm start browser-sync start --proxy localhost:8888 --files "public/**/*.*"
