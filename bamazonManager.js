var mysql = require ("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "wvj46Tc3xGqp",
    database: "bamazon_db"
});

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("connection was successful.");
//     makeTable();
// })

var makeTable = function() {
    connection.query("SELECT * FROM products", function (err, res) {
        if(err) throw err;
        console.log("Item_id\tProduct Name\tDepartment Name\tPrice\tNumber in Stock");
        console.log("-----------------------")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "\t " + res[i].product_name + "\t " + res[i].department_name + "\t " + res[i].price + "\t " + res[i].stock_quantity );
        }
        console.log("-----------------------");
        promptManager(res);
    })
}

var promptManager = function (res) {
    inquirer.prompt([{
        type:"rawlist",
        name:"choice",
        message:"What would you like to do?",
        choices:["Add a new item", "Add quantity to an existing item"]
    }]).then(function(val) {
        if(val.choice=="Add a new item") {
            addItem();
        }
        if(val.choice=="Add quantity to an existing item") {
            addQuantity(res);
        }
    })
}

function addItem() {
    inquirer.prompt([{
        type:"input",
        name:"product_name",
        message:"What is the name of the product?"
    },{
        type:"input",
        name:"department_name",
        message:"What is the correct department for this product?"
    },{
        type:"input",
        name:"price",
        message:"What is the price of the product?"
    },{
        type:"input",
        name:"stock_quantity",
        message:"What is the quantity of this item that will be available for sale?"
    }]).then(function(val) {
        connection.query("INSERT INTO products ( product_name,department_name,price,stock_quantity) VALUES ('"+val.product_name+"','"+val.department_name+"',"+val.price+","+val.stock_quantity+");", function(err,res) {
            if(err) throw err;
            console.log(val.product_name+" ADDED TO BAMAZON!");
            makeTable();
        })
    })
}

function addQuantity(res) {
    inquirer.prompt([{
        type:"input",
        name:"product_name",
        message: "What product would you like to update?"
    },{
        type:"input",
        name:"added",
        message:"How much stock would you like to add?"
    }]).then(function(val) {
        for (var i = 0; i < res.length; i++) {
            if(res[i].product_name==val.product_name) {
                connection.query('UPDATE products SET stock_quantity=stock_quantity+'+val.added+' WHERE item_id='+res[i].item_id+';', function(err, res) {
                    if(err) throw err;
                    if(res.affectedRows == 0) {
                        console.log("That item does not exist at this time. Try selecting a different item.");
                        makeTable();
                    } else {
                        console.log("Items have been added into your inventory!");
                        makeTable();
                    }
                })
            }
        }
    })
}

makeTable();