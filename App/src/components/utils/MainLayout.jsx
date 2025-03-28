/**
 * @file MainLayout.jsx 
 * 
 * It is used to arrange the main components of the application 
 * for appropriatly displaying the contents in grids provided by TailWindCSS,
 * and comply with the semantic use of HTML5 elements.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

import { Toaster } from 'react-hot-toast';
import Chat from '../pages/Chat';

function MainLayout({ children }) {
    return (
        <div className="flex bg-gray-100 flex-col lg:flex-row">
            <main className="mt-8 w-full bg-white rounded-lg">
                {children}
                <Toaster />
            </main>
            <section className="hidden lg:block m-4 mt-8 w-full lg:w-2/6 bg-white h-full rounded-lg">
                <Chat />
            </section>
        </div>
    );
}

export default MainLayout;