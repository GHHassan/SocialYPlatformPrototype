import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';
import CreateProfile from './CreateProfile';
import { useState } from 'react';

const Home = (props) => {
    // props.setReloadPage(true);
    const [isDropdownVisible, setDropdownVisibility] = useState(false);

    if(!props.user || props.user.userID == null){

        return (
            <CreateProfile 
                {...props}
                isDropdownVisible={isDropdownVisible}
                setDropdownVisibility={setDropdownVisibility}    
            />
        )
    }

    return (
       <>
       <CreatePost 
        {...props}
        isDropdownVisible={isDropdownVisible}
        setDropdownVisibility={setDropdownVisibility}
        />

        <Post {...props}
        />
       </>
    );
}

export default Home;
