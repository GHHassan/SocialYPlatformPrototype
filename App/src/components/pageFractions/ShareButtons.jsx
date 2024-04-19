/**
 * share buttons for social media
 * 
 * This component is used to provide user friendly UI buttons to 
 * enable users share the post on social media platforms like Twitter,
 *  WhatsApp, and copy the link to the clipboard.
 * this is also a place if the application is extended to include
 * more social media platforms.
 * 
 * @uses react-fontawesome for icons
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 * 
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faSms } from '@fortawesome/free-solid-svg-icons';

const ShareButtons = ({ post }) => {
    const postUrl = `${window.location.origin}/post/${post.postID}`;
    const url = encodeURIComponent(postUrl);
    const title = encodeURIComponent(post.title);

    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Error copying link:', err));
    };
      
    

    return (
        <div>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(twitterUrl, '_blank')}><FontAwesomeIcon icon={faTwitter} /> Twitter</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(whatsAppUrl, '_blank')}><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(textMessageUrl, '_blank')}><FontAwesomeIcon icon={faSms} /> Text Message</button>
            <button className='text-blue-500 ml-5 underline' onClick={handleCopyLink}><FontAwesomeIcon icon={faCopy} /> Copy Link</button>
        </div>
    );
};

export default ShareButtons;
