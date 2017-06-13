#!/bin/bash

dir=$(cd $(dirname $0);echo $PWD)
cd $dir
nodemon server.js
