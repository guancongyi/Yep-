import mysql.connector as mysql
from collections import OrderedDict
import usaddress
import requests
import json
import math
import copy
import sys
import re


args = sys.argv
args.pop(0)
dbName = args[0]
fireBaseName = args[1]
baseUrl = "https://inf551-d972f.firebaseio.com/"

mydb = mysql.connect(
    host="localhost",
    user="root",
    passwd="Apply2015!",
    database=dbName
)


def main():
    SQL2Firebase(mydb)


def SQL2Firebase(db):
    c1 = db.cursor(buffered=True)
    c1.execute("SHOW TABLES")

    indexData = OrderedDict()
    bidIndex = OrderedDict()
    uidIndex = OrderedDict()

    tables = []
    if dbName == 'yelp': tables = ['yelp_business', 'yelp_user', 'yelp_tip']
    else: tables = [table[0] for table in c1]

    for table in tables:
        c2 = mydb.cursor(buffered=True)
        c2.execute("SELECT * FROM "+table)
        res = OrderedDict()

        # setup a template : row : { attr1: val2, attr2: val2, ...}
        attrs = [attr[0] for attr in c2.description]

        # fill in row data
        id = 1
        for row in c2.fetchall():
            cellData = [str(cell) for cell in row]
            rowDict = OrderedDict(zip(attrs, cellData))
            res[id] = rowDict
            id += 1

        # if table != 'yelp_tip': send2FirebaseInBatches(table, res)
        print('1')
        if dbName == 'world': createWorldIndexTable(table, res, indexData)
        elif dbName == 'yelp': createYelpIndexTable(table, res, indexData, bidIndex, uidIndex)
    send2FirebaseInBatches(dbName+'_index', indexData, 400)
    # if len(uidIndex) > 0: send2FirebaseInBatches(dbName+'_uid_index', uidIndex, 60)
    # if len(bidIndex) > 0: send2FirebaseInBatches(dbName+'_bid_index', bidIndex, 60)
    print(1)

def createYelpIndexTable(name, data, res, bid, uid):
    if name == 'yelp_business':
        # categoryIndex = OrderedDict({
        #     'Active Life':[],
        #     'Arts & Entertainment':[]
        # })

        for i in range(1, len(data)+1):
            row = data[i]

            # fk is required
            id = row['business_id']
            if id in bid:
                bid[id] = bid[id].append([name, i , row, 'business_id'])
            else:
                bid[id] = [[name, i , row, 'business_id']]
            
            # collect index data
            for attr in ['name', 'address', 'city', 'state', 'categories']:
                words = []
                if attr == 'address':
                    words = [item for item in parseAddr(row[attr])]
                else: 
                    words = formatString(row[attr])
                
                if attr == 'categories' : continue
                # if attr == 'categories':
                #     cateList = row[attr].split(';')
                #     for category in cateList:
                #         if category in categoryIndex:
                #             categoryIndex[category].append(row)

                for word in words:
                    if word == '' or len(word) == 1 or word == ' ' or word == 'NULL': continue
                    word = word.lower()
                    if word in res: 
                        res[word].append([name, i , row, attr])
                    else:
                        res[word] = [[name, i , row, attr]]

    elif name == 'yelp_user':
        for i in range(1, len(data)+1):
            row = data[i]

            # fk is required
            id = row['user_id']
            if id in uid:
                uid[id] = uid[id].append([name, i , row, 'user_id'])
            else:
                uid[id] = [[name, i , row, 'user_id']]
            

            # collect index data
            for attr in ['name']:
                words = formatString(row[attr])
                for word in words:
                    if word == '' or len(word) == 1 or word == ' ' or word == 'NULL': continue
                    word = word.lower()
                    if word in res: 
                        res[word].append([name, i , row, attr])
                    else:
                        res[word] = [[name, i , row, attr]]

    elif name == 'yelp_tip':
        for i in range(1, len(data)+1):
            row = data[i]
            user_id = row['user_id']
            business_id = row['business_id']
            if user_id in uid: 
                uid[user_id].append([name, i, row, 'user_id'])
            if business_id in bid: 
                bid[business_id].append([name, i, row, 'business_id'])




def createWorldIndexTable(name, data, res):
    # print(data)
    if name == 'city':
        for i in range(1, len(data)+1):
            row = data[i]
            for attr in ['Name', 'CountryCode', 'District']:
                for word in formatString(row[attr]):
                    if word == '' or len(word) == 1 or word == ' ' or word == 'NULL': continue
                    word = word.lower()
                    if word in res: 
                        res[word].append([name, i , row, attr])
                    else:
                        res[word] = [[name, i , row, attr]]

    elif name == 'country2':
        for i in range(1, len(data)+1):
            row = data[i]
            for attr in ['Code', 'Name', 'Continent', 'Region', 'LocalName', 'GovernmentForm','HeadOfState', 'Code2']:
                for word in formatString(row[attr]):
                    if word == '' or len(word) == 1 or word == ' ' or word == 'NULL': continue
                    word = word.lower()
                    if word in res: 
                        res[word].append([name, i , row, attr])
                    else:
                        res[word] = [[name, i , row, attr]]
        
    elif name == 'countrylanguage':
        for i in range(1, len(data)+1):
            row = data[i]
            for attr in ['CountryCode', 'Language']:
                for word in formatString(row[attr]):
                    if word == '' or len(word) == 1 or word == ' ' or word == 'NULL': continue
                    word = word.lower()
                    if word in res: 
                        res[word].append([name, i , row, attr])
                    else:
                        res[word] = [[name, i , row, attr]]
    
def formatString(s):
    return re.sub("([^\w]|[\d_])+", " ",  s).split()

def parseAddr(s):
    items = usaddress.parse(s)
    res = []
    for item in items:
        if item[1] == 'StreetName' or item[1] == 'BuildingName' or item[1] == 'LandMarkName' \
            or item[1] == 'PlaceName':
            res.append(item[0])
    
    return res

def send2FirebaseInBatches(nname, data, batch=1):
    print('*********************Start Sending {}************************'.format(nname))
    total = len(data)
    eachBatch = math.floor(total/batch)

    last = 0
    for i in range(0, batch):
        d = dict(list(data.items())[last:last+eachBatch])
        last = last+eachBatch
        sent = json.dumps(d)

        result = None
        if i == 0:
            result = requests.patch(baseUrl+nname+'.json', sent)
        else:
            result = requests.patch(baseUrl+nname + '.json', sent)
        print("Sent No. {} Response {}".format(i, result.status_code))

    print('Finished sending total {} to {}'.format(total, nname))


main()
