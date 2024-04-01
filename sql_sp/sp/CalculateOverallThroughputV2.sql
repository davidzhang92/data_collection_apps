USE [DataCollection]
GO

/****** Object:  StoredProcedure [dbo].[CalculateOverallThroughput]    Script Date: 01-Apr-24 11:39:06 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[CalculateOverallThroughputV2]
AS
BEGIN

DECLARE @TotalEntries INT;
DECLARE @ProgrammingEntries INT;
DECLARE @LeaktestEntries INT;
DECLARE @EndtestEntries INT;
DECLARE @LaserEntries INT;
DECLARE @OqcEntries INT;
DECLARE @WindowStartTime DATETIME;




    -- Calculate the sum of each select query based on the last 30 minutes of data
    SELECT @TotalEntries = 
        (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()));


	--Calculate entries for each processes

	SELECT @ProgrammingEntries = (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @LeaktestEntries = (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @EndtestEntries = (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @LaserEntries = (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @OqcEntries = (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))



    -- Calculate the current 30-minute window start time

    SET @WindowStartTime = DATEADD(MINUTE, DATEDIFF(MINUTE, 0, GETDATE()) / 30 * 30, 0);

    -- Insert the result into the overall_throughput table with the current 30-minute window start time
    INSERT INTO overall_throughput (id, programming_entries, leaktest_entries, endtest_entries, laser_entries, oqc_entries, total_entries, created_date)
    VALUES (NEWID(), @ProgrammingEntries, @LeaktestEntries, @EndtestEntries, @LaserEntries, @OqcEntries,  @TotalEntries, @WindowStartTime);
END

GO


