#!/usr/bin/env bash

SOURCE="/home/eoin/www/blog/docs/"
TARGET="/home/eoin/www/eoinmcg.github.io/docs/"

rsync -avu --delete $SOURCE $TARGET
