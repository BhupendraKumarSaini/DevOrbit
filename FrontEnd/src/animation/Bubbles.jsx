import React, { useState } from "react";

const Bubbles = () => {
  const [bubbles] = useState(() =>
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}vw`,
      width: `${Math.random() * 80 + 40}px`,
      height: `${Math.random() * 80 + 40}px`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * -10}s`,
    })),
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="bubble-test"
          style={{
            left: bubble.left,
            width: bubble.width,
            height: bubble.height,
            animationDuration: bubble.duration,
            animationDelay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Bubbles;
