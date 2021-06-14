import React, {useState} from 'react'

function NameFieldComponent({value, rowIndex, data, api}) {
    const [flaggedForReview, setflaggedForReview] = useState(false)

    const Flag = () =>{
        alert(`${value} is flagged for review! (id: ${data.id})`);
        setflaggedForReview(true)
    }

    return (
        <div>
       <span style={{ color: flaggedForReview ? "red" : "black" }}>
          {value}!
        </span>

        <button
          type="button"
          style={{ marginLeft: "5px" }}
          onClick={Flag}
          disabled={flaggedForReview}
        >
          Flag for Review!
        </button>
      </div>
    )
}

export default NameFieldComponent
