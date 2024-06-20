const { paginate } = require("../util/paginate");
const db = require('../models/index');
const sq = require('sequelize');
const User = require('../models/user');

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

module.exports = { userList }