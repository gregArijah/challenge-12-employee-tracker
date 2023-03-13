const inquirer = require('inquirer');            //CLI interface for node.js
const mysql = require('mysql2');                 //mySQL client   
require("console.table");          //table method to write to console
//import functions in other file
// const { viewDepartments,viewEmployees,  viewRoles, addDepartment, 
//         addRole, addEmployee, updateEmployeeRole, selectRole, 
//         selectManager, selectDepartment } = require('./queries');
//const viewDepartments = require('./queries');


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',// MySQL username,
      password: 'sqlpswd',// MySQL password
      database: 'employees'
    },
    console.log(`Successfully connected to the employees database.`)
  );


//object arrays to be passed to inquirer
const trackerMain_options = [
    "View all departments",
    "View all roles", 
    "View all employees", 
    "Add a department", 
    "Add a role", 
    "Add an employee", 
    "Update an employee role",
    "Exit"
]

const trackerMain = [   
  {
    type: 'list',
    message: 'Select one of the following options',            
    choices : trackerMain_options,       
    name: 'main_options',
  },
]

const viewDepartments = () => {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err,res) => {
        if (err) throw err;
        else {
            console.log("\n")
            console.table(res);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};
const viewRoles = () => {
    const sql = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id';
    db.query(sql, (err,res) => {
        if (err) throw err;
        else {
            console.log("\n")
            console.table(res);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};
const viewEmployees = () => {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id';
    db.query(sql, (err,res) => {
        if (err) throw err;
        else {
            console.log("\n")
            console.table(res);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};

const trackerSwitch = (data) => {
    switch (data.main_options) {
        case trackerMain_options[0]:
            viewDepartments();
            break;
        case trackerMain_options[1]:
            viewRoles();
            break;
        case trackerMain_options[2]:
            viewEmployees();
            break;
        case trackerMain_options[3]:
            addDepartment();
            break;
        case trackerMain_options[4]:
            addRole();
            break;
        case trackerMain_options[5]:
            addEmployee();
            break;
        case trackerMain_options[6]:
            updateEmployee();
            break;
        case trackerMain_options[7]:
            exit();
            break;
    }
}
//initialize app
function init(){
    
    inquirer.prompt(trackerMain)
    .then ((response) => trackerSwitch(response))
    .catch(()=> console.error("Oops, Something went wrong :("));
}

init();

//module.exports = db;