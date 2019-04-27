var mysql = require ("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "wvj46Tc3xGqp",
    database: "bamazon_db"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connection was successful.");
    makeTable();
})

var makeTable = function() {
    connection.query("SELECT * FROM products",function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name + " || " + res[i].price + " || " + res[i].stock_quantity + "\n");
        }
        customerPrompt(res);
    })
}

var customerPrompt = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "What would you like to buy today? (You can quit with Q)"
    }]).then (function(answer) {
        var correct = false;
        if (answer.choice.toUpperCase()== "Q") {
            process.exit();
        }
        for ( var i = 0; i < res.length; i++) {
            if (res[i].product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: 'input',
                    name: "quant",
                    message: "How many are you looking to buy today?",

                    validate: function (value) {
                        if(isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer) {
                    if((res[id].stock_quantity-answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity-answer.quant)+ "'WHERE product_name='" + product + "'", function(err, res2) {
                            console.log("Your product has been bought!");
                            makeTable();
                        })
                    } else {
                        console.log("Not a valid selection!");
                        customerPrompt(res);
                    }
                })
            }
        }
        if (i==res.length && correct==false) {
            console.log("That is not a valid selection");
            customerPrompt(res);
        }
    })
}
