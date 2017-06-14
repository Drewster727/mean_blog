#!/bin/bash

dir=$(cd $(dirname $0);echo $PWD)
cd $dir
npm start nodemon server.js
