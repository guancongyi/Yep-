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
    fkIndexData = OrderedDict()
    for table in c1:
        c2 = mydb.cursor(buffered=True)
        c2.execute("SELECT * FROM "+table[0])
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

        # send2FirebaseInBatches(table[0], res)
        createIndexTable(table[0], res, indexData, fkIndexData)
        print(1)
    # send2FirebaseInBatches(dbName+'_index', indexData, 5)
    if len(fkIndexData) != 0: send2FirebaseInBatches(dbName+'_fk_index', fkIndexData, 10)
    print(1)

def createIndexTable(name, data, res, fk_res):
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
    
    elif name == 'yelp_business':
        for i in range(1, len(data)+1):
            row = data[i]

            # fk is required
            id = row['business_id']
            if id in fk_res:
                fk_res[id] = fk_res[id].append([name, i , row, 'business_id'])
            else:
                fk_res[id] = [[name, i , row, 'business_id']]

            # collect index data
            for attr in ['name', 'address', 'city', 'state']:
                words = []
                if attr == 'address':
                    words = [item for item in parseAddr(row[attr])]
                else: 
                    words = formatString(row[attr])

                for word in words:
                    if word == '' or len(word) == 1 or word == ' ' or word == 'NULL': continue
                    word = word.lower()
                    if word in res: 
                        res[word].append([name, i , row, attr])
                    else:
                        res[word] = [[name, i , row, attr]]

    elif name == 'yelp_user':
        pass
    elif name == 'yelp_tip':
        pass

def formatString(s):
    return re.sub("([^\w]|[\d_])+", " ",  s).split()

def parseAddr(s):
    items = usaddress.parse(s)
    res = []
    for item in items:
        if item[1] == 'StreetName' or item[1] == 'BuildingName' or item[1] == 'LandMarkName' \
            or item[1] == 'PlaceName' or item[1] == 'StateName':
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
            result = requests.put(baseUrl+nname+'.json', sent)
        else:
            result = requests.patch(baseUrl+nname + '.json', sent)
        print("Sent No. {} Response {}".format(i, result.status_code))

    print('Finished sending total {} to {}'.format(total, nname))


main()
