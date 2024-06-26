#!/bin/bash

# Path to your  script
UpdatePartIDWithGUID="/data-storage/sfdc_apps/sql_sp/bash_scripts/UpdatePartIDWithGUID.sh"

CalculateOverallThroughputV2="/data-storage/sfdc_apps/sql_sp/bash_scripts/CalculateOverallThroughputV2.sh"

InsertToVwResultEntry="/data-storage/sfdc_apps/sql_sp/bash_scripts/InsertToVwResultEntry.sh"

# Sleep duration in seconds for each script
SLEEP_DURATION_1=5
SLEEP_DURATION_2=5
SLEEP_DURATION_3=5

# Function to run a script with a sleep interval
run_script() {
    SCRIPT=$1
    SLEEP_DURATION=$2

    while true
    do
        echo "Starting $SCRIPT"
        bash "$SCRIPT"
        echo "Finished $SCRIPT"

        # Sleep for a while
        sleep $SLEEP_DURATION
    done
}

# Run each script in the background with its own sleep interval
run_script "$UpdatePartIDWithGUID" $SLEEP_DURATION_1 &
PID1=$!

run_script "$CalculateOverallThroughputV2" $SLEEP_DURATION_2 &
PID2=$!

run_script "$InsertToVwResultEntry" $SLEEP_DURATION_3 &
PID3=$!



# Wait for both processes to complete
wait $PID1 $PID2 $PID3 
