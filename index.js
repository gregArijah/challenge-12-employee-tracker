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
    name: 'main_options',
    message: 'Select one of the following options',            
    choices : trackerMain_options,       
    
  },
]

const trackerAddDepartment = [
  {
    type: 'input',
    name: 'departmentName',
    message: "Enter new department name (required)",
    validate: departmentName => {
      if (departmentName) return true;
      else {
          console.log("Enter new department name (required");
          return false;
      }
  }}
]
const getDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
        return {
            name: department.name,
            value: department.id,
        };
        });
},
)}

const trackerAddRole = [
    {
      type: 'input',
      name: 'title',
      message: "Enter name of role (required)",
      validate: title => {
        if (title) return true;
        else {
            console.log("Enter name of role (required");
            return false;
        }
    }},
    {
      type: 'input',
      name: 'salary',
      message: "Enter salary of role (required)",
      validate: salary => {
        if (salary) return true;
        else {
            console.log("Enter salary of role (required");
            return false;
        }
    }},
    {
      type: 'list',
      name: 'departmentList',
      message: "Select department of role (required)",
      choices: getDepartments(), 
    },
    {
      type: 'input',
      name: 'role',
      message: "Enter name of role (required)",
      validate: role => {
        if (role) return true;
        else {
            console.log("Enter name of role (required");
            return false;
        }
    }},
  ]
const trackerAddEmployee = [
    {
      type: 'input',
      name: 'firstName',
      message: "Enter employee first name (required)",
      validate: firstName => {
        if (firstName) return true;
        else {
            console.log("Enter employee first name (required");
            return false;
            }
        }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Enter employee last name (required)",
      validate: lastName => {
        if (lastName) return true;
        else {
            console.log("Enter employee last name (required");
            return false;
            }
        }
    },
    // {
    //   type: 'list',
    //   name: 'role',
    //   message: "Select employee role (required)",
    //   choices: roles,
    // },
    // {
    //   type: 'list',
    //   name: 'manager',
    //   message: "Select employee's manager id (required)",
    //   choices: managers, 
    // },
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

const addDepartment = (data) => {
    const sql = 'INSERT INTO department(name) VALUES (?) ';
    db.query(sql, data, (err) => {
        if (err) throw err;
        else {
            console.log("\n")
            console.log(`${data} department has been added.`);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};



const trackerSwitch = (data) => {
    switch (data.main_options) {
        case trackerMain_options[0]: //view departments
            viewDepartments();
            break;

        case trackerMain_options[1]: //view roles
            viewRoles();
            break;
            
        case trackerMain_options[2]: //view employees
            viewEmployees();
            break;
        
        case trackerMain_options[3]: //add department
            inquirer.prompt(trackerAddDepartment)
            .then((response)=> addDepartment(response.departmentName))
            .catch(()=>console.error("Oops, Something went wrong :("));
            break;

        case trackerMain_options[4]: //add role
            inquirer.prompt(trackerAddRole)
            .then((response)=> addRole(response))
            //.catch(()=>console.error("Oops, Something went wrong :("));
            break;

        case trackerMain_options[5]: //add employee
            inquirer.prompt(trackerAddEmployee)
            .then((response)=> addEmployee(response))
            .catch(()=>console.error("Oops, Something went wrong :("));
            break;

        case trackerMain_options[6]: //update employee
            updateEmployee();
            break;

        case trackerMain_options[7]: //exit
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