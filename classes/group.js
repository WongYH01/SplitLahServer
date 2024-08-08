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
                { group_name: jsonBodyRequest.groupName, description: jsonBodyRequest.groupDescription, currency: jsonBodyRequest.np }
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

    // Get balance info based on group id
    async getBalanceBasedOnGroup(){
        const { data, error } = await supabase
            .from('balance')
            .select('debtor_id, creditor_id, amount')
            .eq('group_id', this.groupID);
        if (error) {
            console.error(error);
            return [];
        }
        return data;
    }

    // Get previous messages of the group
    async getPreviousMessagesBasedOnGroup(){
        const {data, error} = await supabase
            .from('group_chat')
            .select()
            .eq('group_id',this.groupID)
            .order('time_stamp', {ascending: true});
        if(!error){
            return data;
        }
        else {
            return null;
        }
    }

    // Creates row in group_chat
    async postMessageInGroup(jsonBodyRequest){
        var inputUserID = jsonBodyRequest.inputUserID;
        var inputMessage = jsonBodyRequest.inputMessage;

        const { error } = await supabase
            .from('group_chat')
            .insert({ user_id: inputUserID,group_id:this.groupID,message:inputMessage})
        return !error;
    }

    // Creates rows in user_group
    async postUserGroup(jsonBodyRequest){
        const { error } = await supabase
            .from('user_group')
            .insert([
                { user_id: jsonBodyRequest.userID, group_id: this.groupID }
            ])
        return !error;
    }

    // Checks if user is already in group
    async checkUserNotInGroup(jsonBodyRequest){
        var inputUserID = jsonBodyRequest.userID;
        const {count,error} = await supabase
            .from('user_group')
            .select('*',{count:'exact',head: true})
            .eq('group_id',this.groupID)
            .eq('user_id',inputUserID);
        if (!error){
            return count === 0;
        }
        else {
            return false
        }
    }
}