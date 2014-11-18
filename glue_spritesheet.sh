#!/bin/sh
# More information in glue documentation http://glue.readthedocs.org/en/latest/index.html
ASSETS_HOME=assets

glue $1 $ASSETS_HOME/$2 --ordering=filename --json --algorithm=horizontal --crop
