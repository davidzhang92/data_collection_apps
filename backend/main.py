from flask import Flask
from auto_complete import get_auto_complete_part_no, get_auto_complete_part_name
from get_crud import get_data
from update_crud import update_data
from post_crud import post_data
from delete_crud import delete_data
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# API endpoint using the post_data function
@app.route('/api/post_data_api', methods=['POST'])
def post_data_api():
    return post_data()

# API endpoint using the get_data function
@app.route('/api/get_data_api', methods=['GET'])
def get_data_api():
    return get_data()

# API endpoint using the update_data function
@app.route('/api/update_data_api', methods=['PATCH'])
def update_data_api():
    return update_data()

# API endpoint using the delete_data function
@app.route('/api/delete_data_api', methods=['DELETE'])
def delete_data__api():
    return delete_data()



# API endpoint using the get_auto_complete_part_no function
@app.route('/api/auto_complete_part_no_api', methods=['GET'])
def get_auto_complete_part_no_api():
    return get_auto_complete_part_no()

# API endpoint using the get_auto_complete_part_name function
@app.route('/api/auto_complete_part_name_api', methods=['GET'])
def get_auto_complete_part_name_api():
    return get_auto_complete_part_name()








if __name__ == "__main__":
    app.run(debug=True)
