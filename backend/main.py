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
from post_user import post_user
from get_user import get_user
from update_user import update_user, update_user_password
from delete_user import delete_user
from post_user_authentication import post_user_authentication
from get_pagination_user_entries import get_pagination_user_entries
from auto_complete_filter_user import get_auto_complete_filter_user_name, get_filter_search_user_master
from auto_complete_filter_defect import get_auto_complete_filter_defect_no, get_auto_complete_filter_defect_name_for_defect_no, get_auto_complete_filter_defect_name, get_auto_complete_filter_defect_no_for_defect_name, get_filter_search_defect_master
from get_pagination_defect_entries import get_pagination_defect_entries
from auto_complete_defect import get_auto_complete_defect_no, get_auto_complete_defect_name
from post_programming_result_entry import post_programming_result_entry
from get_pagination_programming_result_entry_count import get_pagination_programming_result_entry_count
from get_programming_result_entry_view import get_filter_search_programming_result_entry_view, get_programming_result_entry_view, get_programming_result_report
from delete_programming_result_entry_view import delete_programming_result_entry_view
from post_leaktest_result_entry import post_leaktest_result_entry
from get_pagination_leaktest_result_entry_count import get_pagination_leaktest_result_entry_count
from get_leaktest_result_entry_view import get_filter_search_leaktest_result_entry_view, get_leaktest_result_entry_view, get_leaktest_result_report
from delete_leaktest_result_entry_view import delete_leaktest_result_entry_view
from post_laser_result_entry import post_laser_result_entry
from get_laser_result_entry_view import get_laser_result_entry_view, get_filter_search_laser_result_entry_view, get_laser_result_report
from get_pagination_laser_result_entry_count import get_pagination_laser_result_entry_count
from delete_laser_result_entry_view import delete_laser_result_entry_view
from post_oqc_result_entry import post_oqc_result_entry
from get_oqc_result_entry_view import get_oqc_result_entry_view, get_filter_search_oqc_result_entry_view, get_oqc_result_report
from get_pagination_oqc_result_entry_count import get_pagination_oqc_result_entry_count
from delete_oqc_result_entry_view import delete_oqc_result_entry_view
from post_endtest_result_entry import post_endtest_upload_file
from get_pagination_endtest_result_entry_count import get_pagination_endtest_result_entry_count
from get_endtest_result_entry_view import get_endtest_result_entry_view, get_filter_search_endtest_result_entry_view, get_endtest_result_report
# from delete_endtest_result_entry_view import delete_endtest_result_entry_view
from get_laser_result_entry import get_laser_result_entry
from get_overall_throughput import get_overall_throughput
from get_donut_1_chart_throughput import get_donut_1, get_donut_1_details
from get_donut_2_chart_throughput import get_donut_2, get_donut_2_details
from get_donut_3_chart_throughput import get_donut_3, get_donut_3_details
from get_donut_4_chart_throughput import get_donut_4, get_donut_4_details
from get_donut_5_chart_throughput import get_donut_5, get_donut_5_details
from post_refresh_token import refresh_token
from flask_cors import CORS
from waitress import serve

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
#####user-master section#######
###############################

# API endpoint using the post_data function
@app.route('/api/post_user_api', methods=['POST'])
def post_user_api():
    return post_user()

# API endpoint using the get_data function
@app.route('/api/get_user_api', methods=['GET'])
def get_user_api():
    return get_user()

# API endpoint using the update_data function
@app.route('/api/update_user_password_api', methods=['PATCH'])
def update_user_password_api():
    return update_user_password()

# API endpoint using the update_data function
@app.route('/api/update_user_api', methods=['PATCH'])
def update_user_api():
    return update_user()

# API endpoint using the delete_data function
@app.route('/api/delete_user_api', methods=['DELETE'])
def delete_user_api():
    return delete_user()

# --------------------------------
# authentication user section
# --------------------------------
# API endpoint to authenticate credential

@app.route('/api/user_authentication_api', methods=['POST'])
def post_user_authentication_api():
    return post_user_authentication()


# --------------------------------
# filtering user autocomplete section
# --------------------------------
# API endpoint search username
@app.route('/api/auto_complete_filter_user_name_api', methods=['GET'])
def get_auto_complete_filter_user_name_api():
    return get_auto_complete_filter_user_name()

@app.route('/api/filter_search_user_master_api', methods=['GET'])
def get_filter_search_user_master_api():
    return get_filter_search_user_master()


# --------------------------------
# pagination section
# --------------------------------

#API endpoint to retrieve number of entries on user master
@app.route('/api/pagination_user_entries_api', methods=['GET'])
def get_pagination_user_entries_api():
    return get_pagination_user_entries()


###############################
#####programming-result-entry-section#######
###############################

