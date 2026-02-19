// const express = require("express");
// const app = express();
// const fileHandler = require("./modules/fileHandler");

// // ================= MIDDLEWARE =================
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("public"));
// app.set("view engine", "ejs");

// // ================= HOME / DASHBOARD =================
// app.get("/", async (req, res) => {
//   try {
//     const employees = await fileHandler.readData();
//     res.render("index", { employees });
//   } catch (err) {
//     console.error(err);
//     res.send("Error loading employees");
//   }
// });

// // ================= ADD PAGE =================
// app.get("/add", (req, res) => {
//   res.render("add");
// });

// // ================= ADD EMPLOYEE =================
// app.post("/add", async (req, res) => {
//   try {
//     let { name, department, salary, gender, startDate } = req.body;

//     salary = Number(salary);

//     // convert department to array always
//     if (!Array.isArray(department)) {
//       department = department ? [department] : [];
//     }

//     // validation
//     if (!name || salary < 0) {
//       return res.send("Invalid input. Name required & salary must be positive.");
//     }

//     const employees = await fileHandler.readData();

//     const newEmployee = {
//       id: Date.now(),
//       name,
//       department,
//       salary,
//       gender,
//       startDate
//     };

//     employees.push(newEmployee);
//     await fileHandler.writeData(employees);

//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.send("Error adding employee");
//   }
// });

// // ================= DELETE EMPLOYEE =================
// app.get("/delete/:id", async (req, res) => {
//   try {
//     const employees = await fileHandler.readData();

//     const updated = employees.filter(emp => emp.id != req.params.id);

//     await fileHandler.writeData(updated);

//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.send("Error deleting employee");
//   }
// });

// // ================= EDIT PAGE =================
// app.get("/edit/:id", async (req, res) => {
//   try {
//     const employees = await fileHandler.readData();

//     const employee = employees.find(emp => emp.id == req.params.id);

//     if (!employee) return res.send("Employee not found");

//     res.render("edit", { employee });
//   } catch (err) {
//     console.error(err);
//     res.send("Error loading edit page");
//   }
// });

// // ================= UPDATE EMPLOYEE =================
// app.post("/update/:id", async (req, res) => {
//   try {
//     const employees = await fileHandler.readData();

//     const updatedEmployees = employees.map(emp => {
//       if (emp.id == req.params.id) {
//         return {
//           ...emp,
//           name: req.body.name,
//           department: Array.isArray(req.body.department)
//             ? req.body.department
//             : [req.body.department],
//           salary: Number(req.body.salary),
//           gender: req.body.gender,
//           startDate: req.body.startDate
//         };
//       }
//       return emp;
//     });

//     await fileHandler.writeData(updatedEmployees);

//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.send("Error updating employee");
//   }
// });

// // ================= SERVER =================
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const app = express();
const fileHandler = require("./modules/fileHandler");

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// ================= HOME / DASHBOARD =================
app.get("/", async (req, res) => {
    try {
        const employees = await fileHandler.readData();
        res.render("index", { employees });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading employees");
    }
});

// ================= ADD PAGE =================
app.get("/add", (req, res) => {
    res.render("add");
});

// ================= ADD EMPLOYEE =================
app.post("/add", async (req, res) => {
    try {
        let { name, department, salary, gender, startDate, profile } = req.body;
        salary = Number(salary);

        if (!Array.isArray(department)) {
            department = department ? [department] : [];
        }

        const employees = await fileHandler.readData();
        const newEmployee = {
            id: Date.now(), // Unique ID generation
            name,
            profile: profile || "1",
            department,
            salary,
            gender,
            startDate
        };

        employees.push(newEmployee);
        await fileHandler.writeData(employees);
        res.redirect("/"); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding employee");
    }
});

// ================= DELETE EMPLOYEE (FIXED) =================
app.get("/delete/:id", async (req, res) => {
    try {
        const employees = await fileHandler.readData();
        // ID ko filter karke naya array banayein
        const updatedEmployees = employees.filter(emp => emp.id != req.params.id);
        
        await fileHandler.writeData(updatedEmployees);
        console.log(`Deleted employee ID: ${req.params.id}`);
        res.redirect("/"); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting employee");
    }
});

// ================= EDIT PAGE =================
app.get("/edit/:id", async (req, res) => {
    try {
        const employees = await fileHandler.readData();
        const employee = employees.find(emp => emp.id == req.params.id);
        
        if (!employee) return res.send("Employee not found");
        res.render("edit", { employee });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit page");
    }
});

// ================= UPDATE EMPLOYEE =================
app.post("/update/:id", async (req, res) => {
    try {
        const employees = await fileHandler.readData();
        let { name, department, salary, gender, startDate, profile } = req.body;

        const updatedEmployees = employees.map(emp => {
            if (emp.id == req.params.id) {
                return {
                    ...emp,
                    name,
                    profile,
                    gender,
                    salary: Number(salary),
                    department: Array.isArray(department) ? department : [department],
                    startDate
                };
            }
            return emp;
        });

        await fileHandler.writeData(updatedEmployees);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating employee");
    }
});

// ================= SERVER =================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});