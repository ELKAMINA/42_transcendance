import { UserLeaderBoard, UserModel } from "../../types/users/userType";
import api from "../Axios-config/Axios";

function replacer(key: string, value: any) {
    if (typeof value === "object" && value !== null) {
        // Convert nested objects to readable strings
        return JSON.stringify(value);
    }
    return value;
}

export async function FetchUserByName(name: string): Promise<UserModel> {
    const result = await api
        .get("http://localhost:4001/user/userprofile", {
            params: {
                ProfileName: name,
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            console.log("ERROR from request with params ", e);
            return e;
        });
    return result;
}
