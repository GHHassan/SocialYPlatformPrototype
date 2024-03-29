import { useAppState } from "../../contexts/AppStateContext";


export default fetchData = async () => {
    const { dispatch } = useAppState();
    try {
        const response = await fetch(`${API_ROOT}/post`);
        const data = await response.json();
        if (data.message === "success") {
            delete data.message;
            dispatch({ type: "SET_POSTS", payload: data });
            console.log("POSTS FROM APPS", data);
        } else if (data.message === "failed or no post found ") {
            dispatch({ type: "SET_POSTS", payload: { posts: "No Post found" } });
        }

    } catch (error) {
        toast.error("Error getting posts");
    }

    return(
        <div>
        </div>
    )
}