var fs = require('fs');
let eventUrl = './events.json'
let tagUrl = './tags.json'
let tag_eventUrl = './tags-evets.json'

function getUrl(str) {
    switch(str){
        case 'EVENT':{
            return eventUrl
        }
        case 'TAG': {
            return tagUrl
        }
        case 'TAG_EVENT': {
            return tag_eventUrl
        }
    }
}
function selectJson(id, type){
    let url = getUrl(type)
    fs.readFile(url, function(err, data) {
        if(err) {
            return console.error(err)
        }
        let elem = data.toString()
        elem = JSON.parse(elem).data
        for(let k in elem){
            if(elem[k].pKey === id ){
                return elem[k]
            }
        }
    })
}
function selectJsonAll(type) {
    let url = getUrl(type)
    fs.readFile(url, function(err, data){
        if(err) {
            return console.error(err)
        }
        let elem = data.toString()
        return JSON.parse(elem).data
    })
}
function selectJsonTagEvent(Tagpkey){
    fs.readFile(tag_eventUrl, function(err, data) {
        if(err) {
            return  console.error(err)
        }
        let elem = data.toString()
        elem = JSON.parse(elem).data
        let tmp = []
        for(let k in elem) {
            if(elem[k].ms_TagpKey === Tagpkey){
                tmp.push(elem[k].ms_EventpKey)
            }
        }
        return tmp
    })
}
function writeJson(params, type){
    let url = getUrl(type)
    //现将json文件读出来
    fs.readFile(url,function(err,data){
        if(err){
            return console.error(err);
        }
        var elem = data.toString();
        elem = JSON.parse(elem);
        let id = ++elem.idTop
        params.pKey = id
        elem.data.push(params);
        elem.total = elem.data.length;
        console.log(elem.data);
        var str = JSON.stringify(elem);
        fs.writeFile(url, str, function(err){
            if(err){
                console.error(err);
                return false
            }
            console.log('----------新增成功-------------');
            return true
        })
    })
}
function deleteJson(id, type){
    let url = getUrl(type)
    fs.readFile(url, function(err,data){
        if(err){
            return console.error(err);
        }
        var elem = data.toString();
        elem = JSON.parse(elem);
        //把数据读出来删除
        for(var i = 0; i < elem.data.length;i++){
            if(id === elem.data[i].pKey){
                //console.log(elem.data[i])
                elem.data.splice(i,1);
            }
        }
        console.log(elem.data);
        elem.total = elem.data.length;
        var str = JSON.stringify(elem);
        //然后再把数据写进去
        fs.writeFile(url, str, function(err){
            if(err){
                console.error(err);
                return false
            }
            console.log("----------删除成功------------");
            return true
        })
    })
}
function deleteTag(id){
    fs.readFile('./tags.json', function(err,data){
        if(err){
            return console.error(err);
        }
        var elem = data.toString();
        elem = JSON.parse(elem);
        //把数据读出来删除
        let deletedparent = 0
        for(var i = 0; i < elem.data.length;i++){
            if(id == elem.data[i].pKey){
                //console.log(elem.data[i])
                deletedparent = elem.data[i].ms_Tag_Parent
                elem.data.splice(i,1);
            }
        }
        for(let k in elem.data) {
            if(id == elem.data[k].ms_Tag_Parent){
                elem.data[k].ms_Tag_Parent = deletedparent
            }
        }
        console.log(elem.data);
        elem.total = elem.data.length;
        var str = JSON.stringify(elem);
        //然后再把数据写进去
        fs.writeFile('./tags.json', str, function(err){
            if(err){
                console.error(err);
                return false
            }
            console.log("----------删除成功------------");
            return true
        })
    })

}
function changeJson(id, params, type){
    let url = getUrl(type)
    fs.readFile(url, function(err,data){
        if(err){
            console.error(err);
            return false
        }
        var elem = data.toString();
        elem = JSON.parse(elem);
        //把数据读出来,然后进行修改
        for(var i = 0; i < elem.data.length;i++){
            if(id == elem.data[i].pKey){
                console.log('id一样的');
                for(var key in params){
                    if(elem.data[i][key]){
                        console.log(elem.data[i][key])
                        elem.data[i][key] = params[key];
                    }
                }
            }
        }
        elem.total = elem.data.length;
        var str = JSON.stringify(elem);
        //console.log(str);
        fs.writeFile(url, str,function(err){
            if(err){
                console.error(err);
                return false
            }
            console.log('--------------------修改成功');
            console.log(elem.data);
            return true
        })
    })
}
// type EVENT TAG TAG_EVENT
module.exports =  {
    writeJson,
    deleteJson,
    changeJson,
    selectJson,
    selectJsonTagEvent,
    selectJsonAll,
    deleteTag
}