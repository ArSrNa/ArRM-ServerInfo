const path = require('path');
const express = require('express');
const app = express();
const osu = require('node-os-utils');
const os = require('os');
const diskinfo = require('diskinfo');
const fs = require('fs');

function flatObj(o) {
  if (typeof o !== 'object') throw new Error(`TypeError: need a object type but get a ${typeof o}`)

  const res = {}
  const flat = (obj, preKey = '') => {
      Object.entries(obj).forEach(([key, value]) => {
          // preKey默认是'', 如果是递归入口 preKey有值 需要加 . 或者 [] 分割
          let newKey = key
          if (preKey) {
              newKey = `${preKey}${ Array.isArray(obj) ? `[${newKey}]` : `.${newKey}` }`
          }

         // 引用类型继续递归拍平, 基本类型设置到结果对象上
          if (value && typeof value === 'object') {
              return flat(value, newKey)
          }
          res[newKey] = value
      })
  }

  flat(o)
  return res
}

app.get('/getInfo/cpu',function(req,res){
  var a=os.cpus()
  var cpurR=[];
  for(var i=0;i<a.length;i++){
      cpurR.push(flatObj(a[i]))
  }
  res.send(cpurR)
  })
  //CPU数量及型号只获取一次即可，不需要计时器
  

  app.get('/getInfo/cpuUsage',function(req,res){ 
     //console.log('Ar-Sr-NaNF:CPUUsage_'+info);
      osu.cpu.usage().then(info => {
        res.send(Array({value:info}))
          //console.log(info)
      });
  })
  //CPU占用，2s以上获取一次
  
  
diskinfo.getDrives(function(err, drives) {
  app.get('/getInfo/disk',function(req,res){
          res.send(drives)
    })
  })//磁盘使用情况，建议10s以上获取一次

  
  app.get('/getInfo/mem',function(req,res){
      osu.mem.info().then(info=>{
          res.send(Array(info))
      })
})//内存使用情况，建议2s以上获取一次

app.listen(3001)
console.log('Powered by Ar-Sr-Na; Listen in port 3001')