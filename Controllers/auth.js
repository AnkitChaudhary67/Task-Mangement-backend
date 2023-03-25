const Task = require('../model/Task');
const User = require('../model/User');
const Category = require('../model/Category')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const JWT_SECRET = process.env.SECRET;


//Sign Up
exports.registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({ message: `Please fill all the field` });
    }

    try {
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(422).json({ message: `Email already exist !!` });
        } else {
            req.body.password = await bcrypt.hash(password, 10);
            const user = new User(req.body);
            await user.save();
            res.status(201).json({ message: 'Register successfully' });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Login
exports.loginUser = async (req, res) => {
    
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ message: `Please fill all the field` });
    }
    try {
        const user = await User.findOne({ email }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        delete user.password
        const token = jwt.sign({ ...user }, JWT_SECRET);

        res.status(200).json({
            messae: "Login Successfully",
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }


};


//get user deatils
exports.getUserDetail = async (req, res) => {
    console.log(req.user);
    const { _id } = req.user
    try {
        const usersData = await User.findById(_id).lean()
        delete usersData.password
        res.status(200).json({
            message: "user detail fetch succesfully!",
            data: usersData
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

// categories
exports.addCategory = async (req, res) => {
    const { name, color } = req.body;

    if (!name || !color) {
        res.status(422).json({ message: "All Fields are required" })
    }

    try {
        const result = await Category.create(req.body);

        res.status(201).json({
            message: "Category created succesfully!",
            data: result
        });

    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
};

// edit categoryId
exports.editCategory = async (req, res) => {
    const { name, color, categoryId } = req.body
    
    if(!categoryId){
        return res.status(422).json({ message: `Please Send categoryID` });
    }
    try {
        const categoryUpdate = await Category.findByIdAndUpdate({ _id: categoryId }, { name, color });
        res.status(200).json({
            message: "categoryId update succesfully!",
            data: categoryUpdate
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

// delete Category
exports.deleteCategory = async (req, res) => {
    const {  categoryId } = req.body;
    if(!categoryId){
        return res.status(422).json({ message: `Please Send categoryID` });
    }
    try {
        const deleteCat = await Category.findByIdAndDelete(categoryId);
        res.status(200).json({
            message: "category delete succesfully!",
            data: deleteCat
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}


//  get categories
exports.getCategory = async (req, res) => {
    try {
        const usersData = await Category.find();
        res.status(200).json({
            message: "categories detail fetch succesfully!",
            data: usersData
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

//  get categories detail
exports.getCategoryDetail = async (req, res) => {
    const {  categoryId } = req.body;
    if(!categoryId){
        return res.status(422).json({ message: `Please Send categoryID` });
    }
    try {
        const usersData = await Category.findById(categoryId);
        res.status(200).json({
            message: "categories detail fetch succesfully!",
            data: usersData
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}



// create Task
exports.createTask = async (req, res) => {
    const { title, description, categoryId, dueDate, priority, assignedUserId, status } = req.body;

    if (!title || !description || !categoryId || !dueDate || !priority || !assignedUserId || !status) {
        return res.status(422).json({ message: `Please fill all the field` });
    }

    try {
        const userData = new Task(req.body);
        await userData.save();
        res.status(201).json({ message: 'Task Create successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Task edit
exports.editTask = async (req, res) => {
    const { taskId,title, description, categoryId, dueDate, priority, assignedUserId, status } = req.body;
  
    if(!taskId){
        return res.status(422).json({ message: `Please Send taskID` });
    }
    try {
        const updateuser = await Task.findByIdAndUpdate({ _id:taskId }, {
            title, description, categoryId, dueDate, priority, assignedUserId, status
        }, {
            new: true
        });

        await updateuser.save();
        res.status(201).json({ message: 'Task Update successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// delete Task

exports.deleteTask = async (req, res) => {
    const {  taskId } = req.body;
    if(!taskId){
        return res.status(422).json({ message: `Please Send taskID` });
    }
    try {
        const deleteTsk = await Task.findByIdAndDelete(taskId);
        res.status(200).json({
            message: "category delete succesfully!",
            data: deleteTsk
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

// get Task
exports.getTask = async (req, res) => {
    try {
        const usersData = await Task.aggregate([
            {
                $lookup: {
                    from: Category.collection.name,
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDetail" 
                }
            },
            {
                $unwind: "$categoryDetail" 
            },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: "assignedUserId",
                    foreignField: "_id",
                    as: "userDetail" 
                }
            },
            {
                $unwind: "$userDetail"
            }
        ])
        res.status(200).json({
            message: "Task fetch succesfully!",
            data: usersData
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

//  get task detail
exports.getTaskDetail = async (req, res) => {
    const {  taskId } = req.body;
    if(!taskId){
        return res.status(422).json({ message: `Please Send taskId` });
    }
    try {
        const usersData = await Task.findById(taskId);
        res.status(200).json({
            message: "task detail fetch succesfully!",
            data: usersData
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

// add User
exports.addUser = async (req, res) => {
    const { email, name } = req.body;

    if (!name || !email) {
        return res.status(422).json({ message: `Please fill all the field` });
    }

    try {
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(422).json({ message: `Email already exist !!` });
        } else {
            const password=Math.floor(Math.random() * 1000000000).toString();
            console.log('------password-',password)
            req.body.password = await bcrypt.hash(password, 10);
            const user = new User(req.body);
            await user.save();
            res.status(201).json({ message: 'User created successfully' });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Delete User
exports.deleteUser = async (req, res) => {
    const {  userId } = req.body;
    if(!userId){
        return res.status(422).json({ message: `Please Send userID` });
    }
    try {
        const deleteuser = await User.deleteOne({_id: userId});
        res.status(200).json({
            message: "user delete succesfully!",
            data: deleteuser
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}

// get User


// get User
exports.getUsers = async (req, res) => {

    try {
        const usersData = await User.find().select("name email")
        res.status(200).json({
            message: "Users fetch succesfully!",
            data: usersData
        });
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({
            message: error
        });
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////
//











// update user status

exports.userstatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const userstatusupdate = await Task.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        res.status(200).json(userstatusupdate)
    } catch (error) {
        res.status(401).json(error)
    }
}
