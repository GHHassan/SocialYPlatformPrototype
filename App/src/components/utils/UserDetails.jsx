

export const UserDetails = async () => {
    try {
        let userID = '';
        if (localStorage.getItem('token') !== null) {
            const token = localStorage.getItem('token');
            userID = jwtDecode(token).sub;
        }
        const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/profile?userID=' + userID);
        const data = await response.json();
        console.log(data.json());
        if (data.message === 'success') {
            console.log("user" + data[0]);
            return data[0];
        }
    }
    catch (error) {
        console.log('Error:', error);
    } 
}

