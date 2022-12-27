/**
 * Pagenation.js
 * - 페이지번호 구현
 * 
 * props.pagenation으로 전달되는 정보
 * - nowPage : 현재 페이지
 * - totalCount  : 전체 데이터 수
 * - listCount   : 한 페이지에 보여질 목록의 수
 * - totalPage   : 전체 페이지 수
 * - groupCount  : 한 페이지에 보여질 그룹의 수
 * - totalGroup  : 전체 그룹 수
 * - nowGroup    : 현재 페이지가 속해 있는 그룹 번호
 * - groupStart  : 현재 그룹의 시작 페이지
 * - groupEnd    : 현재 그룹의 마지막 페이지
 * - prevGroupLastPage  : 이전 그룹의 마지막 페이지
 * - nextGroupFirstPage : 다음 그룹의 시작 페이지
 * - offset       : SQL의 LIMIT절에서 사용할 데이터 시작 위치
 */
import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const PagenationContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 20px auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;

    .link {
        display: block;
        font-size: 11px;
        padding: 5px 10px 3px 10px;
        text-decoration: none;
        transition: background-color 0.3s;
        border: 1px solid #ddd;
        margin: 0 1px;
        color: black;

        &.active,
        &.active:hover {
            background-color: #4caf50;
            color: white;
            border: 1px solid #4caf50;
        }

        &.disabled,
        &.disabled:hover {
            border: 1px solid #ddd;
            background-color: #fff;
            color: #ccc;
            cursor: no-drop;
        }

        &:hover {
            background-color: #095717;
            color: white;
            border: 1px solid #095717;
        }
    }
`;

const Pagenation = memo(({ pagenation: { groupEnd, groupStart, nextGroupFirstPage, nowPage, prevGroupLastPage, totalPage }}) => {
    // 현재 URL
    const location = useLocation();

    // 페이지 번호 링크를 포함하는 <li>를 리턴하는 함수
    const pageNumber = useCallback((currentPage, targetPage, linkText) => {
        const { pathname, search } = location;

        // QueryString 문자열을 객체로 변환
        const params = new URLSearchParams(search);
        // params객체에 page번호 파라미터 추가
        params.set('page', targetPage);
        // params객체를 다시 QueryString문자열로 변환
        const qs = params.toString();
        // 최종 URL을 추출
        let targetUrl = `${pathname}?${qs}`;

        if (!linkText) {
            // 출력할 테스트가 전달되지 않은 경우 페이지 번호로 대체함
            linkText = targetPage;
        }

        // 비활성 상태의 링크인 경우
        if (targetPage === 0) {
            return (
                <li key={targetPage}>
                    <span className='link disabled' dangerouslySetInnerHTML={{ __html: linkText }}></span>
                </li>
            );
        } else if (targetPage == currentPage) {
            return (
                <li key={targetPage}>
                    <span className='link active' dangerouslySetInnerHTML={{ __html: linkText }}></span>
                </li>
            );
        } else {
            return (
                <li key={targetPage}>
                    <Link className='link' to={targetUrl} dangerouslySetInnerHTML={{ __html: linkText }}></Link>
                </li>
            );
        }
    },[]);

    // 스크롤바를 강제로 맨 위로 이동시킴
    window.scrollTo(0, 0);


    return (
        <PagenationContainer>
            {/* 첫 페이지로 이동하기 */}
            {pageNumber(nowPage, 1, "&laquo;")}

            {/* 이전 그룹의 마지막 페이지로 이동하기 */}
            {pageNumber(nowPage, prevGroupLastPage, "&lt;")}

            {/* 페이지 수 만큼 출력하기 */}
            {new Array(groupEnd - groupStart + 1).fill(groupStart).map((v, i) => pageNumber(nowPage, v + i))}

            {/* 다음 그룹의 첫 페이지로 이동하기 */}
            {pageNumber(nowPage, nextGroupFirstPage, "&gt;")}

            {/* 끝 페이지로 이동하기 */}
            {pageNumber(nowPage, totalPage, "&raquo;")}
        </PagenationContainer>
    );
});

Pagenation.defaultProps = {
    pagenation: {
        groupEnd: 0,
        groupStart: 0,
        nextGroupFirstPage: 0,
        nowPage: 1,
        prevGroupLastPage: 0,
        totalPage: 1,
    }
};

export default Pagenation;