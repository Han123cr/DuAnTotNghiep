import { API_Url } from "../../tsconfig.json"

const loginByName = async(loginName: string) => {
    const res = await fetch(`${API_Url}/loginName`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({loginName}),
        credentials: 'include',
    });
    if(!res.ok){
        throw new Error((await res.json()).message);
    }
    return await res.json();
}

const loginByPassword = async (password: string) => {
    const res = await fetch(`${API_Url}/loginPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({password}),
        credentials: 'include',
    });
    if(!res.ok){
        throw new Error((await res.json()).message);
    }
    return await res.json();
}

export {loginByName, loginByPassword};