USE [DataCollection]
GO
/****** Object:  StoredProcedure [dbo].[UpdatePartIDWithGUID]    Script Date: 02-May-24 4:04:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[UpdatePartIDWithGUID]
AS
BEGIN
    -- Update the part_id in the endtest_result_entry table when is_deleted is not 1
    UPDATE E
    SET E.[part_id] = P.[id]
    FROM [DataCollection].[dbo].[endtest_result_entry] E
    INNER JOIN [part_master] P ON E.[dc_type] = P.[part_description]
    WHERE E.[part_id] IS NULL AND P.[is_deleted] = 0;

    -- remove the part_id if the is_deleted is 1 and there is no other matching part_description with is_deleted = 0
    UPDATE E
    SET E.[part_id] = null
    FROM [DataCollection].[dbo].[endtest_result_entry] E
    INNER JOIN [part_master] P ON E.[dc_type] = P.[part_description]
    WHERE  P.[is_deleted] = 1 AND NOT EXISTS (
        SELECT 1 FROM [part_master] P1
        WHERE P1.[part_description] = P.[part_description] AND P1.[is_deleted] = 0
    );
END;

