#!/bin/sh
# More information in glue documentation http://glue.readthedocs.org/en/latest/index.html
ASSETS_HOME=assets
ORDERING=${3:-filename}
ALGORITHM=${4:-horizontal}

glue $1 $ASSETS_HOME/$2 --ordering=${ORDERING} --json --algorithm=${ALGORITHM} --crop
