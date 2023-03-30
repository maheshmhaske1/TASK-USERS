const user = require('../model/userModel')
const JWT = require('../middleware/auth')
const { default: mongoose } = require('mongoose')
var validator = require('validator');

// Create user api
exports.createUser = async (req, res) => {
    const { name, email, mobile, password } = req.body

    if (!name || !email || !mobile || !password) {
        return res.json({
            status: false,
            message: "name,email,mobile,password are required fields"
        })
    }

    if (!validator.isEmail(email)) {
        return res.send({
            status: false,
            message: "please enter valid email"
        })
    }

    if (mobile.length !== 10) {
        return res.send({
            status: false,
            message: "please enter valid mobile number"
        })
    }

    const isUserExists = await user.findOne({
        $or: [
            { email: email },
            { mobile: mobile }
        ]
    })

    if (isUserExists) {
        return res.json({
            return: false,
            message: "user with this mobile or email already exists"
        })
    }

    await new user({
        name: name,
        email: email,
        mobile: `+91${mobile}`,
        password: password,
        token: ''
    })
        .save()
        .then(async (success) => {
            const token = await JWT.generate_token_user(success._id, name)

            await user.findByIdAndUpdate(
                { _id: success._id },
                {
                    $set: { token: token }
                },
                { returnOriginal: false }
            )
                .then((user) => {
                    return res.json({
                        status: true,
                        message: "user created",
                        data: user
                    })
                })
                .catch((error) => {
                    return res.json({
                        status: true,
                        message: "something went wrong", error
                    })
                })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong", error
            })
        })
}

// GetAll user api
exports.getAll = async (req, res) => {
    await user.find()
        .then((success) => {
            return res.json({
                status: true,
                message: "users detail",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong", error
            })
        })
}

// Get user byId api
exports.get = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.json({
            status: false,
            message: "please provide id"
        })
    }

    const isUserExist = await user.findOne({ _id: id })
    if (isUserExist == null) {
        return res.json({
            status: false,
            message: "please provide valid userId"
        })
    }

    await user.findById({ _id: id })
        .then((success) => {
            return res.json({
                status: true,
                message: "users detail",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong", error
            })
        })
}

// Update user api
exports.update = async (req, res) => {
    const { id } = req.params
    const { name, email, mobile } = req.body

    if (!id || !name || !email || !mobile) {
        return res.json({
            status: false,
            message: "id, name, email, mobile are required fields"
        })
    }

    const isUserExist = await user.findOne({ _id: id })
    if (isUserExist == null) {
        return res.json({
            status: false,
            message: "please provide valid userId"
        })
    }

    if (!validator.isEmail(email)) {
        return res.send({
            status: false,
            message: "please enter valid email"
        })
    }

    if (mobile.length !== 10) {
        return res.send({
            status: false,
            message: "please enter valid mobile number"
        })
    }
    

    await user.findOneAndUpdate(
        { _id: id },
        {
            $set:
            {
                name: name,
                email: email,
                mobile: mobile
            }
        },
        { returnOriginal: false }
    )
        .then((success) => {
            return res.json({
                status: true,
                message: "users details updated",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong", error
            })
        })
}

// Delete user api
exports.delete = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.json({
            status: false,
            message: "userId is required fields"
        })
    }

    const isUserExist = await user.findOne({ _id: id })
    if (isUserExist == null) {
        return res.json({
            status: false,
            message: "please provide valid userId"
        })
    }

    await user.findByIdAndDelete({ _id: id })
        .then((success) => {
            return res.json({
                status: true,
                message: "users details deleted",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong", error
            })
        })
}