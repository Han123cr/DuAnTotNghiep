import useApiUrl from "../Components/useApiUrl"

const loginByName = async(loginName: string, APIURL: string) => {
    const res = await fetch(`${APIURL}/loginName`, {
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
    return {
        data: res.json(),
        status: res.status
    } 
}

const loginByPassword = async (password: string, APIURL: string) => {
    const res = await fetch(`${APIURL}/loginPassword`, {
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
    return {
        data: res.json(),
        status: res.status
    }
}

const useLogin = () => {
    const {APIURL} = useApiUrl();
    const handleLoginByName = (loginName: string) => loginByName(loginName, APIURL);
    const handleLoginByPassWord = (password: string) => loginByPassword(password, APIURL);

    return {handleLoginByName, handleLoginByPassWord}
}

export {useLogin};