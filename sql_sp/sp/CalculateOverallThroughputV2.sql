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

    -- Calculate the current 30-minute window start time
    SET @WindowStartTime = DATEADD(MINUTE, DATEDIFF(MINUTE, 0, GETDATE()) / 30 * 30, 0);
    SET @WindowEndTime = DATEADD(MINUTE, 30, @WindowStartTime);

    -- Calculate the start and end of the current day
    SET @StartOfDay = DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0);
    SET @EndOfDay = DATEADD(SECOND, -1, DATEADD(DAY, 1, @StartOfDay));

    -- Set cursor for time blocks
    SET @TimeBlockCursor = CURSOR FOR
    SELECT created_date
    FROM overall_throughput
    WHERE created_date BETWEEN @StartOfDay AND @EndOfDay;

    -- Open cursor and fetch first row into variables
    OPEN @TimeBlockCursor;
    FETCH NEXT FROM @TimeBlockCursor INTO @CurrentTimeBlock;

    -- Iterate over each time block in the cursor
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate entries for each processes
        SELECT @ProgrammingEntries = 0 + (SELECT COUNT(id) FROM programming_result_entry WHERE created_date BETWEEN @WindowStartTime AND @WindowEndTime) - (SELECT COUNT(id) FROM programming_result_entry WHERE is_deleted = 1 AND created_date BETWEEN @StartOfDay AND @EndOfDay);
        SELECT @LeaktestEntries = 0 + (SELECT COUNT(id) FROM leaktest_result_entry WHERE created_date BETWEEN @WindowStartTime AND @WindowEndTime) - (SELECT COUNT(id) FROM leaktest_result_entry WHERE is_deleted = 1 AND created_date BETWEEN @StartOfDay AND @EndOfDay);
        SELECT @EndtestEntries = 0 + (SELECT COUNT(id) FROM endtest_result_entry WHERE created_date BETWEEN @WindowStartTime AND @WindowEndTime) - (SELECT COUNT(id) FROM endtest_result_entry WHERE is_deleted = 1 AND created_date BETWEEN @StartOfDay AND @EndOfDay);
        SELECT @LaserEntries = 0 + (SELECT COUNT(id) FROM laser_result_entry WHERE created_date BETWEEN @WindowStartTime AND @WindowEndTime) - (SELECT COUNT(id) FROM laser_result_entry WHERE is_deleted = 1 AND created_date BETWEEN @StartOfDay AND @EndOfDay);
        SELECT @OqcEntries = 0 + (SELECT COUNT(id) FROM oqc_result_entry WHERE created_date BETWEEN @WindowStartTime AND @WindowEndTime) - (SELECT COUNT(id) FROM oqc_result_entry WHERE is_deleted = 1 AND created_date BETWEEN @StartOfDay AND @EndOfDay);

        -- Calculate the total entries
        SELECT @TotalEntries = @ProgrammingEntries + @LeaktestEntries + @EndtestEntries + @LaserEntries + @OqcEntries;

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

        -- Fetch next row into variables
        FETCH NEXT FROM @TimeBlockCursor INTO @CurrentTimeBlock;
    END

    -- Close and deallocate cursor
    CLOSE @TimeBlockCursor;
    DEALLOCATE @TimeBlockCursor;
END
