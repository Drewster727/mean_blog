#!/bin/bash

dir=$(cd $(dirname $0);echo $PWD)
cd $dir
browser-sync start --proxy localhost:8888 --files "public/**/*.*"
