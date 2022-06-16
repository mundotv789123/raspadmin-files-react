#!/bin/bash

if [ ! -d node_modules ]; then 
    npm install;
fi

if [ ! -d .next ]; then 
    npm run build;
fi

npm run start