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
DECLARE @WindowEndTime DATETIME;

-- Calculate the current 30-minute window start time
SET @WindowStartTime = DATEADD(MINUTE, DATEDIFF(MINUTE, 0, GETDATE()) / 30 * 30, 0);
SET @WindowEndTime = DATEADD(MINUTE, 30, @WindowStartTime);

SELECT * FROM oqc_result_entry WHERE is_deleted = 0 AND created_date >= DATEADD(MINUTE, -30, @WindowStartTime)

-- Calculate the sum of each select query based on the last 30 minutes of data
SELECT @TotalEntries = 
    (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime)
    + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime)
    + (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime)
    + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime)
    + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);

-- Calculate entries for each processes
SELECT @ProgrammingEntries = 0 + (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
SELECT @LeaktestEntries = 0 + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
SELECT @EndtestEntries = 0 + (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
SELECT @LaserEntries = 0 + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
SELECT @OqcEntries = 0 + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);



-- Check if the row already exists
IF EXISTS (SELECT 1 FROM overall_throughput WHERE created_date = @WindowStartTime)
BEGIN
    -- Update the existing row
    UPDATE overall_throughput
    SET programming_entries = @ProgrammingEntries,
        leaktest_entries = @LeaktestEntries,
        endtest_entries = @EndtestEntries,
        laser_entries = @LaserEntries,
        oqc_entries = @OqcEntries,
        total_entries = @TotalEntries,
        generated_date = GETDATE()
    WHERE created_date = @WindowStartTime;
END
ELSE
BEGIN
    -- Insert a new row
    INSERT INTO overall_throughput (id, programming_entries, leaktest_entries, endtest_entries, laser_entries, oqc_entries, total_entries, created_date, generated_date)
     VALUES (NEWID(), 0, 0, 0, 0, 0, 0, @WindowStartTime, GETDATE());
END
END


GO


