from flask import Flask
from auto_complete_part import get_auto_complete_part_no, get_auto_complete_part_name
from auto_complete_filter_part import get_auto_complete_filter_part_no, get_auto_complete_filter_part_name_for_part_no, get_auto_complete_filter_part_name, get_auto_complete_filter_part_no_for_part_name, get_filter_search_part_master
from get_part import get_part
from update_part import update_part
from post_part import post_part
from delete_part import delete_part
from get_pagination_part_entries import get_pagination_part_entries
from post_defect import post_defect
from get_defect import get_defect
from update_defect import update_defect
from delete_defect import delete_defect
from auto_complete_filter_defect import get_auto_complete_filter_defect_no, get_auto_complete_filter_defect_name_for_defect_no, get_auto_complete_filter_defect_name, get_auto_complete_filter_defect_no_for_defect_name, get_filter_search_defect_master
from get_pagination_defect_entries import get_pagination_defect_entries
from auto_complete_defect import get_auto_complete_defect_no, get_auto_complete_defect_name
from post_programming_result_entry import post_programming_result_entry
from get_pagination_programming_result_entry_count import get_pagination_programming_result_entry_count
from get_programming_result_entry_view import get_filter_search_programming_result_entry_view, get_programming_result_entry_view
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


###########################################
#####entry-page-autocomplete-section#######
###########################################



# API endpoint using the get_auto_complete_part_no function
@app.route('/api/auto_complete_part_no_api', methods=['GET'])
def get_auto_complete_part_no_api():
    return get_auto_complete_part_no()

# API endpoint using the get_auto_complete_part_name function
@app.route('/api/auto_complete_part_name_api', methods=['GET'])
def get_auto_complete_part_name_api():
    return get_auto_complete_part_name()

# API endpoint using the get_auto_complete_defect_no function
@app.route('/api/auto_complete_defect_no_api', methods=['GET'])
def get_auto_complete_defect_no_api():
    return get_auto_complete_defect_no()

# API endpoint using the get_auto_complete_defect_name function
@app.route('/api/auto_complete_defect_name_api', methods=['GET'])
def get_auto_complete_defect_name_api():
    return get_auto_complete_defect_name()




###############################
#####part-master section#######
###############################

# API endpoint using the post_data function
@app.route('/api/post_part_api', methods=['POST'])
def post_part_api():
    return post_part()

# API endpoint using the get_data function
@app.route('/api/get_part_api', methods=['GET'])
def get_part_api():
    return get_part()

# API endpoint using the update_data function
@app.route('/api/update_part_api', methods=['PATCH'])
def update_part_api():
    return update_part()

# API endpoint using the delete_data function
@app.route('/api/delete_part_api', methods=['DELETE'])
def delete_part_api():
    return delete_part()


# --------------------------------
# filtering part autocomplete section
# --------------------------------
# API endpoint search part_name with given part_no
@app.route('/api/auto_complete_filter_part_no_api', methods=['GET'])
def get_auto_complete_filter_part_no_api():
    return get_auto_complete_filter_part_no()

@app.route('/api/auto_complete_filter_part_name_for_part_no_api', methods=['GET'])
def get_auto_complete_filter_part_name_for_part_no_api():
    return get_auto_complete_filter_part_name_for_part_no()

# API endpoint search part_no with given part_name
@app.route('/api/auto_complete_filter_part_name_api', methods=['GET'])
def get_auto_complete_filter_part_name_api():
    return get_auto_complete_filter_part_name()

@app.route('/api/auto_complete_filter_part_no_for_part_name_api', methods=['GET'])
def get_auto_complete_filter_part_no_for_part_name_api():
    return get_auto_complete_filter_part_no_for_part_name()


# API endpoint search filtering based on part number on part description
@app.route('/api/filter_search_part_master_api', methods=['GET'])
def get_filter_search_part_master_api():
    return get_filter_search_part_master()

# --------------------------------
# pagination section
# --------------------------------

#API endpoint to retrieve number of entries on part master
@app.route('/api/pagination_part_entries_api', methods=['GET'])
def get_pagination_part_entries_api():
    return get_pagination_part_entries()




###############################
#####defect-master section#######
###############################

# # API endpoint using the post_data function
@app.route('/api/post_defect_api', methods=['POST'])
def post_defect_api():
    return post_defect()

# # API endpoint using the get_data function
@app.route('/api/get_defect_api', methods=['GET'])
def get_defect_api():
    return get_defect()

# # API endpoint using the update_data function
@app.route('/api/update_defect_api', methods=['PATCH'])
def update_defect_api():
    return update_defect()

# # API endpoint using the delete_data function
@app.route('/api/delete_defect_api', methods=['DELETE'])
def delete_defect_api():
    return delete_defect()


# --------------------------------
# filtering defect autocomplete section
# --------------------------------
# API endpoint search defect_name with given defect_no
@app.route('/api/auto_complete_filter_defect_no_api', methods=['GET'])
def get_auto_complete_filter_defect_no_api():
    return get_auto_complete_filter_defect_no()

@app.route('/api/auto_complete_filter_defect_name_for_defect_no_api', methods=['GET'])
def get_auto_complete_filter_defect_name_for_defect_no_api():
    return get_auto_complete_filter_defect_name_for_defect_no()

# API endpoint search defect_no with given defect_name
@app.route('/api/auto_complete_filter_defect_name_api', methods=['GET'])
def get_auto_complete_filter_defect_name_api():
    return get_auto_complete_filter_defect_name()

@app.route('/api/auto_complete_filter_defect_no_for_defect_name_api', methods=['GET'])
def get_auto_complete_filter_defect_no_for_defect_name_api():
    return get_auto_complete_filter_defect_no_for_defect_name()


# API endpoint search filtering based on defect number on defect description
@app.route('/api/filter_search_defect_master_api', methods=['GET'])
def get_filter_search_defect_master_api():
    return get_filter_search_defect_master()

# --------------------------------
# pagination section
# --------------------------------

#API endpoint to retrieve number of entries on defect master
@app.route('/api/pagination_defect_entries_api', methods=['GET'])
def get_pagination_defect_entries_api():
    return get_pagination_defect_entries()


###############################
#####programming-result-entry-section#######
###############################

# --------------------------------
# programming-result-entry-POST
# --------------------------------

# # API endpoint using the post_data function
@app.route('/api/post-programming-result-entry-api', methods=['POST'])
def post_programming_result_entry_api():
    return post_programming_result_entry()

###############################
#####view-programming-result-entry-section#######
###############################

# --------------------------------
# view-result-programming-entry-POST
# --------------------------------

#API endpoint to retrieve number of entries on result-programming-entry
@app.route('/api/pagination_programming_result_entry_count_api', methods=['GET'])
def get_pagination_programming_result_entry_count_api():
    return get_pagination_programming_result_entry_count()

# # API endpoint using the get_filter_search_programming_result_entry function
@app.route('/api/filter_search_programming_result_entry_view_api', methods=['GET'])
def get_filter_search_programming_result_entry_view_api():
    return get_filter_search_programming_result_entry_view()

# # API endpoint using the get_programming_result_entry_view function
@app.route('/api/programming_result_entry_view_api', methods=['GET'])
def get_programming_result_entry_view_api():
    return get_programming_result_entry_view()

if __name__ == "__main__":
    app.run(debug=True)
