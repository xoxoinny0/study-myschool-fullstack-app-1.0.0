import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getList, deleteItem } from "../slices/DepartmentSlice";
import { useQueryString } from "../hooks/useQueryString";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import Table from "../components/Table";

// 입력 컨트롤들을 포함하하는 박스
const ControlContainer = styled.form`
  position: sticky;
  top: 0;
  background-color: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 10px 0;

  .controll {
    margin-right: 5px;
    display: inline-block;
    font-size: 16px;
    padding: 7px 10px 5px 10px;
    border: 1px solid #ccc;
  }

  .clickable {
    background-color: #fff;
    color: #000;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background-color: #06f2;
    }

    &:active {
      transform: scale(0.9, 0.9);
    }
  }
`;

const DepartmentList = memo(() => {
  /** QueryString 변수 받기 */
  const { query } = useQueryString();


  /** 화면 갱신을 위한 dummy 상태값 */
  const [isUpdate, setUpdate] = useState(0);

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.DepartmentSlice
  );

  /** 최초 마운트시 리덕스를 통해 목록을 조회한다. */
  // 화면 새로고침에 대한 상태값이 변경된다면 데이터를 새로 로드함
  useEffect(() => {
    dispatch(
      getList({
        query: query,
      })
    );    
  },[isUpdate, query]);

  /** 페이지 강제 이동을 처리하기 위한 navigate 함수 생성 */
  const navigate = useNavigate();

  /** 수정 버튼에 대한 이벤트 리스너 */
  const onDepartmentEditClick = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;
    const { deptno } = current.dataset;

    navigate(`/department_edit/${deptno}`);
    
  });

  /** 삭제 버튼에 대한 이벤트 리스너 */
  const onDepartmentDelete = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    if (window.confirm(`정말 ${current.dataset.dname}(을)를 삭제하시겠습니까?`)) {
      dispatch(deleteItem({ id: current.dataset.deptno })).then(({ payload, error}) => {
        if (error) {
          window.alert(payload.item.rtmsg);
          return;
        }

        window.alert('삭제되었습니다.');
        setUpdate(isUpdate+1);
      });
    }
  });

  /** 검색 이벤트 */
  const onSearchSubmit = useCallback((e) => {
    e.preventDefault();

    // 검색어
    const query = e.currentTarget.query.value;

    // 검색어에 대한 URL을 구성한다.
    let redirectUrl = query? `/?query=${query}` : "/";
    navigate(redirectUrl);
  },[navigate]);

  return (
    <div>
      {/* 로딩바 */}
      <Spinner loading={loading} />

      {/* 검색폼 */}
      <ControlContainer onSubmit={onSearchSubmit}>
        <input type="text" name='query' className="controll" defaultValue={query} />
        <button type='submit' className="controll clickable">
          검색
        </button>
        <NavLink to="department_add" className="controll clickable">
          학과정보 추가하기
        </NavLink>
      </ControlContainer>

      {/* 조회 결과 표시하기 */}
      { error? (
        <ErrorView error={error} />
      ) : (
        // Ajax 처리 결과가 존재할 경우
        data && (
            <Table>
                <thead>
                    <tr>
                        <th>학과번호</th>
                        <th>학과명</th>
                        <th>학과위치</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        // 처리 결과는 존재 하지만 데이터 수가 0건인 경우와 그렇지 않은 경우를 구분
                        data.length > 0 ? (
                            data.map((v, i) => {
                                return (
                                    <tr key={v.deptno}>
                                        <td>{v.deptno}</td>
                                        <td>
                                            <NavLink to={`department_view/${v.deptno}`}>{v.dname}</NavLink>
                                        </td>
                                        <td>{v.loc}</td>
                                        <td>
                                            <button type="button" data-deptno={v.deptno} onClick={onDepartmentEditClick}>
                                                수정하기
                                            </button>
                                        </td>
                                        <td>
                                            <button type="button" data-deptno={v.deptno} data-dname={v.dname} onClick={onDepartmentDelete}>
                                                삭제하기
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan='5' align="center">
                                    검색결과가 없습니다.
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        )
      )}
    </div>
  );
});

export default DepartmentList;
