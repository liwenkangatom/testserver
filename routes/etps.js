var express = require('express')
var router = express.Router()
var Mock = require('mockjs')
const EVENT = 'EVENT'
const TAG = 'TAG'
const TAG_EVENT = 'TAG_EVENT'

let {writeJson, deleteJson, changeJson} = require('./dao')
deleteJson(2,TAG)
// function rangeDate(min,max) {
//     var min = min,
//       max = max,
//       days = (new Date(max) - new Date(min))/1000/60/60/24,
//       i = 0,
//       len = Math.floor(days),
//       dates = [];

//     for(;i<len;i++){
//       dates.push(format(new Date(min).getTime()+1000*60*60*24*i));
//     } 
//     return  dates; 
//   }

// function format(date) {
//   var dateString = new Date(date),
//       month = (dateString.getMonth()+1)<10 ? '0'+(dateString.getMonth()+1): (dateString.getMonth()+1),
//       day = dateString.getDate()<10 ? '0'+dateString.getDate() : dateString.getDate();
//   return dateString.getFullYear()+'-'+month+'-'+day
//   }

function getItem(arr,obj) {
    console.log(obj)
    arrFor: for (var i = 0; i < arr.length; i++) {
        for (var n in obj)
            if (arr[i][n]!=obj[n])
                continue arrFor
       return arr[i]
    }
}
function getItems(arr,obj) {
    let result = []
    arrFor: for (var i = 0; i < arr.length; i++) {
        for (var n in obj)
            if (arr[i][n]!=obj[n])
                continue arrFor
        result.push(arr[i])
        continue arrFor 
    }
    return result
}
var tagsdata = Mock.mock({
    'list|10': [{
        'pKey|+1': 1,
        'Name': '@string(7, 10)',
        'tag_parents': '@natural(1, 10)'
    }]
})
console.log(tagsdata)
var eventsdata = Mock.mock({
    'list|100': [{
        'pKey|+1': 1,
        'Subject': '@string(10,20)',
        'DateTime|+1': '@datetime("yyyy-MM-dd A HH:mm:ss")',
        'Content': '@string(15,25)'
    }]
})
var eventstagsdata = Mock.mock({
    'list|80-100': [{
        'pKey|+1': 1,
        'tagkey|1-10': 10,
        'eventkey|1-100': 100
    }]
})
function gettagsall() {
    return tagsdata
}
function geteventsall() {
    return eventsdata
}
function gettageventsall() {
    return eventstagsdata
}
function gettagsbyid(pkey) {
    return getItem(tagsdata.list,{'pKey': pkey})
}
function geteventsbyid(pkey) {
    return getItem(eventsdata.list, {'pKey': pkey})
}
function geteventsbytag(tagpkey) {
    return getItems(eventstagsdata.list, {'tagkey': tagpkey})
}
function gettagbyevents(evenkey) {
    return getItems(eventstagsdata.list, {'eventkey': evenkey})
}
router.get('/test',function(req, res, next) {
    res.send('hello etps!')
})
router.get('/tagsall', function(req, res, next) {

    res.send(gettagsall().list)
})
router.get('/eventsall', function(req, res, next) {
    res.send(geteventsall().list)
})
router.get('/tagseventsall', function(req, res, next) {
    res.send(gettageventsall().list)
})
// ?eid=
router.get('/tagsbyeid', function(req, res, next) {
    let result = []
    let key = req.param('eid')
    let tids = gettagbyevents(key)
    console.log(tids)
    for(let k in tids) result.push(gettagsbyid(tids[k].tagkey))
    res.send(result)
})
// ?tid=
router.get('/eventsbytid', function(req, res, next) {
    let result =[]
    let key = req.param('tid')
    let pids = geteventsbytag(key)
    console.log(pids)
    for(let k in pids) result.push(geteventsbyid(pids[k].eventkey))
    res.send(result)
})
module.exports = router