# --------------------------------
# programming-result-entry-POST
# --------------------------------

# API endpoint using the post_data function
@app.route('/api/post-programming-result-entry-api', methods=['POST'])
def post_programming_result_entry_api():
    return post_programming_result_entry()

###############################
#####view-programming-result-entry-section#######
###############################

# API endpoint to retrieve number of entries on result-programming-entry
@app.route('/api/pagination_programming_result_entry_count_api', methods=['GET'])
def get_pagination_programming_result_entry_count_api():
    return get_pagination_programming_result_entry_count()

# API endpoint using the get_filter_search_programming_result_entry function
@app.route('/api/filter_search_programming_result_entry_view_api', methods=['GET'])
def get_filter_search_programming_result_entry_view_api():
    return get_filter_search_programming_result_entry_view()

# API endpoint using the delete_data function
@app.route('/api/delete_programming_result_entry_view_api', methods=['DELETE'])
def delete_programming_result_entry_view_api():
    return delete_programming_result_entry_view()

# # API endpoint using the get_programming_result_entry_view function
@app.route('/api/programming_result_entry_view_api', methods=['GET'])
def get_programming_result_entry_view_api():
    return get_programming_result_entry_view()

# # API endpoint to download report from programming result entry view
@app.route('/api/programming_result_report_api', methods=['POST'])
def get_programming_result_report_api():
    return get_programming_result_report()



###############################
#####leaktest-result-entry-section#######
###############################

# --------------------------------
# leaktest-result-entry-POST
# --------------------------------

# API endpoint using the post_data function
@app.route('/api/leaktest-result-entry-api', methods=['POST'])
def post_leaktest_result_entry_api():
    return post_leaktest_result_entry()

###############################
#####view-leaktest-result-entry-section#######
###############################

# API endpoint to retrieve number of entries on result-leaktest-entry
@app.route('/api/pagination_leaktest_result_entry_count_api', methods=['GET'])
def get_pagination_leaktest_result_entry_count_api():
    return get_pagination_leaktest_result_entry_count()

# API endpoint using the get_filter_search_leaktest_result_entry function
@app.route('/api/filter_search_leaktest_result_entry_view_api', methods=['GET'])
def get_filter_search_leaktest_result_entry_view_api():
    return get_filter_search_leaktest_result_entry_view()

# API endpoint using the get_leaktest_result_entry_view function
@app.route('/api/leaktest_result_entry_view_api', methods=['GET'])
def get_leaktest_result_entry_view_api():
    return get_leaktest_result_entry_view()

# API endpoint using the delete_data function
@app.route('/api/delete_leaktest_result_entry_view_api', methods=['DELETE'])
def delete_leaktest_result_entry_view_api():
    return delete_leaktest_result_entry_view()

# # API endpoint to download report from leaktest result entry view
@app.route('/api/leaktest_result_report_api', methods=['POST'])
def get_leaktest_result_report_api():
    return get_leaktest_result_report()

###############################
#####laser-result-entry-section#######
###############################

# --------------------------------
# laser-result-entry-POST
# --------------------------------

# API endpoint using the post_data function

@app.route('/api/laser-result-entry-api', methods=['POST'])
def post_laser_result_entry_api():
    return post_laser_result_entry()

# API endpoint to retrieve number of entries on result-laser-entry
@app.route('/api/pagination_laser_result_entry_count_api', methods=['GET'])
def get_pagination_laser_result_entry_count_api():
    return get_pagination_laser_result_entry_count()

# API endpoint using the get_filter_search_laser_result_entry function
@app.route('/api/filter_search_laser_result_entry_view_api', methods=['GET'])
def get_filter_search_laser_result_entry_view_api():
    return get_filter_search_laser_result_entry_view()

# API endpoint using the get_laser_result_entry_view function
@app.route('/api/laser_result_entry_view_api', methods=['GET'])
def get_laser_result_entry_view_api():
    return get_laser_result_entry_view()

# API endpoint using the delete_data function
@app.route('/api/delete_laser_result_entry_view_api', methods=['DELETE'])
def delete_laser_result_entry_view_api():
    return delete_laser_result_entry_view()

# API endpoint using the get_laser_result_entry function for upload excel
@app.route('/api/laser_result_entry_api', methods=['POST'])
def get_laser_result_entry_api():
    return get_laser_result_entry()

# # API endpoint to download report from laser result entry view
@app.route('/api/laser_result_report_api', methods=['POST'])
def get_laser_result_report_api():
    return get_laser_result_report()

###############################POST
#####oqc-result-entry-section#######
###############################

# --------------------------------
# oqc-result-entry-POST
# --------------------------------

# API endpoint using the post_data function
@app.route('/api/oqc-result-entry-api', methods=['POST'])
def post_oqc_result_entry_api():
    return post_oqc_result_entry()

