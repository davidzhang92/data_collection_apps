from flask import Flask, request, jsonify, make_response
import pyodbc
import re
import hashlib
import jwt
from datetime import datetime, timedelta, timezone
import pytz


SECRET_KEY = 'f9433dd1aa5cac3c92caf83680a6c0623979bfb20c14a78dc8f9e2a97dfd1b4e'

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImFjY2Vzc19sZXZlbCI6ImFkbWluIiwiZXhwIjoxNzA3MTkyNzM1fQ.kJIQfDtvAGBsoBFX9SMMrnjrjE1IAhTdld1yqfI-6F0'
decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'], options={'verify_exp': False})

print('user:', decoded.get('user'))
print('exp:', decoded.get('exp'))
print('access_level:', decoded.get('access_level'))


exp = datetime.fromtimestamp(decoded.get('exp'))

print('time from token :', exp)
print('current time :', datetime.utcnow().replace(tzinfo=pytz.UTC).astimezone(pytz.timezone('Asia/Jakarta')))
