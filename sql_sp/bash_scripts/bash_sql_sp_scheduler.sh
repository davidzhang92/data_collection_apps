#!/bin/bash

# Path to your first script
UpdatePartIDWithGUID="/data-storage/sfdc_apps/sql_sp/bash_scripts/UpdatePartIDWithGUID.sh"

# Path to your second script
CalculateOverallThroughput="/data-storage/sfdc_apps/sql_sp/bash_scripts/CalculateOverallThroughput.sh"

while true
do
    # Execute UpdatePartIDWithGUID
    bash "$UpdatePartIDWithGUID"

    # Execute CalculateOverallThroughput
    bash "$CalculateOverallThroughput"

done
