#!/bin/bash

# SQL Server connection parameters
server="$(hostname -I | cut -d' ' -f1)"   # Change to your SQL Server instance
database="DataCollection"
user="sa"
password="Cannon45!"

# SQL command to execute the stored procedure
sql_command="EXEC [dbo].[CalculateOverallThroughputV2]"

# Path to sqlcmd utility
sqlcmd="/opt/mssql-tools18/bin/sqlcmd"


# Execute the SQL command using sqlcmd
$sqlcmd -S $server -d $database -U $user -P $password -Q "$sql_command"  -C

# Check the exit code and log the result (optional)
if [ $? -eq 0 ]; then
    echo "Stored procedure executed successfully at $(date)" >> /var/log/sql_sp_log.log
else
    echo "Error executing stored procedure at $(date)" >> /var/log/sql_sp_error.log
fi

