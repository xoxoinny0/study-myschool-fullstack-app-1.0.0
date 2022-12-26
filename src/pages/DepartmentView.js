import React, { memo, useEffect, useCallback } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getItem, deleteItem } from "../slices/DepartmentSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import Table from "../components/Table";

const DepartmentView = memo(() => {
  /** path 파라미터 받기 */
  const { deptno } = useParams();

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.DepartmentSlice
  );

  /** 페이지가 열린 직후 (혹은 id값이 변경된 경우) 데이터 가져오기 */
  useEffect(() => {
    dispatch(getItem({ id: deptno }));
  }, [deptno]);

  /** 페이지 강제이동 처리를 위한 navigate 함수 생성 */
  const navigate = useNavigate();

  /** 삭제버튼에 대한 이벤트 리스너 */
  const onDepartmentDelete = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    if (window.confirm(`정말 ${current.dataset.dname}(을)를 삭제하시겠습니까?`)) {
        dispatch(deleteItem({ id: current.dataset.deptno})).then(({payload, error}) => {
            if (error) {
                window.alert(payload.data.rtmsg);
                return;
            }

            window.alert('삭제되었습니다.');
            navigate('/');
        });
    }
  }, []);

  return (
    <div>
      <Spinner loading={loading} />

      {error? (
        <ErrorView error={error} />
      ) : (
        data && (
            <div>
                <Table>
                    <colgroup>
                        <col width='120' />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>학과번호</th>
                            <td>{data.deptno}</td>
                        </tr>
                        <tr>
                            <th>학과이름</th>
                            <td>{data.dname}</td>
                        </tr>
                        <tr>
                            <th>학과위치</th>
                            <td>{data.loc}</td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{ textAlign: 'center'}}>
                    <NavLink to='/'>목록</NavLink>
                    &nbsp; | &nbsp;
                    <NavLink to='/department_add'>등록</NavLink>
                    &nbsp; | &nbsp;
                    <NavLink to={`/department_edit/${data.deptno}`}>수정</NavLink>
                    &nbsp; | &nbsp;
                    <NavLink to='#!' data-deptno={data.deptno} data-dname={data.dname} onClick={onDepartmentDelete}>삭제</NavLink>
                    &nbsp; | &nbsp;
                </div>
            </div>
        )
      )}
    </div>
  );
});

export default DepartmentView;
