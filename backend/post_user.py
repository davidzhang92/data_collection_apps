from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

# # Define your MS SQL Server connection details (Windows)
# server = '192.168.100.121'
# database = 'DataCollection'
# username = 'sa'
# password = 'Cannon45!'

# # Establish the connection
# conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)


# def fetch_data(query):
#     cursor = conn.cursor()
#     cursor.execute(query)
#     rows = cursor.fetchall()
#     return rows


# Define your MS SQL Server connection details (Linux)
# Use the DSN you've defined in your odbc.ini file

dsn = 'DataCollection'

# Establish the connection
conn = pyodbc.connect('DSN=DataCollection;UID=sa;PWD=Cannon45!')


@app.route('/api/post-user', methods=['POST'])
def post_user():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_user_name = data['user_name']
        new_access_level = data['access_level']
        new_password = data['password']


        cursor = conn.cursor()

        # Check for duplicates
        user_name_duplicate_query_check = """
            SELECT COUNT(id) AS count 
            FROM user_master where username = ? and is_deleted  = 0
        """

        cursor.execute(user_name_duplicate_query_check, (new_user_name))
        user_name_result = cursor.fetchone()

        # debug
        # print (user_name_result)
        # print (access_level_result)
    
        if user_name_result is not None and user_name_result[0] != 0:
            return jsonify({'message': 'Error: Username is already exist'}), 400

        # Construct the SQL query to update the part_no and part_description for the given id
        query = """
        DECLARE @Username NVARCHAR(MAX);
        DECLARE @Password NVARCHAR(MAX);
        DECLARE @Salt VARCHAR(MAX);
        DECLARE @HashedPassword VARBINARY(MAX);
        DECLARE @AccessLevel uniqueidentifier;

        SET @Username = ?; -- replace with your username
        SET @Password = ?; -- replace with your password
        SET @AccessLevel = ?

        EXEC HashPassword @Username, @Password, @Salt = @Salt OUTPUT, @HashedPassword = @HashedPassword OUTPUT;

        INSERT INTO user_master(id, username, salt, password_hash, access_level, is_superadmin, created_date, is_deleted)
        VALUES (NEWID(), @Username, @Salt, @HashedPassword, @AccessLevel, '0', GETDATE(), '0');
        """



        # Execute the SQL query
        cursor.execute(query, (new_user_name, new_password, new_access_level))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data inserted.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
