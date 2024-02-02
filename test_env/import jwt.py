import jwt

SECRET_KEY = 'f9433dd1aa5cac3c92caf83680a6c0623979bfb20c14a78dc8f9e2a97dfd1b4e'

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImFjY2Vzc19sZXZlbCI6ImFkbWluIiwiZXhwIjoxNzA2ODU2Mzc3fQ.5lbwKenmFxCAOJr1L_ymgLX-nd_EKG38Vf_V1Tw7YLg'
decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
print(decoded)


# SECRET_KEY = 'f9433dd1aa5cac3c92caf83680a6c0623979bfb20c14a78dc8f9e2a97dfd1b4e'
# access_token = jwt.encode({'user':'123'}, SECRET_KEY)

# print(access_token)
# print(decoded)