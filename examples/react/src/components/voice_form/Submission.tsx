import React, { useEffect } from "react";

const Submission: React.FC<{ answers: any[] }> = ({ answers }) => {
  useEffect(() => {
    // Submit answers to the server
    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [answers]);

  return (
    <div className="p-4">
      <p>Thank you! Your answers have been submitted.</p>
    </div>
  );
};

export default Submission;
