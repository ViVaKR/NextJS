'use client'
import VivGoogleMap from "@/components/VivGoogleMap";
import VivTitle from "@/components/VivTitle";
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import LocationDisabledOutlinedIcon from '@mui/icons-material/LocationDisabledOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { getIpInfomations } from '@/lib/fetchIpInfo';
import { IIpInfo } from '@/interfaces/i-ip-info';
import { IPosData } from '@/interfaces/i-pos-data';
import FormSection from '../ip-address/FormSection'; // FormSection 경로는 실제 프로젝트에 맞게 확인 필요
import { ILocationInfo } from '@/interfaces/i-location-info';
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ButtonGroup, FilledInput, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip } from "@mui/material";

interface AddressInfo {
    lat: number;
    lng: number;
    jibunAddress?: string;
    roadAddress?: string;
}

const GoogleMapPage = (

) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [initialIpInfo, setInitialIpInfo] = useState<IIpInfo | undefined>();
    const [posData, setPosData] = useState<IPosData | undefined>(); // 지도의 중심 좌표 상태 (undefined 가능)
    const [locationInfos, setLocationInfos] = useState<ILocationInfo[]>([]); // 초기값을 빈 배열로 설정
    const [locationId, setLocationId] = useState<string>(''); // Select 컴포넌트 value는 string을 기대하므로 string으로 관리
    const [isLoadingIp, setIsLoadingIp] = useState(true); // 초기 IP 로딩 상태
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<IPosData>({
        defaultValues: {
            latitude: '',
            longitude: ''
        },
        mode: 'onTouched'
    });

    // ? IP 정보(IIpInfo)를 받아서 posData 상태를 업데이트하는 함수
    // ? 이 함수는 이제 setPosData만 호출함. 폼 업데이트는 별도 useEffect에서 처리.
    const updatePosDataFromIpInfo = useCallback((ipInfo: IIpInfo | null) => {
        let newPosData: IPosData | undefined = undefined;
        if (ipInfo?.location) {
            const locationParts = ipInfo.location.split(',');
            if (locationParts.length === 2) {
                const lat = locationParts[0].trim();
                const lng = locationParts[1].trim();
                if (lat && lng) {
                    newPosData = { latitude: lat, longitude: lng };
                } else {
                    console.warn('⚠️ Parsed latitude or longitude is empty after splitting.');
                }
            } else {
                console.warn(`⚠️ Invalid location format received: ${ipInfo.location}`);
            }
        } else {
            console.log('ℹ️ No location data found in the received IP Info.');
        }
        setPosData(newPosData); // posData 상태 업데이트 (undefined일 수도 있음)
    }, []); // setPosData는 안정적이므로 의존성 배열에 넣지 않아도 됨 (또는 [setPosData] 추가)

    // ? 컴포넌트 마운트 시 초기 IP 정보 가져오기
    useEffect(() => {
        const getInitialIp = async () => {
            setIsLoadingIp(true);
            try {
                const ip = await getIpInfomations();
                setInitialIpInfo(ip);
                updatePosDataFromIpInfo(ip); // 가져온 IP 정보로 posData 설정
            } catch (error) {
                console.error("Error fetching initial IP info:", error);
                // 초기 IP 로딩 실패 시 posData를 설정하지 않거나 기본값 설정 가능
                setPosData(undefined);
            } finally {
                setIsLoadingIp(false);
            }
        }
        getInitialIp();
    }, [updatePosDataFromIpInfo]); // updatePosDataFromIpInfo는 useCallback으로 감싸져 안정적

    // ? 컴포넌트 마운트 시 장소 목록(LocationInfo) 가져오기
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingLocations(true);
            const url = `${apiUrl}/api/locationinfo`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`데이터 목록 가져오기 실패: ${response.status}`);
                }

                const result: ILocationInfo[] = await response.json();
                setLocationInfos(result || []); // 결과가 null/undefined일 경우 빈 배열
            } catch (e: any) {
                console.error("Error fetching location infos:", e);
                setLocationInfos([]); // 에러 발생 시 빈 배열로 설정
            } finally {
                setIsLoadingLocations(false);
            }
        }
        fetchData();
    }, [apiUrl]); // apiUrl이 변경될 가능성이 낮다면 []로 해도 무방

    // ? posData 상태가 변경될 때마다 폼 필드 업데이트
    useEffect(() => {
        if (posData && posData.latitude && posData.longitude) {
            setValue('latitude', posData.latitude, { shouldValidate: true, shouldDirty: true });
            setValue('longitude', posData.longitude, { shouldValidate: true, shouldDirty: true });

            // posData에 해당하는 locationId를 찾아서 Select 값도 업데이트 (선택 사항)
            const foundLocation = locationInfos.find(loc =>
                loc.latitude.toString() === posData.latitude?.toString() &&
                loc.longitude.toString() === posData.longitude?.toString()
            );
            setLocationId(foundLocation ? foundLocation.id.toString() : '');

        } else {
            setValue('latitude', '', { shouldDirty: true });
            setValue('longitude', '', { shouldDirty: true });
            setLocationId(''); // Select 값도 초기화
        }
    }, [posData, setValue, locationInfos]); // posData나 locationInfos가 변경되면 실행

    // 사무실 위치 설정 핸들러
    const onSetOffice = () => {
        const office: IPosData = {
            latitude: 37.7110454443427,
            longitude: 127.116683580175
        };
        setPosData(office); // posData만 업데이트 -> useEffect가 폼 필드 업데이트
    };

    // 폼 제출 핸들러
    const onSubmit = (data: IPosData) => {
        // 유효한 숫자 형태인지 추가 검증 가능
        if (data.latitude && data.longitude) {
            setPosData(data); // posData 업데이트 -> useEffect가 폼 필드 업데이트 (필요시)
        } else {
            console.warn("onSubmit: Invalid latitude or longitude in form data", data);
        }
    };

    // 장소 선택 변경 핸들러
    const handleChange = (event: SelectChangeEvent<string>) => { // Select value 타입 string으로 변경
        const id = event.target.value;
        setLocationId(id); // 선택된 ID 업데이트 (string)

        if (id) {
            const location = locationInfos?.find((x) => x.id === Number(id));
            if (location) {
                const pos: IPosData = {
                    latitude: location.latitude,
                    longitude: location.longitude
                };
                setPosData(pos); // posData 업데이트 -> useEffect가 폼 필드 업데이트
            }
        } else {
            // '선택 안함' 또는 빈 값 선택 시 처리
            setPosData(undefined); // 지도 위치 초기화
        }
    };

    // 폼 및 지도 초기화 핸들러
    const handleReset = () => {
        reset({ latitude: '', longitude: '' }); // 폼 필드 초기화
        setPosData(undefined); // 지도 위치 상태 초기화
        setLocationId(''); // Select 값 초기화
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center">
            <VivTitle title="내 지도" />
            <div className="w-full">
                <VivGoogleMap params={posData!} locations={locationInfos} />
            </div>
            {/* 아이피 정보 가져오기 및 입력 섹션 */}
            {/* 로딩 상태 또는 초기 IP 정보에 따라 표시 */}
            {isLoadingIp && <div>Loading initial IP information...</div>}
            {!isLoadingIp && initialIpInfo && (
                <FormSection
                    initialIpInfo={initialIpInfo}
                    onIpInfoFetched={updatePosDataFromIpInfo} // IP 검색 시 호출될 콜백 (posData 업데이트용)
                />
            )}
            {!isLoadingIp && !initialIpInfo && <div>Could not load initial IP information.</div>}

            {/* 위도/경도 입력 폼 */}
            <form autoComplete='off'
                className='flex flex-col gap-8 items-center p-4 w-[400px]' // 반응형 너비 조절
                onSubmit={handleSubmit(onSubmit)} >
                <div className='flex flex-col sm:flex-row gap-4 w-full justify-center'> {/* 반응형 레이아웃 */}
                    {/* 위도, Latitude */}
                    <FormControl className='w-full sm:w-[250px]'> {/* 반응형 너비 */}
                        <InputLabel htmlFor="latitude">위도 (Latitude)</InputLabel>
                        <Controller
                            name='latitude'
                            control={control}
                            rules={{ required: '위도를 입력하여 주세요' }}
                            render={({ field }) => (
                                <FilledInput
                                    {...field}
                                    error={!!errors.latitude}
                                    autoComplete='off'
                                    id='latitude'
                                    name='latitude'
                                    type="number" // 숫자 입력에 더 적합할 수 있음
                                    inputProps={{ step: "any" }} // 소수점 허용
                                />
                            )}
                        />
                        {errors.latitude &&
                            <FormHelperText className='!text-red-400'>
                                {errors.latitude?.message}
                            </FormHelperText>}
                    </FormControl>

                    {/* 경도, Longitude */}
                    <FormControl className='w-full sm:w-[250px]'> {/* 반응형 너비 */}
                        <InputLabel htmlFor="longitude">경도 (Longitude)</InputLabel> {/* 오타 수정: logitude -> longitude */}
                        <Controller
                            name='longitude'
                            control={control}
                            rules={{ required: '경도를 입력하여 주세요' }} // 메시지 수정
                            render={({ field }) => (
                                <FilledInput
                                    {...field}
                                    error={!!errors.longitude}
                                    autoComplete='off'
                                    id='longitude'
                                    name='longitude'
                                    type="number" // 숫자 입력에 더 적합할 수 있음
                                    inputProps={{ step: "any" }} // 소수점 허용
                                />
                            )}
                        />
                        {errors.longitude &&
                            <FormHelperText className='!text-red-400'>
                                {errors.longitude?.message}
                            </FormHelperText>}
                    </FormControl>
                </div>

                <ButtonGroup variant='outlined'>
                    <Tooltip title='Clear Location' placement='bottom'>
                        <IconButton type='button' onClick={handleReset}> {/* 초기화 핸들러 사용 */}
                            <LocationDisabledOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Set Office Location' placement='bottom'>
                        <IconButton type='button' onClick={onSetOffice}>
                            <PlaceOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Update Map from Input' placement='bottom'>
                        <IconButton type='submit'> {/* 폼 제출 버튼 */}
                            <GpsFixedOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </ButtonGroup>
            </form>

            {/* 장소 선택 드롭다운 */}
            <FormControl sx={{ m: 1, minWidth: 200, maxWidth: '80%' }} size="small"> {/* 너비 조절 */}
                <InputLabel id="location-select-label">장소 선택</InputLabel>
                <Select
                    labelId="location-select-label"
                    id="location-select"
                    value={locationId} // 상태값 바인딩 (string)
                    label="장소 선택"
                    onChange={handleChange}
                    disabled={isLoadingLocations} // 로딩 중 비활성화
                >
                    <MenuItem value="">
                        <em>선택 안함</em>
                    </MenuItem>
                    {locationInfos?.map((info) => (
                        <MenuItem key={info.id} value={info.id.toString()}> {/* value는 string으로 */}
                            {info?.name || `Location ${info.id}`} {/* 이름 없으면 기본 텍스트 */}
                        </MenuItem>
                    ))}
                </Select>
                {isLoadingLocations && <FormHelperText>Loading locations...</FormHelperText>}
            </FormControl>
        </div>
    );
}

export default GoogleMapPage;
