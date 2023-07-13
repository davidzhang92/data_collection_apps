from flask import Flask, jsonify, request
import pyodbc

app = Flask(__name__)

# Replace the following values with your database credentials
db_config = {
    'Driver': 'SQL Server',
    'Server': '192.168.100.90',
    'Database': 'DataCollection',
    'UID': 'sa',
    'PWD': 'Cannon45!'
}

@app.route('/api/data', methods=['GET'])
def get_data():
    connection = None
    cursor = None

    try:
        term = request.args.get('term')  # Get the 'term' value from the request query parameters

        connection = pyodbc.connect(**db_config)
        cursor = connection.cursor()
        query = "SELECT * FROM product_master WHERE model_part_no LIKE ?"  # Modify the query to filter based on the term
        cursor.execute(query, ('%' + term + '%',))  # Pass the term value to the query with wildcard characters
        data = cursor.fetchall()

        # Convert the fetched data to a JSON response
        response = []
        for row in data:
            item = {
                'model_name': row.model_name,  # Assuming the column names are 'model_name' and 'model_part_no'
                'model_part_no': row.model_part_no,
                # Add more columns as needed
            }
            response.append(item)

        return jsonify(response)

    except Exception as e:
        # Handle any exceptions that occur during the database operation
        return jsonify({'error': str(e)})

    finally:
        # Close the database connection and cursor
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run()
