import React from 'react';
import { useAppState } from '../../contexts/AppStateContext';

const Chat = () => {
    const { state, dispatch } = useAppState();
    const { isOpen: isChatOpen } = state;

    return (
        <div className="relative h-full">
                <h1>Chat is now open
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugit vero fuga quia deserunt itaque, quas, veniam autem accusantium ducimus optio, incidunt sequi perferendis voluptates ipsa consequuntur! Non, eaque eos.
                </h1>
        </div>
    )
};

export default Chat;