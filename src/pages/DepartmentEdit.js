import React, { memo, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { putItem, getItem } from "../slices/DepartmentSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import TableEx from "../components/TableEx";

const DepartmentEdit = memo(() => {
  /** path 파라미터 받기 */

  const { deptno } = useParams();


  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.DepartmentSlice
  );

  /** 페이지 강제이동 처리를 위한 navigate 함수 생성 */
  const navigate = useNavigate();

  /** <form>의 submit 버튼이 눌러졌을 때 호출될 이벤트 핸들러 */
  const onDepartmentSubmit = useCallback((e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 객체
    const current = e.currentTarget;

    // 입력값에 대한 유효성 검사
    // ... 생략 ...

    // 리덕스를 통한 데이터 수정 요청
    dispatch(
      putItem({
        id: current.deptno.value,
        dname: current.dname.value,
        loc: current.loc.value,
      })
    ).then(({ payload, error }) => {
      if (error) {
        window.alert(payload.data.rtmsg);
        return;
      }

      navigate(`/department_view/${payload.item.deptno}`);
    });
  }, []);

  return (
    <div>
      <Spinner loading={loading} />

      {error ? (
        <ErrorView error={error} />
      ) : (
        <form onSubmit={onDepartmentSubmit}>
          <input type="hidden" name="deptno" defaultValue={data?.deptno} />
          <TableEx>
            <colgroup>
              <col width="120" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>학과이름</th>
                <td className="inputWrapper">
                  <input type="text" className="field" name="dname" defaultValue={data?.dname}/>
                </td>
              </tr>
              <tr>
                <th>학과위치</th>
                <td className="inputWrapper">
                  <input type="text" className="field" name="loc" defaultValue={data?.loc}/>
                </td>
              </tr>
            </tbody>
          </TableEx>

          <div style={{ textAlign: "center" }}>
            <button type="submit">저장하기</button>
          </div>
        </form>
      )}
    </div>
  );
});

export default DepartmentEdit;
