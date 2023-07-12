const mysql = require('mysql');

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAMe
});

// view users from the database user
exports.view = (req, res) => {
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // here we are rendering the rows in the home page 
                let removedUser = req.query.remove;
                res.render('home', { rows,removedUser });
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}

// to find a particular record in the database user
exports.find = (req, res) => {
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');

        let searchterm = req.body.search;

        connection.query('select * from user where id like ? or first_name like ? or last_name like ? or email like ? or phone like ?', ['%' + searchterm + '%', '%' + searchterm + '%', '%' + searchterm + '%', '%' + searchterm + '%', '%' + searchterm + '%'], (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // here we are rendering the rows in the home page 
                res.render('home', { rows });
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}

// to render the form to get a new user : get request
exports.form = (req, res) => {
    res.render('add-user');
}

// to send the data which the user enters in the form via post request
exports.create = (req, res) => {
    // getting all the details which the user enters from the form all at a time 
    const { first_name, last_name, email, phone, comments } = req.body;
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');
        connection.query('insert into user set first_name = ?,last_name = ?,email=?,phone=?,comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // here we are rendering the rows in the home page 
                res.render('add-user', { alert: 'user added successfully!' });
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}

// rendering the edit user page
exports.edit = (req, res) => {
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // here we are rendering the rows in the home page 
                res.render('edit-user', { rows });
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}

// updating the user details
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');
        connection.query('update user set first_name = ?,last_name = ?, email = ?,phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // connect to database
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('connected !');
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection release it
                        connection.release();
                        if (!err) {
                            // here we are rendering the rows in the home page 
                            res.render('edit-user', { rows , alert:`${first_name} has been updated successfully!`});
                        } else {
                            console.log("error");
                        }
                        // console.log("the data form the table is \n", rows);
                    });
                });
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}

// deleting the user with the given id
exports.delete = (req, res) => {
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');
        connection.query('update user set status = ? WHERE id = ?', ['removed',req.params.id], (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // here we are rendering the rows in the home page 
                let removedUser = encodeURIComponent('user removed successfully.');
                res.redirect('/?remove='+removedUser);
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}

// view users 
exports.viewall = (req, res) => {
    // connect to database
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected !');
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
            //when done with connection release it
            connection.release();
            if (!err) {
                // here we are rendering the rows in the home page 
                res.render('view-user', { rows });
            } else {
                console.log("error");
            }
            // console.log("the data form the table is \n", rows);
        });
    });
}
