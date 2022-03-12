import {UserModel} from '../models/user.model.js';
import bcrypt from 'bcrypt'
import emailCheck from "email-check";
import nodemailer from "nodemailer";
import generator from 'generate-password';
import dotenv from 'dotenv';
dotenv.config();
const salt = await bcrypt.genSalt(11);
export const getAllUsers = async (req, res) =>{
    try {
        const user = await UserModel.find();
        res.status(200).json(user);
    }   
    catch (err) {
        res.status(500).json({error: err});
    }
}

export const login = async (req, res) => {
    try{
        const {Email, Password, Type} = req.body;
        // const user = await UserModel.findOne({Email: Email, Type: Type});
        const user = await UserModel.findOne({ $and: [{ Email: Email}, { Type: Type }] });
        // console.log(user);
        if (user===null) {
            return res.status(400).json({message: "Email not found"});
        }
        const match = (await bcrypt.compareSync(Password, user.Password));
        if (!match)  return res.status(400).json({message: "Password incorrect"});
        // if (!(Password === user.Password))  return res.status(400).json({message: "Password incorrect"});
        let data = {};
        data.ID = user.ID;
        data.Name= user.Name;
        data.Email = user.Email;
        data.DoB = user.DoB;
        data.Avatar = user.Avatar;
        data.Type = user.Type;
        // console.log('data',data);
        res.status(200).json({ message: "Login successfully.",data});
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}
export const checkLogin = async (req, res) => {
    try{
        const data = req.body;
        const checkDataUser = await checkUser(data.IDUser);
        if (checkDataUser===false) return res.status(500).json({message: "User not found"});
        return res.status(200).json({message: "login ok"});
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}

export const checkUser = async(IDUser)=>{
    const user = await UserModel.find({ID: IDUser.toString()})
    if (user.length===0)  return false;
    return true;
}

export const register = async function (req, res) {
    try{
        const userRes = req.body;
        // console.log(userRes.User.ID, userRes.Type);
        const userCheck = await UserModel.find({ $and: [{ Email:  userRes.User.Email}, { Type: userRes.Type }] });
        if (userCheck.length > 0) {
            return res.status(400).json({message: "Email has been used"});
        }
        // const checkMail = await emailCheck('thanhduyking1703@gmail.com');
        // console.log(checkMail);
        // if (checkMail===false) {return res.status(400).json({message: "Please! Check again... Email doesn't exist"});}
        const password = await bcrypt.hashSync(userRes.User.Password, salt);
        const data= {};
        data.ID = userRes.User.ID;
        data.Name= userRes.User.Name;
        data.Email= userRes.User.Email;
        data.Password = password;
        data.DoB= userRes.User.DoB;
        data.Avatar=userRes.User.Avatar;
        data.Type=userRes.Type;
        const newUser = new UserModel(data);
        await newUser.save();
        const userNew = await UserModel.find({ $and: [{ Email:  userRes.User.Email}, { Type: userRes.Type }] });
        // console.log(userNew);
        // await newMessage(userNew.User.ID,"","Welcome to ThankZ");
        return res.status(200).json({message: "Create successfully", user: {ID: data.ID,Name: data.Name,Email: data.Email, DoB: data.DoB, Avatar: data.Avatar}});
    } catch (err){
        if (err.message === 'refuse') {
            return res.status(400).json({message: "Can't connect this email"});
        }
        return res.status(500).json({error: err});
    }
}
export const updateUser = async (req, res) => {
    try{
        const {ID, Name, Avatar, Password} = req.body;
        const user = await UserModel.findOne({ID: ID});
        if (user===null) return res.status(404).json({message: "User not found"});
        const updateUser = {};
        if(Name !== "") updateUser.Name = Name;
        if(Avatar !== "") updateUser.Avatar = Avatar;
        if(Password.old !== ""){
            const match = (await bcrypt.compareSync(Password.old, user.Password));    
            if (!match)  return res.status(400).json({message: "Password incorrect"});
            const password = await bcrypt.hashSync(Password.new, salt);
            if(Password.new !== "") updateUser.Password = password
        }
        await UserModel.updateOne({ID: ID}, updateUser)
        const newData = await getUserData(ID);
        res.status(200).json({ message: "Update successfully.", data: newData});
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}
const getUserData= async(ID)=>{
    const user = await UserModel.findOne({ID: ID});
    const data = {};
    data.ID = user.ID;
    data.Name= user.Name;
    data.Email = user.Email;
    data.DoB = user.DoB;
    data.Avatar = user.Avatar;
    data.Type = user.Type;
    return data;
}

export const sendEmailUser = async (req, res) => {
    try{
        const {Email} = req.body;
        const user = await UserModel.findOne({ $and: [{ Email: Email}, { Type: "Web" }] });
        const ID = user.ID;
        if (user===null) return res.status(404).json({message: "User not found"});
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        let mailOptions = {
            from: 'seokhumuivietnam@gmail.com',
            to: Email,
            subject: 'Reset Password',
            text: `The new password of your account is ${password} . Please do not share this email outside to ensure the safety of your account! Thank you`
        }
        transporter.sendMail(mailOptions, function(err, data) {
            if(err) {
                console.log('Error: ', err);
            } else {
                const result = resetUser(ID, password)
                console.log('Email send successfully and reset password');
            }
        })
        res.status(200).json({ message: "Send Email successfully."});
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}
const resetUser= async(ID, password)=>{
    const resetUser = {};
    resetUser.Password = await bcrypt.hashSync(passwordReset, salt);
    const result = await UserModel.updateOne({ID: ID}, resetUser)
    return result;
}