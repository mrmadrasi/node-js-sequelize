const db = require('../models/index');

const userList = async(req,res) =>{
    try {
        return res.status(200).send('test successful');
    }catch (e) {
        console.log("e----",e);
        return res.status(500).send('Error in user listing');
    }
}

module.exports = { userList }