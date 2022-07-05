import React from 'react';

export type CompletedCounterProps = {
  total: number;
  completed: number;
};

const CompletedCounter = ({ total, completed }: CompletedCounterProps) => {
  return (
    <div className="completed-counter">
      Completed: {completed} of {total}
    </div>
  );
};

export default CompletedCounter;
