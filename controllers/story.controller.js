import {StoryModel} from '../models/story.model.js';
import {UserModel} from '../models/user.model.js';
import {MediaModel} from '../models/media.model.js';

export const getAllStories = async (req, res) =>{
    try {
        const story = await StoryModel.find();
        res.status(200).json(story);
    }   
    catch (err) {
        res.status(500).json({error: err});
    }
}
export const getStoriesByUser = async(req, res) => {
    try {
        const data = req.body;
        const storiesList = await getStories(data.IDUser);
        // const data = req.params.id;
        // const storiesList = await getStories(data);
        return res.status(200).json({storiesList: storiesList});
    } catch (error) {
        return res.status(500).json({error: error}) 
    }
}


const getStories = async(IDUser) => {
    // console.log(IDUser);
    const result = await StoryModel.find({IDUser: IDUser});
    // console.log('result', result);
    const user = await UserModel.find({ID: IDUser});
    const media = await MediaModel.find({IDUser: IDUser})
    // console.log('users', users);
    const storiesList = [];
    result.map((i) => {
        // console.log('story list', i);
        // console.log('user i', user);
        const IDS = i.ID;
        const mediaStory = media.find(m => m.IDStory.toString() === IDS);
        // console.log('mediaStory', mediaStory);
        let story = {};
        story.ID = i.ID;
        story.IDUser = i.IDUser;
        story.UserName = user[0].Name;
        story.Content = i.Content;
        if (mediaStory !== undefined) {
            const obj = {
                Type: mediaStory.Type,
                Src: mediaStory.Src
            }
            story.Media = obj;
        } else {
            story.Media = {};
        }
        story.Date = i.Date;
        story.Time = i.Time;
        // console.log('story', story, user[0].Name);
        storiesList.push(story);
    });
    // console.log('finish');
    return storiesList;
}