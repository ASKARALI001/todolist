import React, {useContext} from 'react';
import {CustomContext} from "../../../utils/Context";

import ContentCateory from "../../../components/ContenetCategory/ContentCateory";

const HomeContent = () => {

    const {status, setStatus, user} = useContext(CustomContext)

    return (
        <div className="content">

            {
                status === 'all' ? user.categories.map((item) => <ContentCateory key={item.id} status={item.categoryName}/>)
                    : <ContentCateory status={status}/>
            }


        </div>
    );
};

export default HomeContent;