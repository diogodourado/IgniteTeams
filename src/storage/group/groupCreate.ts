import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { groupsGetAll } from "./groupsGetAll";
import { GROUP_COLLECTION } from "@storage/storageConfig";

export async function groupCreate(NewGroup: string) {
    try {

        const storedGroups = await groupsGetAll();

        const groupAlreadyExists = storedGroups.includes(NewGroup);

        if (groupAlreadyExists) {
            throw new AppError('Já existe um grupo cadastrado com este nome.')
        }


        const storage = JSON.stringify([...storedGroups, NewGroup]);
        await AsyncStorage.setItem(GROUP_COLLECTION, storage);

    } catch (error) {
        throw error;
    }
}