#!/bin/bash

cd /opt/kalan.io
git pull
rm -rf /var/www/*
cp -r site/* /var/www/
