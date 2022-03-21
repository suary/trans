const uri = "mongodb+srv://admin:19930328@cluster0.gjhpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Koa = require('koa');
const Router = require('koa-router')()
const bodyp = require('koa-bodyparser')
const moment =require('moment')
const qiniu=require('qiniu')
const app = new Koa()
app.use(bodyp())
var accessKey = '6BHxvEIvhA9VXfx9-DqNMDWBSbmxKdKx0h7qIaa6';
var secretKey = 'RcLBliH8w5_MV6dgybycgKLkVtqkDZIlJdbXYAdY';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
    scope: 'yuehia-img',
    returnBody: '{"key":"http://r70p5fqkz.bkt.clouddn.com/$(key)","name":"$(x:name)"}'

  };
const { MongoClient,ObjectId } = require('mongodb');;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if (err) throw err;
    console.log("数据库已创建!");
    const collection = client.db("main").collection("expenditure");
    const chartCollection = client.db("main").collection("chart");
    // collection.deleteMany({})
    // chartCollection.deleteMany({})
    const timeTaskYear=(month)=>{
        chartCollection.find({year:moment(month).format('YYYY'),type:'month'}).toArray(async(err,res)=>{
            if (err) throw err;
            if (res.length) {
                const data={
                    income:0,
                    expenditure:0,
                    year:moment(month).format('YYYY'),
                    type:'year',
                    incomeCount:0,
                    expenditureCount:0
                }
                res.forEach(item=>{
                    data.income+=item.income
                    data.expenditure+=item.expenditure
                    data.incomeCount+=item.incomeCount
                    data.expenditureCount+=item.expenditureCount
                })
                const OLDDATA=await chartCollection.findOne({year:moment(month).format('YYYY'),type:'year'})
                if (OLDDATA) {
                    chartCollection.updateOne({year:moment(month).format('YYYY'),type:'year'},{$set:data})
                }else{
                    chartCollection.insertOne(data)
                }
            }
        })
    }

    const timeTaskMonth=(month)=>{
        chartCollection.find({month,type:'date'}).toArray(async(err,res)=>{
            if (err) throw err;
            if (res.length) {
                const data={
                    income:0,
                    expenditure:0,
                    month,
                    year:moment(month).format('YYYY'),
                    type:'month',
                    incomeCount:0,
                    expenditureCount:0
                }
                res.forEach(item=>{
                    data.income+=item.income
                    data.expenditure+=item.expenditure
                    data.incomeCount+=item.incomeCount
                    data.expenditureCount+=item.expenditureCount
                })
                const OLDDATA=await chartCollection.findOne({month,type:'month'})
                if (OLDDATA) {
                    await chartCollection.updateOne({month,type:'month'},{$set:data})
                    timeTaskYear(month)
                }else{
                    await chartCollection.insertOne(data)
                    timeTaskYear(month)
                }
            }
        })
    }


    const timeTaskDay=async(obj)=>{
        const day=moment(obj.date)
        const data={
            income:0,
            expenditure:0,
            month:day.format('YYYY-MM'),
            date:obj.date,
            type:'date',
            incomeCount:0,
            expenditureCount:0
        }
        const OLDDATA=await chartCollection.findOne({date:obj.date,type:'date'})
        if (OLDDATA) {
            if (obj.type==='income') {
                OLDDATA.income+=obj.totalfee
                OLDDATA.incomeCount++
            }else{
                OLDDATA.expenditure+=obj.totalfee
                OLDDATA.expenditureCount++
            }
            await chartCollection.updateOne({date:obj.date,type:'date'},{$set:OLDDATA})
            timeTaskMonth(OLDDATA.month)
        }else{
            if (obj.type==='income') {
                data.income+=obj.totalfee
                data.incomeCount++
            }else{
                data.expenditure+=obj.totalfee
                data.expenditureCount++
            }
            await chartCollection.insertOne(data)
            timeTaskMonth(data.month)
        }
    }

    Router.get('/', (ctx, next) => {
        ctx.body = 'Hello koa';
    });

    Router.post('/expenditureSubmit', async (ctx) => {
        let c = ctx.request.body;
        c.type='expenditure'
        c.month=moment(c.date).format('YYYY-MM')
        c.totalfee=Number(c.fee)
        c.checked=false
        const res = await new Promise(resolve => {
            collection.insertOne(c, (err, res) => {
                if (err) throw err;
                resolve(res)
                // timeTaskDay(c)
            })
        })
        ctx.body = res
    })
    Router.post('/check',async(ctx)=>{
        let c=ctx.request.body
        const {id}=c
        await collection.updateOne({_id:ObjectId(id)},{$set:{checked:true}})
        const data=await collection.findOne({_id:ObjectId(id)})
        timeTaskDay(data)
        ctx.body=data

    })
    Router.post('/incomeSubmit', async (ctx) => {
        let c = ctx.request.body;
        const {fee=0,zcfee=0,infofee=0,otherfee=0,servicefee=0}=c
        c.type='income'
        c.totalfee=fee-zcfee-infofee-otherfee-servicefee
        c.month=moment(c.date).format('YYYY-MM')
        c.checked=false
        const res = await new Promise(resolve => {
            collection.insertOne(c, (err, res) => {
                if (err) throw err;
                resolve(res)
                // timeTaskDay(c)
            })
        })
        ctx.body = res
    })

    Router.get('/list/:month/:skip', async (ctx) => {
        let {month,skip}= ctx.params;
        const res = await new Promise(resolve => {
            collection.find({month}).sort({date:-1}).skip(Number(skip)).limit(10).toArray((err,res)=>{
                if (err) throw err;
                resolve(res)
            })
        })
        ctx.body = res
    })

    Router.get('/chartyear/:year', async (ctx) => {
        let {year}= ctx.params;
        const res = await new Promise(resolve => {
            chartCollection.find({year,type:'month'}).toArray((err,res)=>{
                if (err) throw err;
                resolve(res)
            })
        })
        ctx.body = res
    })

    Router.get('/chartmonth/:month', async (ctx) => {
        let {month}= ctx.params;
        const res = await new Promise(resolve => {
            chartCollection.find({month,type:'date'}).toArray((err,res)=>{
                if (err) throw err;
                resolve(res)
            })
        })
        ctx.body = res
    })


    Router.get('/detail/:id', async (ctx) => {
        let {id}= ctx.params;
        const res = await collection.findOne({_id:ObjectId(id)})
        ctx.body = res
    })

    Router.get('/qiniu/token', async (ctx) => {
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken=putPolicy.uploadToken(mac);
        ctx.body = uploadToken
    })
    
    Router.get('/collection/:month', async (ctx) => {
        let {month}= ctx.params;
        const res=await chartCollection.findOne({month,type:'month'})
        ctx.body = res
    })
    Router.get('/collectionyear/:year', async (ctx) => {
        let {year}= ctx.params;
        const res=await chartCollection.findOne({year,type:'year'})
        ctx.body = res
    })
    app.use(Router.routes());
    app.use(Router.allowedMethods());
    app.listen(3388);

    // perform actions on the collection object
    //client.close();
});