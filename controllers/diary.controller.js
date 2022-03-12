import {DiaryModel} from '../models/diary.model.js';
import {StoryModel} from '../models/story.model.js';
import {UserModel} from '../models/user.model.js';
import {MediaModel} from '../models/media.model.js';
export const getAllDiaries = async (req, res) =>{
    try {
        const diary = await DiaryModel.find();
        res.status(200).json(diary);
    }   
    catch (err) {
        res.status(500).json({error: err});
    }
}

export const getDiariesByUser = async(req, res) => {
    try {
        const data = req.body;
        // const data = req.params.id;
        // const diariesList = await getDiaries(data);
        const diariesList = await getDiaries(data.IDUser);
        return res.status(200).json({diariesList: diariesList});
    } catch (error) {
        return res.status(500).json({error: error}) 
    }
}


const getDiaries = async(IDUser) => {
    const result = await DiaryModel.find({IDUser: IDUser});
    const stories = await StoryModel.find({IDUser: IDUser});
    const user = await UserModel.find({ID: IDUser});
    const media = await MediaModel.find({IDUser: IDUser});
    const diariesList = [];
    result.map((i) => {
        const IDS = i.IDDiary;
        const Type = i.Type;
        let diary = {};
        diary.ID = i.ID;
        diary.IDUser = i.IDUser;
        diary.UserName = user[0].Name;
        diary.Type = i.Type;
        diary.Date = i.Date;
        if(Type === 'story'){
            let storyDiary = stories.find(m => m.ID.toString() === IDS);
            const mediaStory = media.find(m => m.IDStory.toString() === IDS);
            if (mediaStory !== undefined) {
                const obj = {
                    Type: mediaStory.Type,
                    Src: mediaStory.Src
                }
                storyDiary = {
                    _id: storyDiary._id,
                    ID: storyDiary.ID,
                    IDUser: storyDiary.IDUser,
                    Content: storyDiary.Content,
                    Date: storyDiary.Date,
                    Time: storyDiary.Time,
                    createdAt: storyDiary.createdAt,
                    updatedAt: storyDiary.updatedAt,
                    __v: storyDiary.__v,
                    Media: obj
                }
            }
            diary.Content = storyDiary;
        } else if(Type === 'media') {
            const mediaDiary = media.find(m => m.ID.toString() === IDS);
            diary.Content = mediaDiary;
        } else diary.Content = {};
        // console.log('story', story, user[0].Name);
        diariesList.push(diary);
    });
    // console.log('finish');
    return diariesList;
}

