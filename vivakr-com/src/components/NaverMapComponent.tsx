// components/NaverMapComponent.tsx
"use client";

import { IPosData } from '@/interfaces/i-pos-data';
import { number } from 'framer-motion';
import React, { JSX, useEffect, useRef } from 'react';

export default function NaverMapComponent({ params }: { params: IPosData }): JSX.Element {
    const { latitude, longitude }: IPosData = params;
    const mapElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // window 객체 및 naver.maps 객체가 로드되었는지 확인
        // 타입 정의 파일(navermaps.d.ts) 덕분에 TypeScript가 naver 객체를 인식합니다.
        if (typeof window !== "undefined" && window.naver && window.naver.maps) {
            // mapElement ref가 현재 DOM 노드를 가리키는지 확인
            if (!mapElement.current) {
                console.error("Map container element not found.");
                return;
            }

            // 지도 생성 옵션 (타입 정의에 따라 자동 완성 및 타입 체크 가능)
            console.log(latitude, longitude);
            const location = new window.naver.maps.LatLng(Number(latitude!), Number(longitude!));
            const mapOptions: naver.maps.NaverMapOptions = {
                center: location,
                zoom: 15,
                zoomControl: true
            };

            // 지도 인스턴스 생성 (타입 명시)
            const mapInstance = new window.naver.maps.Map(mapElement.current, mapOptions);

            // (선택) 마커 생성 (타입 정의에 따라 자동 완성 및 타입 체크 가능)
            const markerOptions: naver.maps.NaverMarkerOptions = { // 타입 명시
                position: location,
                map: mapInstance,
            };
            new window.naver.maps.Marker(markerOptions);

            // (선택) Geocoding / Reverse Geocoding 사용 예시
            // naver.maps.Service.geocode({ query: '청학로학교길 8-5' }, (status, response) => {
            //     // TODO
            //     if (status !== naver.maps.Service.Status.OK) {
            //         return alert('Something wrong!');
            //     }
            // });
            // naver.maps.Service.reverseGeocode({ coords: location }, (status, response) => {

            //     // TODO
            // });

            // 컴포넌트 언마운트 시 정리 (필요한 경우)
            // return () => {
            //     mapInstance; // 네이버 지도 API 버전에 따라 destroy 메서드가 있을 수 있음 (확인 필요)
            // };

        } else {
            console.warn("네이버 스크립트 로드가 되지 않았습니다.");
            // 로딩 중이거나 스크립트 로드 실패 시 대체 로직 (예: 로딩 스피너)
        }
    }, [latitude, longitude]);

    return (
        <div
            ref={mapElement}
            className='border-8 rounded-2xl border-slate-400'
            style={{ width: 'calc(100% - 2rem)', margin: '1rem', height: 'calc((100vh * 2) / 3)', backgroundColor: '#eee' }} // 초기 로딩 시 회색 배경 등
        />
    );
}
