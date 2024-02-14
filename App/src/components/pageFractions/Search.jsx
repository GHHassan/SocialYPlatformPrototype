/**
 * Search component
 * 
 * This component styles and renders the search bar
 * used in multiple pages
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

function Search(props) {
    return (
        <input
        className=" block md:inline-block m-5 ml-0 sm:w-6-12 md:w-5/12 p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        type="text"
        placeholder="Search..."
        value={props.search}
        onChange={props.handleContentSearch}
      />
    )
}

export default Search

