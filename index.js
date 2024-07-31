import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";



const app = express();
const port = 3000;
const saltRounds = 10;

//DB Credentials
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "NXL",
    password: "NXL9834",
    port: 5433,
});


db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//Render Login Page
app.get("/", async (req, res) => {
    res.render("login.ejs");
});

//Render Home Page
app.get("/home", (req, res) => {
    res.render("home.ejs");
});

//Render Customer Portal Page & Pull Data from DB to Display
app.get("/customer", async (req, res) => {
    try {
        const customerData = await db.query("SELECT * FROM customers");
        res.render("customerportal.ejs", {customerData: customerData.rows});
    } catch (err) {
        console.error("Error feting customers:", err);
        res.status(500).send("Internal Server Error");
    }
   
});

//Render Admin Page
app.get("/admin", (req, res) => {
    res.render("admin.ejs");
});

//Render Customer Page
app.get("/customer", (req, res) => {
    res.render("customerportal.ejs");
})

//Render NewSub Page
app.get("/newsubcontractor", (req, res) => {
    res.render("newsubcontractor.ejs");
});

//Render NewCustomer Page
app.get("/newcustomer", (req, res) => {
    res.render("newcustomer.ejs");
});

//Render NewProject Page
app.get("/newproject", (req, res) => {
    res.render("newproject.ejs");
});

//Render Subcontractor Portal Page & Pull Data from DB to Display
app.get("/subcontractor", async (req, res) => {
    try {
        const subData = await db.query("SELECT * FROM subcontractors");
        res.render("subcontractorportal.ejs", {subData: subData.rows});
    } catch (err) {
        console.error("Error fetching subcontractors:", err);
        res.status(500).send("Internal Server Error");
    }
   
});

//Render Projects and Fetch Projects from DB
app.get("/projects", async (req, res) => {
    try {
        const projectData = await db.query("SELECT * FROM projects");
        res.render("projects.ejs", {projectData: projectData.rows});
    } catch (err) {
        console.error("Error feting subcontractors:", err);
        res.status(500).send("Internal Server Error");
    }
   
});

//Login Process - Username and Password Verification with DB
app.post("/", async (req, res) => {
    const email = req.body.username;
    const loginPassword = req.body.password;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
//Check loginPassword with saved Hashed Password
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashedPassword = user.password;

            bcrypt.compare(loginPassword, storedHashedPassword, (err, result) =>{
                if (err) {
                    console.log("Error comparing password", err);
                } else {
                    if (result) {
                        res.render("home.ejs");
                    } else {
                        res.send("Incorrect Password");
                    }
                }
            });
        } else {
            res.send("User not found");
        }
        
    } catch (err) {
        console.log(err);
    }
});

//Passing Data from Admin Page to Create New User Info
app.post("/admin", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
//Password Hashing 
    if (checkResult.rows.length > 0) {
        res.send("Email already exists. Try logging in.");
    } else {
        bcrypt.hash(password,saltRounds, async (err, hash) => {
            if (err) {
                console.log("Error hashing password:", err);
            } else {
            const result = await db.query(
                "INSERT INTO users (email, password) VALUES ($1, $2)",
                [email, hash]
            );
            res.render("home.ejs");
        }
        });
        
    }} catch (err) {
        console.log(err);
    }
});

//Adds information entered in NewCustomer page to DB
app.post("/newcustomer", async (req, res) => {
    const customerCompany = req.body.customerCompany;
    const customerAddress = req.body.customerAddress;
    const customerCity = req.body.customerCity;
    const customerState = req.body.customerState;
    const customerZip = req.body.customerZip;
    const customerContactName = req.body.customerContactName;
    const customerContactNumber = req.body.customerContactNumber;
    const customerContactEmail = req.body.customerContactEmail;
    try {
        await db.query(
        "INSERT INTO customers (customername, customeraddress, customercity, customerstate, customerzip, customercontactname, customercontactnumber, customercontactemail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [customerCompany, customerAddress, customerCity, customerState, customerZip, customerContactName, customerContactNumber, customerContactEmail]
        );
    res.redirect("/customer");
    } catch(err) {
        console.log(err);
    }
});

//Adds information entered in NewSubcontractor page to DB
app.post("/newsubcontractor", async (req, res) => {
    const subName = req.body.subName;
    const subAddress = req.body.subAddress;
    const subCity = req.body.subCity;
    const subState = req.body.subState;
    const subZip = req.body.subZip;
    const subContactName = req.body.subContactName;
    const subContactNumber = req.body.subContactNumber;
    const subContactEmail = req.body.subContactEmail;
    try {
        await db.query(
        "INSERT INTO subcontractors (subname, subaddress, subcity, substate, subzip, subcontactname, subcontactnumber, subcontactemail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [subName, subAddress, subCity, subState, subZip, subContactName, subContactNumber, subContactEmail]
        );
    res.redirect("/subcontractor");
    } catch(err) {
        console.log(err);
    }
});

//Adds information entere in Projects page to DB
app.post("/newproject", async (req, res) => {
    const projectNumber = req.body.projectNumber;
    const dirNumber = req.body.dirNumber;
    const projectManager = req.body.projectManager;
    const projectContract = req.body.projectContract;
    const projectName = req.body.projectName;
    const projectAddress = req.body.projectAddress;
    const projectCity = req.body.projectCity;
    const projectState = req.body.projectState;
    const projectZip = req.body.projectZip;
    const projectTracking = req.body.projectTracking;
    const projectPortal = req.body.projectPortal;

    try {
        await db.query(
        "INSERT INTO projects (projectnumber, dirnumber, projectmanager, projectcontract, projectname, projectaddress, projectcity, projectstate, projectzip, projecttracking, projectportal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [projectNumber, dirNumber, projectManager, projectContract, projectName, projectAddress, projectCity, projectState, projectZip, projectTracking, projectPortal]
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error inserting project:", err);

        if (err.code === '23505') { // PostgreSQL unique violation error code
            res.status(400).json({ error: 'A project with this identifier already exists. Please use a different identifier.' });
        } else if (err.code === '23502') { // PostgreSQL not-null violation error code
            res.status(400).json({ error: 'One or more required fields are missing or invalid. Please check your input and try again.' });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
        }
    }
});

//Console Log Port
app.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
});



