import React from "react";

export default function Content() {
  return (
    <>
      <p>
        A certificate generator is a helpful tool that allows you to design and instantly create custom certificates of achievement or completion directly in your browser. 
      </p>
      <p className="font-semibold text-foreground mt-4">Features:</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li><strong>Live Preview:</strong> See your certificate dynamically update as you type in the details.</li>
        <li><strong>High-Quality Export:</strong> Instantly download the certificate as a crisp PNG image using native browser Canvas API rendering.</li>
        <li><strong>Fully Client-Side:</strong> Your inputted data (names, courses, and signatures) never leaves your browser, ensuring 100% privacy and security.</li>
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Perfect for online courses, workshops, employee recognition, or just creating a fun novelty certificate for a friend!
      </p>
    </>
  );
}
