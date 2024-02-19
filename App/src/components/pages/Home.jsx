import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';


const Home = (props) => {

    return (
       <>
       <CreatePost
            signedIn={props.signedIn}
            userID={props.userID}
        />
        <Post />
       </>
    );
}

export default Home;
