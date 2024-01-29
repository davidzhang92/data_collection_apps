import jwt

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImV4cCI6MTcwNjUyMzQxN30.JNtn7uhTnepB62DpOnYGCjd5B6joH9nNxiH4MOvqzpk'
decoded = jwt.decode(token, options={"verify_signature": False})
print(decoded)


# SECRET_KEY = 'f9433dd1aa5cac3c92caf83680a6c0623979bfb20c14a78dc8f9e2a97dfd1b4e'
# access_token = jwt.encode({'user':'123'}, SECRET_KEY)

# print(access_token)
# print(decoded)