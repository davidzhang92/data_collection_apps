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

-- Get the last row from overall_throughput
DECLARE @LastRow TABLE (
    programming_entries INT,
    leaktest_entries INT,
    endtest_entries INT,
    laser_entries INT,
    oqc_entries INT,
    total_entries INT
)


    -- Calculate the sum of each select query based on the last 30 minutes of data
    SELECT @TotalEntries = 
        (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
        + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()));


	--Calculate entries for each processes

	SELECT @ProgrammingEntries = 0 + (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @LeaktestEntries = 0 + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @EndtestEntries = 0 + (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @LaserEntries = 0 + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))
	SELECT @OqcEntries = 0 + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, GETDATE()))



    -- Calculate the current 30-minute window start time

SET @WindowStartTime = DATEADD(MINUTE, DATEDIFF(MINUTE, 0, GETDATE()) / 30 * 30, 0);


INSERT INTO @LastRow
SELECT TOP 1 programming_entries, leaktest_entries, endtest_entries, laser_entries, oqc_entries, total_entries
FROM overall_throughput
WHERE created_date = @WindowStartTime
ORDER BY created_date DESC

-- Insert the result into the overall_throughput table only if the last row is different or does not exist
IF NOT EXISTS (
    SELECT *
    FROM @LastRow
    WHERE programming_entries = @ProgrammingEntries
    AND leaktest_entries = @LeaktestEntries
    AND endtest_entries = @EndtestEntries
    AND laser_entries = @LaserEntries
    AND oqc_entries = @OqcEntries
    AND total_entries = @TotalEntries
)
BEGIN
    INSERT INTO overall_throughput (id, programming_entries, leaktest_entries, endtest_entries, laser_entries, oqc_entries, total_entries, created_date, generated_date)
    VALUES (NEWID(), @ProgrammingEntries, @LeaktestEntries, @EndtestEntries, @LaserEntries, @OqcEntries,  @TotalEntries, @WindowStartTime, GETDATE());
END
END

GO


