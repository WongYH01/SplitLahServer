import {supabase} from "../hooks/supabase.js";

export class Group{
    constructor(inputGroupID) {
        this.groupID = inputGroupID;
    }

    //  Select all based on group id
    async getGroupDetails() {
        const {data,error} = await supabase
            .from('group')
            .select()
            .eq('group_id',this.groupID);
        if (error){
            console.log(error);
            return null;
        }
        else {
            return data;
        }
    }

    // Select all Bills based on GID
    async getBillsBasedOnGroup() {
        const {data,error} = await supabase
            .from('bill')
            .select('bill_id, name, date, amount')
            .eq('group_id',this.groupID);
        if (error){
            console.log(error);
            return null;
        }
        else {
            return data;
        }
    }

    // Update group occupancy by 1
    async updateOccupancyBy1(){
        const currentGroup = await this.getGroupDetails();
        const currentCount = currentGroup[0].no_of_people;
        const { data, error } = await supabase
            .from('group')
            .update({ no_of_people: currentCount+1 })
            .eq('group_id', this.groupID);
        if (!error){
            return true;
        }
        else {
            console.log(error);
            return false;
        }
    }

    // Create new bill based on the group ID
    async createBillUsingGroupID(jsonBodyRequest) {
        const {data,error} = await supabase
            .from('bill')
            .insert({
                amount : jsonBodyRequest.inputAmount,
                name : jsonBodyRequest.inputName,
                date : jsonBodyRequest.inputDate,
                user_id : jsonBodyRequest.inputUserID,
                group_id : this.groupID
            })
            .select('bill_id');
        if (error){
            console.log(error);
            return null;
        }
        else {
            return data[0].bill_id;
        }
    }

    // Get user IDs based on group ID
    async getUserIdsByGroupId() {
        const { data, error } = await supabase
            .from('user_group')
            .select('user_id')
            .eq('group_id', this.groupID);

        if (error) {
            throw error;
        }

        return data.map(row => row.user_id);
    }

    // Get user names based on array of user IDs
    async getUserNamesByUserIds(userIdArray) {
        const { data, error } = await supabase
            .from('user')
            .select('user_id, user_name')
            .in('user_id', userIdArray);

        if (error) {
            throw error;
        }

        return data;
    }

    // Get user names based on group ID
    async getUsersBasedOnGroup() {
        const userIds = await this.getUserIdsByGroupId();

        if (userIds.length === 0) {
            return [];
        }

        const userData = await this.getUserNamesByUserIds(userIds);

        return userData;
    }

    // Update group details based on id
    async updateGroupDetails(jsonBodyRequest) {
        const {data,error} = await supabase
            .from('group')
            .update([
                { group_name: jsonBodyRequest.groupName, description: jsonBodyRequest.groupDescription, currency: jsonBodyRequest.groupCurrency }
            ])
            .eq('group_id', this.groupID);
        if (error){
            console.log(error);
            return false;
        }
        else {
            return true;
        }

    }
}