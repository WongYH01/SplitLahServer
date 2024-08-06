import {supabase} from "../hooks/supabase.js";

export class User {
    constructor(inputUserID) {
        this.userID = inputUserID;
    }

    // Retrieves details of all groups the user is a member in
    async getGroupDetailsBasedOnUserID() {
        const {data,error} = await supabase
            .from('user_group')
            .select("group_id, group (group_id, group_name, description, no_of_people, currency)")
            .eq('user_id', this.userID);
        if (error){
            console.log(error);
            return null;
        }
        else {
            return data;
        }
    }

    // Get all details of user based on user ID
    async getUserDetails() {
        const {data,error} = await supabase
            .from('user')
            .select()
            .eq('user_id',this.userID);
        if (!error){
            console.log(error);
            return data;
        }
        else {
            return null;
        }
    }

    //Retrieves username based on user ID
    async getUserName() {
        const { data, error } = await supabase
            .from('user')
            .select('user_name')
            .eq('user_id', this.userID);
        if (error) {
            console.log(error);
            return null; // or throw error, depending on your app's requirements
        } else {
            return data[0].user_name; // return the user_name string
        }
    }
}