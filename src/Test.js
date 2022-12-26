import React, { memo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getList, getItem, postItem, putItem, deleteItem } from './slices/DepartmentSlice';

const Test = memo(() => {
    const dispatch = useDispatch();
    const { pagenation, data, loading, error } = useSelector((state) => state.DepartmentSlice);

    useEffect(() => {
        // dispatch(getList());

        dispatch(getItem({id: 619}));

        // dispatch(postItem({dname: 'React.js', loc: '1403호'}));

        // dispatch(putItem({id: 619, dname: 'React.js수정', loc: '1406호'}));

        // dispatch(deleteItem({id: 619}));
    }, [dispatch]);

    return (
        loading ? "loading..." : (
            error ? JSON.stringify(error) : (
                <>
                    {JSON.stringify(pagenation)}
                    <hr/>
                    {JSON.stringify(data)}

                </>
            )
        )
    );
});

export default Test;