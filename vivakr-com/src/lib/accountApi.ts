// src/lib/accountApi.ts
import { IAuthResponseDTO, IDeleteAccountDTO } from '@/interfaces/i-auth-response';
import { getToken, isAdmin } from '@/services/auth.service';

export async function deleteAccount(email: string): Promise<IAuthResponseDTO> {

    const token = await getToken();
    if (!token || !isAdmin()) throw new Error('권한이 없습니다.');

    const deleteAccountDto: IDeleteAccountDTO = {
        email: email,
        password: 'HelloWorld#FineThanks234AndYou'
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/account/delete`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(deleteAccountDto),
    });

    const result = await response.json();
    return result;
}
