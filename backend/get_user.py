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


@app.route('/api/get-user', methods=['GET'])
def get_user():
    try:
        # Extract the page query parameter from the request
        page = int(request.args.get('page', 1))  # Default value is 1

        # Calculate the offset based on the page number
        offset = (page - 1) * 10

        cursor = conn.cursor()

        # Construct the SQL query to select data from the part_master table with OFFSET
        query = """SELECT a.id, a.username, b.access_type, a.latest_date, a.last_login, c.username AS created_by_username
                FROM (
                    SELECT 
                        a.id, 
                        a.username, 
                        CASE WHEN a.modified_date >= a.created_date THEN a.modified_date ELSE a.created_date END AS latest_date,
                        a.last_login,
                        a.access_level,
                        a.created_by
                    FROM user_master a
                    WHERE a.is_deleted = 0
                ) AS a
                INNER JOIN access_level_master b ON a.access_level = b.id
                LEFT JOIN user_master c ON a.created_by = c.id
                ORDER BY a.latest_date DESC
                OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY;"""

        cursor.execute(query, (offset,))
        rows = cursor.fetchall()

        # Convert the result into a list of dictionaries for JSON serialization
        results = []
        columns = [column[0] for column in cursor.description]

        for row in rows:
            results.append(dict(zip(columns, row)))

        return jsonify(results)

    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run()
    
