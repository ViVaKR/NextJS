'use client';

import { ILocationInfo } from '@/interfaces/i-location-info';
import { IPosData } from '@/interfaces/i-pos-data';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
    params: IPosData;
    locations: ILocationInfo[]
}

const GOOGLE_MAP_LIBRARIES: ("marker")[] = ["marker"];  // 컴포넌트 밖!

export default function VivGoogleMap({ params, locations }: MapComponentProps) {
    const [address, setAddress] = useState<string | null>();
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRefs = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const { latitude, longitude }: IPosData = params || { latitude: 37.5665, longitude: 126.9780 };

    const mapOptions = {
        center: { lat: Number(latitude), lng: Number(longitude) },
        zoom: 18,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        language: 'ko', // 지도 UI 텍스트, 범례 등이 한글로 표현됨
        region: 'KR', // 장소 이름의 지역적 표현을 한국식으로 유도 함.
        libraries: GOOGLE_MAP_LIBRARIES  // ✅ 이제 더 이상 매번 새 배열 아님!
    });

    useEffect(() => {
        if (!mapRef.current || !isLoaded) return;

        (async () => {
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
            // 1. 중앙 마커 추가
            const centerMarker = new AdvancedMarkerElement({
                map: mapRef.current,
                position: { lat: Number(latitude), lng: Number(longitude) },
                title: '+'
            })

            markerRefs.current.push(centerMarker);

            // 2. 위치 목록 마커들 추가
            locations.forEach((l) => {
                const div = document.createElement('div');
                div.innerHTML = `<div style="background: #007bff;
                                    color: white; padding: 4px 8px;
                                    border-radius: 4px;
                                    font-size: 12px;
                                    white-space: nowrap;
                                    transform: translateY(-180%);  /* 👈 요게 핵심! */
                                    position: relative;
                                    z-index: 1000;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                                ">${l.name}</div>`;

                const advancedMarker = new AdvancedMarkerElement({
                    map: mapRef.current!,
                    position: { lat: l.latitude, lng: l.longitude },
                    content: div,
                });

                markerRefs.current.push(advancedMarker);
            });
        })();
    }, [isLoaded, latitude, locations, longitude]);

    const handleAddressSearch = async () => {
        if (!address) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();

                // 지도 중심 이동
                mapRef.current?.panTo({ lat, lng });

                // 마커 추가 or 이동
                const centerMarker = new google.maps.marker.AdvancedMarkerElement({
                    map: mapRef.current,
                    position: { lat, lng },
                    title: '검색된 위치',
                });

                markerRefs.current.push(centerMarker);
            } else {
                alert('주소를 찾을 수 없습니다!');
            }
        });
    };


    if (!isLoaded) return <div>지도를 불러오는 중입니다...</div>;

    return (
        <>
            <GoogleMap
                mapContainerStyle={{
                    width: 'calc(100%-2rem)',
                    height: '400px',
                    border: 'solid 5px #A6BBCF',
                    borderRadius: '1rem',
                    margin: '0 1rem'
                }}
                id='VIV-MAP-ID'
                center={{ lat: Number(latitude), lng: Number(longitude) }}
                onLoad={(map) => { mapRef.current = map }}
                options={mapOptions} />

            <div className='flex gap-4 justify-center items-center p-4 text-slate-400'>
                <input
                    type="text"
                    placeholder="주소를 입력하세요"
                    className='px-4 py-3 border-2 rounded-2xl'
                    onChange={(e) => setAddress(e.target.value)}
                    value={address ?? ''}
                />
                <button
                    onClick={handleAddressSearch}

                    className='bg-sky-400
                    px-4 py-3 rounded-xl
                    cursor-pointer hover:bg-sky-700 text-white'
                >
                    지도 이동
                </button>
            </div>

        </>


    );
}
