import {supabase} from "../hooks/supabase.js";

export class Bill{
    constructor(inputBillID){
        this.billID = inputBillID;
    }

    //  Select all info based on billID
    async getBillDetails() {
        const {data,error} = await supabase
            .from('bill')
            .select()
            .eq('bill_id',this.billID);
        if (error){
            return null
        }
        else {
            return data;
        }
    }

    //Select the bill owner's ID
    async getBillOwnerID() {
        const { data, error } = await supabase
            .from('bill')
            .select('user_id')
            .eq('bill_id', this.billID);
        if (error) {
            return null; // Return null on error
        } else {
            return data.length > 0 ? data[0].user_id : null; // Return the first user ID or null if no data
        }
    }

    //Selects a name using a given user_id
    async getBillOwnerName(inputUserID) {
        const { data, error } = await supabase
            .from('user')
            .select('user_name')
            .eq('user_id', inputUserID);
        if (error) {
            return null; // Return null on error
        } else {
            return data.length > 0 ? data[0].user_name : null; // Return the user name or null if no data
        }
    }

    // Combination of functions (getBillOwnerID, getBillOwnerName) to get the Bill Owner's name
    async getBillOwnerNameViaBillID() {
        try {
            const userId = await this.getBillOwnerID();

            if (userId == null) {
                return null; // Return null if no user ID is found
            }
            const userData = await this.getBillOwnerName(userId);
            return userData;
        } catch (error) {
            return null; // Return null on unexpected error
        }
    }

    //  Select all participants names based on an array of userIDs
    async getBillParticipantsUsingUserIds(userIds) {
        const {data,error} = await supabase
            .from('user')
            .select('user_name, user_id')
            .in('user_id', userIds);
        if (error){
            return null;
        }
        else {
            // console.log(data);
            return data;
        }
    }

    //  Select all participants based on billID
    async getBillParticipantsUsingBillId() {
        const {data,error} = await supabase
            .from('bill_participant')
            .select('user_id')
            .eq('bill_id',this.billID);
        if (error){
            return [];
        }
        else {
            return data.map(row => row.user_id);
        }
    }

    // Combination of functions (getBillParticipantsUsingBillId, getBillParticipantsUsingUserIds) to get all bill participants' names
    async getBillParticipantsNames() {
        const userIds = await this.getBillParticipantsUsingBillId();

        if (userIds.length === 0) {
            return [];
        }

        const userData = await this.getBillParticipantsUsingUserIds(userIds);
        return userData;
    }

    // Stores bill participants in the relevant table
    async StoreBillParticipants(userIds) {
        // Prepare the data to be inserted
        const dataToInsert = userIds.map(userId => ({
            user_id: userId,
            bill_id: this.billID
        }));
        const { error } = await supabase
            .from('bill_participant')
            .insert(dataToInsert); // Insert multiple rows
        if (error) {
            console.log(error.message);
            return false;
        } else {
            return true;
        }
    }

    // Updates the relevant using the Bill ID
    async updateBillUsingBillID(jsonBodyRequest) {
        "amount, name, date, paidByUserId"
        var amount = jsonBodyRequest.amount;
        var name = jsonBodyRequest.name;
        var date = jsonBodyRequest.date;
        var paidByUserId = jsonBodyRequest.paidByUserId;
        const { data, error } = await supabase
            .from('bill')
            .update({ amount, name, date, user_id: paidByUserId })
            .eq('bill_id', this.billID);

        if (error) {
            console.error('updateBillUsingBillID error:', error.message);
            return false;
        }
        return true; // Return true if update was successful
    }

    // Deletes all entries in the 'bill_participant' table associated with the given Bill ID
    async deleteBillParticipants() {
        const { data, error } = await supabase
            .from('bill_participant')
            .delete()
            .eq('bill_id', this.billID); // Ensure we are deleting entries matching bill_id

        if (error) {
            console.log(error.message);
            return false;
        } else {
            return true;
        }
    }
}