export const addDiary = async function (req, res) {
    try{
        const diaryRes = req.body;
        let idUser;
        let date;
        let time;
        if(Object.keys(diaryRes.Story).length){
            idUser = diaryRes.Story.IDUser;
            date = diaryRes.Story.Date;
            time = diaryRes.Story.Time;
        } else {
            idUser = diaryRes.Media.IDUser;
            date = diaryRes.Media.Date;
            time = diaryRes.Media.Time;
        }
        const diaries = await DiaryModel.find({IDUser: idUser});
        const stories = await StoryModel.find({IDUser: idUser});
        const media = await MediaModel.find({IDUser: idUser});
        let maxDiary = 0;
        let maxStory = 0;
        let maxMedia = 0;
        diaries.map(d => (
            maxDiary = maxDiary <= d.ID*1 ? d.ID*1 + 1 : maxDiary
        ))
        stories.map(s => (
            maxStory = maxStory <= s.ID*1 ? s.ID*1 + 1 : maxStory
        ))
        media.map(m => (
            maxMedia = maxMedia <= m.ID*1 ? m.ID*1 + 1 : maxMedia
        ))
        let type = 'story';
        let idDiary = maxStory;
        let idStory = "";
        if(diaryRes.Type === 'Media') {
            type = 'media';
            idDiary = maxMedia;
        };
        if(diaryRes.Type === 'StoryMedia') {
            idStory = maxStory;
        }
        // add story
        if(Object.keys(diaryRes.Story).length){
            const dataStory = {};
            dataStory.ID = maxStory;
            dataStory.IDUser= idUser;
            dataStory.Content= diaryRes.Story.Content;
            dataStory.Date = date;
            dataStory.Time= time;
            const newStory = new StoryModel(dataStory);
            await newStory.save();
            const checkStory = await StoryModel.find({ID: dataStory.ID});
            if(!checkStory.length) return res.status(400).json({message: "Upload failed. Please try again later!"});
        }
        // add media
        if(Object.keys(diaryRes.Media).length) {
            const dataMedia = {}
            dataMedia.ID = maxMedia;
            dataMedia.IDUser = idUser;
            dataMedia.IDStory = idStory;
            dataMedia.Type = diaryRes.Media.type;
            dataMedia.Src = diaryRes.Media.URLs;
            dataMedia.Date = date;
            dataMedia.Time= time;
            const newMedia = new MediaModel(dataMedia);
            await newMedia.save();
            const checkMedia = await MediaModel.find({ID: dataMedia.ID});
            if(!checkMedia.length) return res.status(400).json({message: "Upload failed. Please try again later!"});
        }
        // add diary
        const dataDiary = {};
        dataDiary.ID = maxDiary;
        dataDiary.IDUser = idUser;
        dataDiary.Type = type;
        dataDiary.IDDiary = idDiary;
        dataDiary.Date = date;
        const newDiary = new DiaryModel(dataDiary);
        await newDiary.save();
        const checkDiary = await DiaryModel.find({ID: dataDiary.ID});
        if(!checkDiary.length) return res.status(400).json({message: "Upload failed. Please try again later!"});
        return res.status(200).json({message: "Create successfully"});
    } catch (err){
        return res.status(500).json({error: err});
    }
}

export const updateDiary = async function (req, res) {
    try{
        const diaryRes = req.body;
        // const story = await StoryModel.find({ID: diaryRes.IDDiary});
        // const media = await MediaModel.find({IDStory: diaryRes.IDDiary});
        const newContent = {};
        newContent.Content = diaryRes.Content;
        const newMedia = {};
        newMedia.Src = diaryRes.Media
        // console.log({story, media});
        diaryRes.Type.some(type => type === "Content") && (
            await StoryModel.updateOne({ $and: [{ ID:  diaryRes.IDDiary}, { IDUser: diaryRes.IDUser }] }, newContent)
        );
        diaryRes.Type.some(type => type === "StoryMedia") && (
            await MediaModel.updateOne({ $and: [{ IDStory:  diaryRes.IDDiary}, { IDUser: diaryRes.IDUser }] }, newMedia)
        );
        diaryRes.Type.some(type => type === "DeleteStoryMedia") && (
            await MediaModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { IDStory: diaryRes.IDDiary }] })
        );
        diaryRes.Type.some(type => type === "DeleteMedia") && (
            await MediaModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { ID: diaryRes.IDDiary }, {Type: "media"}] })
        );
        diaryRes.Type.some(type => type === "Media") && (
            await MediaModel.updateOne({ $and: [{ ID:  diaryRes.IDDiary}, { IDUser: diaryRes.IDUser }] }, newMedia)
        );
        return res.status(200).json({message: "Update successfully"});
    } catch (err){
        return res.status(500).json({error: err});
    }
}

export const deleteDiary = async function (req, res) {
    try{
        const diaryRes = req.body;
        if(diaryRes.Type === "Story") {
            await DiaryModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { IDDiary: diaryRes.IDDiary }, {Type: "story"}] });
            await StoryModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { ID: diaryRes.IDDiary }] });
            await MediaModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { IDStory: diaryRes.IDDiary }] });
        }
        if(diaryRes.Type === "Media") {
            await DiaryModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { IDDiary: diaryRes.IDDiary }, {Type: "media"}] });
            await MediaModel.deleteOne({ $and: [{ IDUser:  diaryRes.IDUser}, { ID: diaryRes.IDDiary }] });
        }
        return res.status(200).json({message: "Delete successfully"});
    } catch (err){
        return res.status(500).json({error: err});
    }
}