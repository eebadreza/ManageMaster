const Customer = require('../models/CustomerModel');
const mongoose = require('mongoose');
/**
 * GET /
 * Homepage
 */
exports.getHomePage = async (req, res) => {
    const locals = {
        title: 'ManageMaster | Manage People',
        description: 'CRUD app using Node.JS',
    };

    let perPage = 10;
    let page = req.query.page || 1;
    try {
        const messages = await req.flash('info');
        // const customers = await Customer.find({}).limit(22);
        const customers = await Customer.aggregate([
            { $sort: { updatedAt: -1 } },
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Customer.countDocuments({});
        // console.log(count);

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getAboutpage = async (req, res) => {
    const locals = {
        title: 'ManageMaster | About',
        description: 'CRUD app using Node.JS',
    };

    try {
        res.render('about', {
            locals,
        });
    } catch (err) {
        console.log(err);
    }
};

/**
 * GET /add
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
    const locals = {
        title: 'ManageMaster | Add New Customer',
        description: 'CRUD app using Node.JS',
    };
    try {
        res.render('customer/add', locals);
    } catch (err) {
        console.log(err);
    }
};

/**
 * POST /add
 * Create New Customer
 */
exports.postCustomer = async (req, res) => {
    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details,
    });

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'New Customer has been added.');
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
};

/**
 * GET /view/:id
 * Get Customer By Id
 */
exports.viewCustomer = async (req, res) => {
    try {
        const locals = {
            title: 'ManageMaster | View Customer',
            description: 'CRUD app using Node.JS',
        };
        const customer = await Customer.findOne({ _id: req.params.id });
        // console.log(customer);
        res.render('customer/view', { locals, customer });
    } catch (err) {
        console.log(err);
    }
};

/**
 * GET /edit/:id
 * GET Customer Upadte Form
 */
exports.editCustomer = async (req, res) => {
    try {
        const locals = {
            title: 'ManageMaster | Edit Customer',
            description: 'CRUD app using Node.JS',
        };
        const customer = await Customer.findOne({ _id: req.params.id });
        // console.log(customer);
        res.render('customer/edit', { locals, customer });
    } catch (err) {
        console.log(err);
    }
};

/**
 * PUT /edit/:id
 * UPDATE Customer
 */
exports.updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                tel: req.body.tel,
                email: req.body.email,
                details: req.body.details,
            }
        );

        // console.log(updatedCustomer);
        res.redirect(`/edit/${req.params.id}`);
    } catch (err) {
        console.log(err);
    }
};

/**
 * DELETE /edit/:id
 * DELETE Customer
 */
exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.deleteOne({ _id: req.params.id });
        // console.log(a);
        await req.flash('info', `Customer has been Deleted`);
        res.redirect(`/`);
    } catch (err) {
        console.log(err);
    }
};

/**
 * POST /search
 * Search Customer
 */
exports.searchCustomer = async (req, res) => {
    const locals = {
        title: 'ManageMaster | Search Results',
        description: 'CRUD app using Node.JS',
    };

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            ],
        });

        res.render('search', {
            customers,
            locals,
        });
    } catch (err) {
        console.log(err);
    }
};
