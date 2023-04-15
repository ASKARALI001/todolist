import React from 'react';

const ContentCheckBox = ({isComplete}) => {
    return (
        <div className={`content__circle ${isComplete ? 'active' : ''}`}/>

    );
};

export default ContentCheckBox;