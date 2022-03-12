import {notificationModel} from "../models/notifications.model.js"
import {postHistoryModel} from '../models/postHistorys.model.js'
import {commentModel} from '../models/comments.model.js'

export const newMessage = async (userID, adminID, message) => {
    try {
        const noti={};
        noti.userID = userID;
        noti.postID = adminID;
        noti.message = message;
        noti.type=1;
        noti.readed=false;
        noti.data=0;
        const newNoti = new notificationModel(noti);
        await newNoti.save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const postAcceptNoti =  async (message,data,postID,userID) => {
    try {
        const noti={};
        noti.userID = userID;
        noti.postID = postID;
        noti.message = message;
        noti.type=2;
        noti.readed=false;
        noti.data=data;
        const newNoti = new notificationModel(noti);
        await newNoti.save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
}
export const postLikeNoti = async (userID, postID)=>{
    try {
        const result = await notificationModel.find({postID: postID, readed: false, type: 3, userID: userID});
        const result2 = await postHistoryModel.find({postID: postID, liked: true})
        if (result.length === 0)
        {
            const noti={};
            noti.userID = userID;
            noti.postID = postID;
            noti.message = 'like';
            noti.type=3;
            noti.readed=false;
            noti.data = result2.length;
            const newNoti = new notificationModel(noti);
            await newNoti.save();
            return true;
        }
        else
        {
            const noti = result[0];
            const update = await notificationModel.updateOne({_id: noti._id.toString()},{data: result2.length});  
            return true;    
        } 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const postCommentNoti = async (userID, postID)=>{
    try {
        const result = await notificationModel.find({postID: postID, readed: false, type: 4, userID: userID});
        const result2 = await commentModel.find({focusID: postID,type: 2});
        if (result.length === 0)
        {
            const noti={};
            noti.userID = userID;
            noti.postID = postID;
            noti.message = 'comment';
            noti.type=4;
            noti.readed=false;
            noti.data=result2.length;
            const newNoti = new notificationModel(noti);
            await newNoti.save();
            return true;
        }
        else
        {
            const noti = result[0];
            const update = await notificationModel.updateOne({_id: noti._id.toString()},{data: result2.length});  
            return true;    
        } 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}