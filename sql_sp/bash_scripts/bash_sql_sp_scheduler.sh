#!/bin/bash

# Path to your first script
UpdatePartIDWithGUID="/data-storage/sfdc_apps/sql_sp/bash_scripts/UpdatePartIDWithGUID.sh"

# Path to your second script
CalculateOverallThroughput="/data-storage/sfdc_apps/sql_sp/bash_scripts/CalculateOverallThroughput.sh"

# Sleep duration in seconds for each script
SLEEP_DURATION_1=5
SLEEP_DURATION_2=1800

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

run_script "$CalculateOverallThroughput" $SLEEP_DURATION_2 &
PID2=$!

# Wait for both processes to complete
wait $PID1 $PID2
