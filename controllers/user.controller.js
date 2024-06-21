const { paginate } = require("../util/paginate");
const db = require('../models/index');
const sq = require('sequelize');
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const {where, Op} = require("sequelize");

const userList = async(req,res) =>{
    try {
        console.log("req.query",req.query);
        const { q, page, limit, order_by, order_direction } = req.query;
        let search = {};
        let order = [];

        // add the search term to the search object
        if (q) {
            search = {
                where: {
                    name: {
                        [sq.like]: `%${q}%`
                    }
                }
            };
        }
        // add the order parameters to the order
        if (order_by && order_direction) {
            order.push([order_by, order_direction]);
        }

        // transform function that can be passed to the  paginate method
        const transform = (records) => {
            return records.map(record => {
                return {
                    id: record.id,
                    name: record.name,
                    /*date: moment(record.created_at).format('D-M-Y H:mm A')*/
                }
            });
        }

        // paginate method that takes in the model, page, limit, search object, order and transform
        const userList = await paginate(db.User, page, limit, search, order, transform);
        return res.status(200).send({
            success: true,
            message: 'Fetched users',
            data: userList
        })
    }catch (e) {
        console.log("e----",e);
        return res.status(500).send('Error in user listing');
    }
}

const checkExitEmail = async(req, res) =>{
    const { email } = req.body;
    console.log("req.params.id",req.params.id)
    // Check if the email exists
    const userExists = await db.User.findOne({
        where: {email,
            id: {
                [Op.ne]: req.params.id
            }}
    });
    console.log("userExists",userExists)
    if (userExists) {
        throw new Error('409');
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await checkExitEmail(req, res);
        await db.User.create({
            name,
            email,
            password:await bcrypt.hash(password, 15),
        });
        return res.status(200).send('Create User successful');
    } catch (err) {
        if (err.message === '409') {
            return res.status(err.message).send('Email is already associated with an account');
        } else {
            console.log("err----", err);
            return res.status(500).send('Error in Create User');
        }
    }

}

const updateUser = async (req,res)=>{
    try{
        const { name, email } = req.body;
        await checkExitEmail(req, res);
        await db.User.update({
            name:name,
            email,
        },{where:{id:req.params.id}});
        return res.status(200).send('Update User successful');
    }catch (err) {
        if (err.message === '409') {
            return res.status(err.message).send('Email is already associated with an account');
        } else {
            console.log("err----", err);
            return res.status(500).send('Error in Create User');
        }
    }
}

const getUser = async (req,res)=>{
    try{
        const getData = await db.User.findOne({where:{id:req.params.id}});
        if (!getData) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send(getData);
    }catch (err) {
        console.log("err----",err);
        return res.status(500).send('Error in edit user');
    }
}

const deleteUser = async (req,res)=>{
    try{
        const getData = await db.User.findOne({where:{id:req.params.id}});
        // Check if user exists
        if (!getData) {
            return res.status(404).send('User not found');
        }
        // Delete user
        await db.User.destroy({
            where: { id: req.params.id }
        });

        return res.status(200).send('User deleted successfully');
    }catch (err) {
        console.log("err----",err);
        return res.status(500).send('Error in edit user');
    }
}

module.exports = { userList,createUser,updateUser,getUser,deleteUser }