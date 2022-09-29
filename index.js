const mysql = require('mysql');
const  express = require('express');

var app = express();

const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'Employees',
    multipleStatements:true
})

mysqlConnection.connect((err)=>{
    if(!err){
       console.log('DB connection successful');
    }else{
        console.log('Failed to connect.Error '+ JSON.stringify(err,undefined,2));
    }
})


app.listen(3000,()=>console.log('Express server is running at 3000'));

//get all employees

app.get('/employees',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee',(err,rows,field)=>{
        if(!err) res.send(rows);
        else console.log(err);
    })
}) 

//get specific employee with id

app.get('/employees/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee Where EmpID = ?',[req.params.id],(err,rows,field)=>{
        if(!err) res.send(rows);
        else console.log(err);
    });
})

//delete an employee

app.delete('/employees/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID=?',[req.params.id],(err,rows,field)=>{
        if(!err) res.send('item deleted ');
        else console.log(err);
    })
});

//insert  an employee


app.post('/employees',(req,res)=>{
    console.log('post request start');
    let emp = req.body;
    

    let sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;\
    CALL AddOrEditEmployee(@EmpID,@Name,@EmpCode,@Salary);";

    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.EmpCode,emp.Salary],(err,rows,field)=>{
        if(!err) res.send(rows); //foreach rows and element.constructor==array to get data inside
        else console.log(err);
    })
})


// update an employee


app.put('/employees',(req,res)=>{
    let emp = req.body;
    let sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;\
    CALL AddOrEditEmployee(@EmpID,@Name,@EmpCode,@Salary);";

    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.EmpCode,emp.Salary],(err,rows,field)=>{
        if(!err) res.send('updated successfull'); //foreach rows and element.constructor==array to get data inside
        else console.log(err);
    })
})