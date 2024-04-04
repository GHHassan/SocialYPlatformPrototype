import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faWhatsapp, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faSms } from '@fortawesome/free-solid-svg-icons';

const ShareButtons = ({ post }) => {
    const postUrl = `${window.location.origin}/post/${post.postID}`;
    const url = encodeURIComponent(postUrl);
    const title = encodeURIComponent(post.title);

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
    const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`;
    const textMessageUrl = `sms:?body=${encodeURIComponent(title + " " + url)}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Error copying link:', err));
    };


    return (
        <div>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(facebookUrl, '_blank')}><FontAwesomeIcon icon={faFacebookF} /> Facebook</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(twitterUrl, '_blank')}><FontAwesomeIcon icon={faTwitter} /> Twitter</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(linkedInUrl, '_blank')}><FontAwesomeIcon icon={faLinkedinIn} /> LinkedIn</button>
            <button className='text-blue-500 ml-5 underline' onClick={handleCopyLink}><FontAwesomeIcon icon={faCopy} /> Copy Link</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(whatsAppUrl, '_blank')}><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(`fb-messenger://share/?link=${url}`, '_blank')}><FontAwesomeIcon icon={faFacebookMessenger} /> Messenger</button>
            <button className='text-blue-500 ml-5 underline' onClick={() => window.open(textMessageUrl, '_blank')}><FontAwesomeIcon icon={faSms} /> Text Message</button>
        </div>
    );
};

export default ShareButtons;
