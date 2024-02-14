import React, { useState, useEffect } from 'react';

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts',
            { method: "GET" });

            const data = await res.json();
            setPosts(data);
            setLoading(false);
        }
        fetchPosts();
    }, []);
    
    return (
        <div>
            {loading ? <h1>Loading...</h1> :
                <div >
                    <h1 className='text-5xl'>HOME</h1>
                    {posts.map((post) => (
                        <div key={post.id} className=' bg-slate-500 border-2 round-'>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default Home;
