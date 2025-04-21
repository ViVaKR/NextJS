// src/lib/server-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { CodeData } from '@/types/code-form-data';
import { ICodeResponse } from '@/interfaces/i-code-response';
import { redirect } from 'next/navigation'
import { getServerToken } from '@/services/server-auth';

const apiUrl = process.env.API_URL;

// * GET Code Data
// export async function postCodes(data: CodeData): Promise<ICodeResponse | null> {

//     const token = await getServerToken();

//     if (!token) {
//         return {
//             isSuccess: false,
//             message: '로그인 후 사용 가능합니다.',
//             data: null,
//         };
//     }

//     try {
//         const response = await fetch(`${apiUrl}/api/code`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(data),
//         });

//         const result: ICodeResponse = await response.json();

//         if (response.ok) {
//             revalidatePath('/code'); // 캐시 무효화
//             return result as ICodeResponse;
//         } else {
//             return {
//                 isSuccess: false,
//                 message: `Response Not OK: ${result.message}`,
//                 data: null,
//             };
//         }
//     } catch (err) {
//         return {
//             isSuccess: false,
//             message: `Submission failed: ${err}`,
//             data: null,
//         };
//     }
// }

// * PUT Code Data
// export async function updateCode(id: number, data: CodeData): Promise<ICodeResponse | null> {
//     const token = await getServerToken();

//     if (!token) {
//         redirect('/membership/sign-in');
//     }

//     try {
//         const response = await fetch(`${apiUrl}/api/code/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify(data),
//         });

//         const result: ICodeResponse = await response.json();
//         if (response.ok) {
//             revalidatePath('/code'); // 캐시 무효화
//             return result as ICodeResponse;
//         } else {
//             return {
//                 isSuccess: false,
//                 message: `Response Not OK: ${result.message}`,
//                 data: null,
//             };
//         }
//     } catch (err) {
//         return {
//             isSuccess: false,
//             message: `Submission failed: ${err}`,
//             data: null
//         }
//     }
// }

// * DELETE Code Data
// export async function deleteCode(id: number): Promise<ICodeResponse | null> {

//     const token = await getServerToken();

//     if (!token) {
//         // redirect('/membership/sign-in');
//         return { isSuccess: false, message: '로그인이 필요합니다.', data: null };
//     }

//     try {
//         const response = await fetch(`${apiUrl}/api/code/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         const result: ICodeResponse = response.ok
//             ? { isSuccess: true, message: '삭제 성공', data: null }
//             : await response.json();

//         if (response.ok) {
//             revalidatePath('/code'); // 캐시 무효화
//             return result as ICodeResponse;
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || '코드 삭제에 실패했습니다.');
//         }
//     } catch (err) {
//         return {
//             isSuccess: false,
//             message: `Deletion failed: ${err}`,
//             data: null,
//         };
//     }
// }
