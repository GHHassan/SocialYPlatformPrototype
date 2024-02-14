/**
 * Buttons.jsx
 * 
 * This is a utility file for all the buttons used in the application
 * the purpose of this file is to make the code in the components
 * more readable and maintainable
 * 
 * @returns buttonJSX
 * @author Ghuam Hassan Hassani <w20017074>
 *  
 */

export function AffilliationButton({ handleAffiliation, showAffiliations }) {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded mt-2"
            onClick={(e) => handleAffiliation(e)}
        >
            {showAffiliations ? 'Hide Author & Affiliations' : 'Show Author & Affiliations'}
        </button>
    )
}

export const AddNoteButton = ({ handleAddNote, hasNote, showNoteComponent }) => (
    <button
        className="bg-blue-500 hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded ml-3"
        onClick={(e) => handleAddNote(e)}
    >
       {((showNoteComponent && hasNote) || (showNoteComponent && !hasNote)) ? 
        'Hide Note' : (hasNote ? (showNoteComponent ? 'Hide Note' : 'Show/edit Note') : 
        'Add Note'
        )}
    </button>

)

export const SaveNoteButton = ({ handleSaveNote }) => (
    <button 
        className="bg-blue-500 hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded m-3"
        onClick={(e) => handleSaveNote(e)}
    >
        Save Note
    </button>
)

export const DiscardNoteButton = ({ handleAddNote }) => (
    <button
        className="bg-blue-500 hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded mt-2"
        onClick={(e) => handleAddNote(e)}
    >
        Discard
    </button>
)

export const DeleteNoteButton = ({ handleDeleteNote }) => (
    <button 
        className="bg-red-500 hover:bg-red-800 text-white font-bold text-sm py-2 px-4 rounded m-3"
        onClick={(e) => handleDeleteNote(e)}
    >
        Delete Note
    </button>
)

export const previousPageButton = ({ handlePageChanges, page }) => (
    page > 1 &&
    <button
        className='bg-blue-500 hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded'
        onClick={() => handlePageChanges(page - 1)}
    >
        Previous Page
    </button>
)


export const nextPageButton = ({ handlePageChanges, page, maxPage }) => (
    page < maxPage && (
        <button
            className='bg-blue-500 ml-auto hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded'
            onClick={() => handlePageChanges(page + 1)}
        >
            Next Page
        </button>
    )
)

export const PaginationButtons = ({ page, maxPage, setPage }) => {
    const handlePageChanges = (newPage) => {
        setPage(newPage)
    }
    return (
        <div className='flex justify-between mt-4'>
            {previousPageButton({ handlePageChanges, page })}
            {nextPageButton({ handlePageChanges, page, maxPage })}
        </div>
    )
}

export const PageNumbers = ({ page, maxPage }) => {
    return (
        <p className='md:ml-auto min-w-max p-2 text-black'>
            page {page} of {maxPage}
        </p>
    )
}

export const ShowAllButton = ({ showAll, handleShowAll }) => {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-800 text-white font-bold text-sm py-2 px-4 rounded"
            onClick={handleShowAll}
        >
            {showAll ? 'Show pages' : 'Show All'}
        </button>
    )
}