/**
 * Select component
 * 
 * This component recieves the options and value
 * from the parent component then, styles and renders
 * a select element with the options.
 *  
 * @author Ghulam Hassan Hassani <w20017074>
 */

function Select({ options, value, identifier = '', onChange }) {
  
  return (
    < >
      <select
        value={value || ''}
        onChange={(e) =>
          onChange(identifier, e.target.value)
        }
        >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;
