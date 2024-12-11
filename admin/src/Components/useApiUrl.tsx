const useApiUrl = () => {
    // Lấy URL hiện tại
    const url = window.location.href;
    // Tách phần đường dẫn
    const path = new URL(url).pathname;
    // Lấy phần đầu tiên sau dấu "/"
    const admin = path.split('/')[1]; // Lấy phần đầu tiên
    // console.log("admin", admin);

    // Hàm trả về URL đã được xây dựng
    const getApiUrl = () => {
        if (!admin) throw new Error("Admin parameter is missing in the URL.");
        return `https://api.savory.website/${admin}`;
    };

    const APIURL = getApiUrl();
    return {APIURL};
};

export default useApiUrl;
