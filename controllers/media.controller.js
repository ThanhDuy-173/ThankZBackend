import {MediaModel} from '../models/media.model.js';
import {UserModel} from '../models/user.model.js';
export const getAllMedias = async (req, res) =>{
    try {
        const media = await MediaModel.find();
        res.status(200).json(media);
    }   
    catch (err) {
        res.status(500).json({error: err});
    }
}

export const getMediaByUser = async(req, res) => {
    try {
        const data = req.body;
        // const data = req.params.id;
        // const mediaList = await getMedia(data);
        const mediaList = await getMedia(data.IDUser);
        return res.status(200).json({mediaList: mediaList});
    } catch (error) {
        return res.status(500).json({error: error}) 
    }
}


const getMedia = async(IDUser) => {
    const result = await MediaModel.find({IDUser: IDUser});
    const user = await UserModel.find({ID: IDUser});
    const mediaList = [];
    result.map((i) => {
        let media = {};
        media.ID = i.ID;
        media.IDUser = i.IDUser;
        media.UserName = user[0].Name;
        media.Type = i.Type;
        media.Src = i.Src;
        media.Date = i.Date;
        media.Time = i.Time;
        // console.log('story', story, user[0].Name);
        mediaList.push(media);
    });
    // console.log('finish');
    return mediaList;
}