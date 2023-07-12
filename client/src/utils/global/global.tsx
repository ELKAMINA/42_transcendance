import api from "../Axios-config/Axios";
import { transformData } from "../../pages/userProfile";
import { UserDetails } from "../../types/users/userType";

function replacer(key: string, value: any) {
	if (typeof value === 'object' && value !== null) {
	  // Convert nested objects to readable strings
	  return JSON.stringify(value);
	}
	return value;
  }

export async function FetchUserByName(name: string ): Promise<Object> {
	const result = await api
		.get('http://localhost:4001/user/userprofile', {
			params: {
				ProfileName: name,
			}
		})
		.then((res) => {
			// console.log('res.data ', res.data )
			// const params =  new URLSearchParams(res.data)
            // const userData: any =  transformData(params)
			// console.log("blocked ",userData)
			return res.data
		})
		.catch((e) => {
			console.log('ERROR from request with params ', e)
			return e;
		})
	return result;
}
