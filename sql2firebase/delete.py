import requests

baseUrl = "https://inf551-d972f.firebaseio.com/"



result = requests.delete(baseUrl+'yelp_user'+'.json')
print(result)