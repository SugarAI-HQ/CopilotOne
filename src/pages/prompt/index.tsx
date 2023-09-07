import React, { useState } from "react";

// function InputForm() {
//   const [inputText, setInputText] = useState(""); // State to store user input

//   const handleInputChange = (e) => {
//     setInputText(e.target.value); // Update the state with user input
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // You can perform actions with the input value here, such as sending it to an API or displaying it.
//     console.log("User input:", inputText);
//   };

//   return (
//     <main className=" flex flex-col items-center justify-center">
//         <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
//           <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
//             Create <span className="text-[hsl(280,100%,70%)]">Prompt</span>
//           </h1>
//           <div className="">
//             <h1>Input Form Page</h1>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                 Enter Text:
//                 <input
//                     type="text"
//                     value={inputText}
//                     onChange={handleInputChange}
//                 />
//                 </label>
//                 <button type="submit">Submit</button>
//             </form>
//           </div>
          

//           <div className="flex flex-col items-center gap-2">
//             <p className="text-2xl text-white">
              
//             </p>
//           </div>
//         </div>
//       </main>
    
//   );
// }

// export default InputForm;


function TextAreaWithButtons() {
  const [text, setText] = useState(""); // State to store the text entered in the text area

  const handleTextChange = (e) => {
    setText(e.target.value); // Update the state with the text from the text area
  };

  const handleClearClick = () => {
    setText(""); // Clear the text in the text area
  };

  const handleSubmitClick = () => {
    // Perform an action with the text (you can replace this with your logic)
    alert(`Text submitted: ${text}`);
  };

  return (
    <div>
      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text here"
      />
      <div>
        <button onClick={handleClearClick}>Clear</button>
        <button onClick={handleSubmitClick}>Submit</button>
      </div>
    </div>
  );
}

export default TextAreaWithButtons;

