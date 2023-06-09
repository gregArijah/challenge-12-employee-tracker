const inquirer = require('inquirer');       //CLI interface for node.js
const mysql = require('mysql2');            //mySQL client   
const cTable = require("console.table");                 //table method to write to console


const db = mysql.createConnection(  // Connect to database
    {
      host: 'localhost',
      user: 'root',// MySQL username,
      password: 'sqlpswd',// MySQL password
      database: 'employees'
    },
    console.log(`Successfully connected to the employees database.`)
);
const promptMain_options = [    //array of choices to be passed to inquirer in promptMain
    "View all departments",
    "View all roles", 
    "View all employees", 
    "Add a department", 
    "Add a role", 
    "Add an employee", 
    "Update an employee role",
    "Exit"
];
const promptMain = [   //main prompt at program startup
  {
    type: 'list',
    name: 'main_options',
    message: 'Select one of the following options',            
    choices : promptMain_options,       
    
  },
];
const promptAddDepartment = [   //add new department to business
  {
    type: 'input',
    name: 'departmentName',
    message: "Enter new department name (required)",
    validate: departmentName => {   //make sure field is not empty
      if (departmentName) return true;  
      else {                         
          console.log("Enter new department name (required");
          return false;
      }
  }}
];
const promptAddRole = (departments) => [    //add new role to business
    {
      type: 'input',
      name: 'title',
      message: "Enter name of role (required)",
      validate: title => {
        if (title) return true;     //make sure field is not empty
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
        if (salary) return true;    //make sure field is not empty
        else {
            console.log("Enter salary of role (required");
            return false;
        }
      }
    },
    {
      type: 'list',
      name: 'roleDepartment',
      message: "Select department of role (required)",
      choices: departments,     //value passed in function call 
    },
];
const promptAddEmployee = (employees, roles) => [   //add employee
    {
      type: 'input',
      name: 'firstName',
      message: "Enter employee first name (required)",
      validate: firstName => {  //make sure field is not empty
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
        if (lastName) return true;  //make sure field is not empty
        else {
            console.log("Enter employee last name (required");
            return false;
            }
        }
    },
    {
      type: 'list',
      name: 'role',
      message: "Select employee role (required)",
      choices: roles,   //value passed in function call
    },
    {
      type: 'list',
      name: 'manager',
      message: "Select employee's manager (required)",
      choices: employees,   //value passed in function call
    },
];
const promptUpdateEmployee = (employees,roles) => [ //update employee role
    {
        type: 'list',
        name: 'selectEmployee',
        message: 'Select an employee to update role.',
        choices: employees,   //passed in function call
    },
    {
        type: 'list',
        name: 'selectRole',
        message: 'Select new role.',
        choices: roles, //passed in fucntion call
    },
];
const viewDepartments = () => { //view departments
    //query db
    const sql = 'SELECT * FROM department';
    db.query(sql, (err,res) => {
        if (err) console.error("Oops, Something went wrong :(");//throw err;
        else {
            console.log("\n");
            console.table(res);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};
const viewRoles = () => {   //views job information
    //query db
    const sql = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id';
    db.query(sql, (err,res) => {
        if (err) console.error("Oops, Something went wrong :(");//throw err;
        else {
            console.log("\n");
            console.table(res);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};
const viewEmployees = () => {   //view all employees
    //query db
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id';
    db.query(sql, (err,res) => {
        if (err) console.error("Oops, Something went wrong :(")//throw err;
        else {
            console.log("\n");
            console.table(res);
            console.log("\nPress any key to continue...");
        }
    })
    init();
};
const addDepartment = () => {   //add a new department
    //update db
    const addToDb = (data) => {
        const sql = 'INSERT INTO department(name) VALUES (?) ';
        db.query(sql, data, (err) => {
            if (err) console.error("Oops, Something went wrong :(")//throw err;
            else {
                console.log("\n"),
                console.log(`${data} department has been added.`);
                console.log("\nPress any key to continue...");
            }
        })
        init();
    }
    inquirer.prompt(promptAddDepartment)
    .then((response)=> addToDb(response.departmentName))
    .catch(()=>console.error("Oops, Something went wrong :(")); 

};
const addRole = () => { //add new roles to company
    //update db
    const addToDb = ({title,salary,roleDepartment}) => {
        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)';
        const params = [title,salary,roleDepartment];
        db.query(sql, params ,(err) => {
            if (err) console.error("Oops, Something went wrong :(")//throw err;
            else {
                console.log("\n");
                console.log(`${title} role has been added.`);
                console.log("\nPress any key to continue...");
            }
        })
        init();
    }
    //query db
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) console.error("Oops, Something went wrong :(");
        departments = departments.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
    
        inquirer.prompt(promptAddRole(departments))
        .then((response)=> addToDb(response))
        .catch(()=>console.error("Oops, Something went wrong :("));
        }
    )
};
const addEmployee = () => { //add new employee
    //update db
    const addToDb = ({firstName,lastName,role,manager}) => {
        const sql = 'INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)';
        const params = [firstName,lastName,role,manager];
        db.query(sql, params ,(err) => {
            if (err) console.error("Oops, Something went wrong :(");//throw err;
            else {
                console.log("\n");
                console.log(`Employee ${firstName} ${lastName} has been added.`);
                console.log("\nPress any key to continue...");
            }
        })
        init();
    }
    //query db
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) console.error("Oops, Something went wrong :(");
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        //query db
        db.query('SELECT * FROM role', (err, roles) => {
            if (err) console.error("Oops, Something went wrong :(");
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                };
            });
            inquirer.prompt(promptAddEmployee(employees,roles))
            .then((response)=> addToDb(response))
            .catch(()=>console.error("Oops, Something went wrong :("));
            }
        )
    })
}; 
const updateEmployee = () => {  //update employee role
    //update db
    const updateDb = ({selectEmployee,selectRole}) => {
        const sql = 'UPDATE employee SET ? WHERE ?';
        const params = [
            {
                role_id: selectRole
            },
            {
                id: selectEmployee
            }
        ];
        db.query(sql, params ,(err) => {
            if (err) console.error("Oops, Something went wrong :(");//throw err;
            else {
                console.log("\n");
                console.log(`Employee role has been updated.`);
                console.log("\nPress any key to continue...");
            }
        })
        init();
    }
    //query db
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) console.error("Oops, Something went wrong :(");
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        //query db
        db.query('SELECT * FROM role', (err, roles) => {
            if (err) console.error("Oops, Something went wrong :(");
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });    
            inquirer.prompt(promptUpdateEmployee(employees,roles))
            .then((response)=> updateDb(response))
            .catch(()=>console.error("Oops, Something went wrong :("));
            }
        )
    });
};
const exit = () => {    //exit application
    console.log("goodbye!");
    process.exit();
};
const promptSwitch = (data) => {    //case statement
    switch (data.main_options) {
        case promptMain_options[0]: //view departments
            viewDepartments();
            break;

        case promptMain_options[1]: //view roles
            viewRoles();
            break;

        case promptMain_options[2]: //view employees
            viewEmployees();
            break;
        
        case promptMain_options[3]: //add department
            addDepartment();
            break;

        case promptMain_options[4]: //add role
            addRole();
            break;
            
        case promptMain_options[5]: //add employee
            addEmployee();
            break;

        case promptMain_options[6]: //update employee
            updateEmployee();
            break;

        case promptMain_options[7]: //exit
            exit();
            break;
    }
};
function init(){    //initialize app
    inquirer.prompt(promptMain)
    .then ((response) => promptSwitch(response))
    .catch(()=> console.error("Oops, Something went wrong :("));
};
init();
