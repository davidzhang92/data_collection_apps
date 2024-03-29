USE [DataCollection]
GO
/****** Object:  StoredProcedure [dbo].[CalculateOverallThroughput]    Script Date: 24-Oct-23 1:18:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[CalculateOverallThroughput]
AS
BEGIN
    DECLARE @TotalEntries INT;

    -- Calculate the sum of each select query based on the last 30 minutes of data
    SELECT @TotalEntries = 
        (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()));

    -- Calculate the current 30-minute window start time
    DECLARE @WindowStartTime DATETIME;
    SET @WindowStartTime = DATEADD(MINUTE, DATEDIFF(MINUTE, 0, GETDATE()) / 30 * 30, 0);

    -- Insert the result into the overall_throughput table with the current 30-minute window start time
    INSERT INTO overall_throughput (id, total_entries, created_date)
    VALUES (NEWID(), @TotalEntries, @WindowStartTime);
END
