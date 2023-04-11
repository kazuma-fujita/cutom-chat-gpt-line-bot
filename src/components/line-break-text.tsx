import React from "react";

function LineBreakText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line: string, index: number) => (
        <React.Fragment key={index}>
          {line}
          {index !== text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

export default LineBreakText;
