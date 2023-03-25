const { verify } = require('jsonwebtoken');
const User = require("../model/User");
require('dotenv').config();


const validateToken = async (req, res, next) => {
    const tokenHeader = req.header('token');
    if (!tokenHeader) {
        return res.status(400).json({ error: "user not logged in" });
      
    }
    try {
        console.log({tokenHeader});
        const decodeToken = await verify(tokenHeader, process.env.SECRET)
        console.log({decodeToken});
        if (!decodeToken) {
            return res.status(400).json({ error: "Unauthorized" });
        }

        const user = await User.findOne({ _id: decodeToken._id });

        if (user) {
            req.user = decodeToken;
            next();
        } else {
            res.status(400).json({ error: "Invalid token !!!" });
        }

    } catch (error) {
        res.status(400).json({ error: "Not valid" });
    }
}
module.exports = { validateToken };