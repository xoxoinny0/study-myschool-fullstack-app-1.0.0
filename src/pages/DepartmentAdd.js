import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { postItem } from "../slices/DepartmentSlice";

import Spinner from "../components/Spinner";
import TableEx from "../components/TableEx";

const DepartmentAdd = memo(() => {
  /** 저장 완료 후 목록으로 되돌아가기 위한 페이지 강제 이동 함수 생성 */
  const navigate = useNavigate();

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.DepartmentSlice);

  /** <form>의 submit 버튼이 눌러졌을 때 호출될 이벤트 핸들러 */
  const onDepartmentSubmit = useCallback((e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 객체
    const current = e.currentTarget;

    // 입력값에 대한 유효성 검사
    // ... 생략 ...

    // 리덕스를 통한 데이터 저장 요청
    dispatch(
      postItem({
        dname: current.dname.value,
        loc: current.loc.value,
      })
    ).then(({ payload, error }) => {

      if (error) {
        window.alert(payload.data.rtmsg);
        return;
      }
      console.log(payload);
      navigate(`/department_view/${payload.item.deptno}`);
    });
  }, []);

  return (
    <div>
      <Spinner loading={loading} />
      <form onSubmit={onDepartmentSubmit}>
        <TableEx>
          <colgroup>
            <col width="120" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>학과이름</th>
              <td className="inputWrapper">
                <input type="text" className="field" name="dname" />
              </td>
            </tr>
            <tr>
              <th>학과위치</th>
              <td className="inputWrapper">
                <input type="text" className="field" name="loc" />
              </td>
            </tr>
          </tbody>
        </TableEx>

        <div style={{ textAlign: "center" }}>
          <button type="submit">저장하기</button>
        </div>
      </form>
    </div>
  );
});

export default DepartmentAdd;
