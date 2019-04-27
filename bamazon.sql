CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (255),
    department_name VARCHAR (255),
    price DEC (10, 2) NOT NULL,
    stock_quantity INT (10),
    PRIMARY KEY (item_id)
);