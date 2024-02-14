/**
 * ErrorComponent
 * 
 * This component is used to display the error messages
 * that are passed to it as a prop.
 * This is built to avoid console logs and to display
 * the error messages to the user in a more user friendly
 * way.
 * 
 * @author Ghulam Hassan Hassani <W20017074>
 * 
 */

const ErrorComponent = (props) => {
    return (
        <div className="error">
            <h2>Error occured</h2>
            <p>{props.message}</p>
        </div>
    )
}

export default ErrorComponent