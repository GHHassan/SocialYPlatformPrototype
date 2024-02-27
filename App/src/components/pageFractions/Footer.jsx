/** 
 * Footer component
 * 
 * This component styles and renders the footer
 * of the application. This includes the student
 * name and ID and the the title as coursework
 * to distinguish it from the actual CHI website.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

const Footer = () => {

    return (
        <footer className="bg-black text-white text-center mb-2">
            <h4 className="text-xl font-bold">Coursework assignment for KF6012 Web Application Integration, Northumbria University</h4>
            <p>Student ID: W20017074</p>
            <p>Student Name: Ghulam Hassan Hassani</p>
            <p>© 2024</p>
        </footer>
    )
}

export default Footer