# API endpoint to retrieve number of entries on result-oqc-entry
@app.route('/api/pagination_oqc_result_entry_count_api', methods=['GET'])
def get_pagination_oqc_result_entry_count_api():
    return get_pagination_oqc_result_entry_count()

# API endpoint using the get_filter_search_oqc_result_entry function
@app.route('/api/filter_search_oqc_result_entry_view_api', methods=['GET'])
def get_filter_search_oqc_result_entry_view_api():
    return get_filter_search_oqc_result_entry_view()

# API endpoint using the get_oqc_result_entry_view function
@app.route('/api/oqc_result_entry_view_api', methods=['GET'])
def get_oqc_result_entry_view_api():
    return get_oqc_result_entry_view()

# API endpoint using the delete_data function
@app.route('/api/delete_oqc_result_entry_view_api', methods=['DELETE'])
def delete_oqc_result_entry_view_api():
    return delete_oqc_result_entry_view()

# API endpoint to download report from oqc result entry view
@app.route('/api/oqc_result_report_api', methods=['POST'])
def get_oqc_result_report_api():
    return get_oqc_result_report()

###############################
#####endtest-result-entry section#######
###############################

@app.route('/api/endtest_upload_file_api', methods=['POST'])
def post_endtest_upload_file_api():
    return post_endtest_upload_file()

# API endpoint to retrieve number of entries on result-endtest-entry
@app.route('/api/pagination_endtest_result_entry_count_api', methods=['GET'])
def get_pagination_endtest_result_entry_count_api():
    return get_pagination_endtest_result_entry_count()

# API endpoint using the get_filter_search_endtest_result_entry function
@app.route('/api/filter_search_endtest_result_entry_view_api', methods=['GET'])
def get_filter_search_endtest_result_entry_view_api():
    return get_filter_search_endtest_result_entry_view()

# API endpoint using the get_endtest_result_entry_view function
@app.route('/api/endtest_result_entry_view_api', methods=['GET'])
def get_endtest_result_entry_view_api():
    return get_endtest_result_entry_view()

# # API endpoint using the delete_data function
# @app.route('/api/delete_endtest_result_entry_view_api', methods=['DELETE'])
# def delete_endtest_result_entry_view_api():
#     return delete_endtest_result_entry_view()

# # API endpoint to download report from endtest result entry view
@app.route('/api/endtest_result_report_api', methods=['POST'])
def get_endtest_result_report_api():
    return get_endtest_result_report()



###############################
#####dashboard-charting-section#######
###############################

# --------------------------------
# graph-overall-throughput-GET
# --------------------------------

@app.route('/api/overall_throughput_api', methods=['GET'])
def get_overall_throughput_api():
    return get_overall_throughput()

# --------------------------------
# graph-donut-1-throughput-GET
# --------------------------------

@app.route('/api/donut_1_api', methods=['GET'])
def get_donut_1_api():
    return get_donut_1()

@app.route('/api/donut_1_details', methods=['GET'])
def get_donut_1_details_api():
    return get_donut_1_details()

# --------------------------------
# graph-donut-2-throughput-GET
# --------------------------------

@app.route('/api/donut_2_api', methods=['GET'])
def get_donut_2_api():
    return get_donut_2()

@app.route('/api/donut_2_details', methods=['GET'])
def get_donut_2_details_api():
    return get_donut_2_details()

# --------------------------------
# graph-donut-3-throughput-GET
# --------------------------------

@app.route('/api/donut_3_api', methods=['GET'])
def get_donut_3_api():
    return get_donut_3()

@app.route('/api/donut_3_details', methods=['GET'])
def get_donut_3_details_api():
    return get_donut_3_details()

# --------------------------------
# graph-donut-4-throughput-GET
# --------------------------------

@app.route('/api/donut_4_api', methods=['GET'])
def get_donut_4_api():
    return get_donut_4()

@app.route('/api/donut_4_details', methods=['GET'])
def get_donut_4_details_api():
    return get_donut_4_details()

# --------------------------------
# graph-donut-5-throughput-GET
# --------------------------------

@app.route('/api/donut_5_api', methods=['GET'])
def get_donut_5_api():
    return get_donut_5()

@app.route('/api/donut_5_details', methods=['GET'])
def get_donut_5_details_api():
    return get_donut_5_details()


# --------------------------------
# refresh token POST
# --------------------------------

@app.route('/api/refresh_token_api', methods=['POST'])
def refresh_token_api():
    return refresh_token()



if __name__ == "__main__":
    # built-in flask server for development
    app.run(debug=True, host='0.0.0.0', port=4000)
    #UAT / LIVE
    # serve(app, host='0.0.0.0', port=4000, threads=1024)
