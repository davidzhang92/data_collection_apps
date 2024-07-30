USE [DataCollection]
GO
/****** Object:  StoredProcedure [dbo].[CalculateOverallThroughputV2]    Script Date: 26-Jun-24 8:07:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[CalculateOverallThroughputV2]
AS
BEGIN
    -- Declare all variables at the beginning
    DECLARE @WindowStartTime DATETIME;
    DECLARE @WindowEndTime DATETIME;
    DECLARE @StartOfDay DATETIME;
    DECLARE @EndOfDay DATETIME;
    DECLARE @TotalEntries INT;
    DECLARE @ProgrammingEntries INT;
    DECLARE @LeaktestEntries INT;
    DECLARE @EndtestEntries INT;
    DECLARE @LaserEntries INT;
    DECLARE @OqcEntries INT;
    DECLARE @TimeBlockCursor CURSOR;
    DECLARE @CurrentTimeBlock DATETIME;

    -- Calculate the start and end of the current day
    SET @StartOfDay = DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0);
    SET @EndOfDay = DATEADD(SECOND, -1, DATEADD(DAY, 1, @StartOfDay));

    -- Set cursor for time blocks
    SET @TimeBlockCursor = CURSOR FOR
    SELECT DATEADD(MINUTE, number * 30, @StartOfDay) AS TimeBlock
    FROM master..spt_values
    WHERE type = 'P'
    AND number < DATEDIFF(MINUTE, @StartOfDay, @EndOfDay) / 30;

    -- Open cursor and fetch first row into variables
    OPEN @TimeBlockCursor;
    FETCH NEXT FROM @TimeBlockCursor INTO @CurrentTimeBlock;

    -- Iterate over each time block in the cursor
    WHILE @@FETCH_STATUS = 0
    BEGIN

        -- Calculate the current 30-minute window start time
        SET @WindowStartTime = @CurrentTimeBlock;
        SET @WindowEndTime = DATEADD(MINUTE, 30, @WindowStartTime);

        -- Calculate entries for each processes
        SELECT @ProgrammingEntries = 0 + (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
        SELECT @LeaktestEntries = 0 + (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
        SELECT @EndtestEntries = 0 + (SELECT COUNT(id) FROM endtest_result_entry WHERE part_id is not null AND created_date BETWEEN @WindowStartTime AND @WindowEndTime) + ISNULL((SELECT SUM(quantity) FROM endtest_defect_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime), 0);
        SELECT @LaserEntries = 0 + (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);
        SELECT @OqcEntries = 0 + (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 0 AND created_date BETWEEN @WindowStartTime AND @WindowEndTime);

        -- Calculate the total entries
        SELECT @TotalEntries = @ProgrammingEntries + @LeaktestEntries + @EndtestEntries + @LaserEntries + @OqcEntries;

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
            VALUES (NEWID(), @ProgrammingEntries, @LeaktestEntries, @EndtestEntries, @LaserEntries, @OqcEntries, @TotalEntries, @WindowStartTime, GETDATE());
        END

        -- Fetch next row into variables
        FETCH NEXT FROM @TimeBlockCursor INTO @CurrentTimeBlock;
    END

    -- Close and deallocate cursor
    CLOSE @TimeBlockCursor;
    DEALLOCATE @TimeBlockCursor;
END