import React from 'react';
import AddButton from '../AddButton';

const App = () =>  {

    const addNote = () => {
        alert("insert functionality to add note");
      }

    return(
    <div>
        <h1> Edit Route</h1>
        <form>
            <li>
                <label>
                    Street:
                    <input type="text" street="street" />
                </label>
            </li>
            <li>
                <label>
                    Date of Last Canning:
                    <input type="text" canning_date="canning_date" />
                </label>
            </li>
            <li>
                <label>
                    Donations since Jan 1 of this year(optional):
                    <input type="text" canning_date="canning_date" />
                </label>
            </li>
            
            <li>
                <button>Save</button>
                <button>Cancel</button>
            </li>
        </form>

        <h2> Volunteer Notes</h2>
        {/* <NotesButton/> */}
        <AddButton clickCallback={addNote}/>
    </div>
)};
export default App;