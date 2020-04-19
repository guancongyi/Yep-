import requests

baseUrl = "https://inf551-d972f.firebaseio.com/"



result = requests.delete(baseUrl+'yelp_index'+'.json')
print(result)